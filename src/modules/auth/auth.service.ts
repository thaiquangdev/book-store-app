import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { RegisterOtpDto } from './dto/register-otp.dto';
import { User } from '../users/user.entity';
import { MailService } from '../mail/mail.service';
import { LoginDto } from './dto/login.dto';
import { generateOtp } from 'src/common/utils/otp.util';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { comparePassword, hashPassword } from 'src/common/utils/password.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // Hàm kiểm tra email đã tồn tại chưa
  private async checkEmailExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    return !!user; // Trả về true nếu email đã tồn tại
  }

  // hàm generate token
  private async generateToken(payload: {
    id: string;
    email: string;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN'),
    });
    await this.userRepository.update(
      { email: payload.email },
      {
        refreshToken,
      },
    );
    return { accessToken, refreshToken };
  }

  // Đăng ký tài khoản và gửi OTP
  async registerOtp(registerOtpDto: RegisterOtpDto): Promise<{
    message: string;
    user: {
      username: string;
      email: string;
      phoneNumber: string;
      emailVerify: boolean;
    };
  }> {
    const { email, userName, phoneNumber, password } = registerOtpDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Kiểm tra email đã tồn tại chưa
      const emailExists = await this.checkEmailExists(email);
      if (emailExists) {
        throw new HttpException('Email đã tồn tại', HttpStatus.BAD_REQUEST);
      }

      // Hash mật khẩu
      const hashedPassword = hashPassword(password);

      // Tạo OTP
      const { otp, otpExpiry } = generateOtp();

      // Tạo user mới
      const newUser: User = this.userRepository.create({
        email,
        username: userName,
        phoneNumber,
        password: hashedPassword,
        otp,
        otpExpiry,
      });

      // Lưu user vào DB trong transaction
      const savedUser: User = await queryRunner.manager.save(newUser);

      // Gửi mail OTP
      try {
        await this.mailService.sendOtp(
          savedUser.email,
          savedUser.otp as string,
        );
      } catch {
        await queryRunner.rollbackTransaction(); // ✅ Rollback nếu gửi email thất bại
        throw new HttpException(
          'Không thể gửi email. Vui lòng thử lại sau.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      await queryRunner.commitTransaction(); // ✅ Commit nếu không có lỗi
      return {
        message: 'Đăng ký thành công. Vui lòng kiểm tra email để nhận OTP.',
        user: {
          username: savedUser.username,
          email: savedUser.email,
          phoneNumber: savedUser.phoneNumber,
          emailVerify: savedUser.emailVerify,
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction(); // ✅ Rollback nếu có lỗi
      throw new HttpException(
        error instanceof Error ? error.message : 'Lỗi không xác định',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  // Xác nhận OTP
  async verifyOtp(email: string, otp: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException(
        'Không tìm thấy người dùng',
        HttpStatus.NOT_FOUND,
      );
    }

    // kiểm tra xem otp có null hay không
    if (!user.otp || !user.otpExpiry) {
      throw new HttpException(
        'OTP không hợp lệ hoặc đã xác thực trước đó',
        HttpStatus.BAD_REQUEST,
      );
    }
    // so sánh otp có đúng không
    if (user.otp !== otp) {
      throw new HttpException('Mã OTP không đúng', HttpStatus.BAD_REQUEST);
    }

    // kiểm tra xem otp có còn hạn không
    if (new Date(user.otpExpiry).getTime() < Date.now()) {
      throw new HttpException('Mã OTP đã hết hạn', HttpStatus.BAD_REQUEST);
    }

    // Cập nhật trạng thái xác thực email
    user.emailVerify = true;
    user.otp = null;
    user.otpExpiry = null;

    await this.userRepository.save(user);

    return { message: 'Xác thực OTP thành công!' };
  }

  // đăng nhập tài khoản
  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = loginDto;

    // ✅ Tìm user theo email
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('Email hoặc mật khẩu không đúng');
    }

    // ✅ So sánh mật khẩu
    const isPasswordValid = comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Email hoặc mật khẩu không đúng');
    }

    // ✅ Nếu user chưa xác thực email, gửi lại OTP
    if (!user.emailVerify) {
      const { otp, otpExpiry } = generateOtp();
      user.otp = otp;
      user.otpExpiry = otpExpiry;

      await this.userRepository.save(user);

      try {
        await this.mailService.sendOtp(user.email, otp);
      } catch {
        throw new HttpException(
          'Không thể gửi email. Vui lòng thử lại sau.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      throw new HttpException(
        'Tài khoản chưa xác thực. Một mã OTP mới đã được gửi đến email của bạn.',
        HttpStatus.FORBIDDEN,
      );
    }

    // ✅ Nếu user đã xác thực, tạo token đăng nhập
    const token = await this.generateToken({ id: user.id, email: user.email });

    // ✅ Lưu refreshToken vào db
    user.refreshToken = token.refreshToken;
    await this.userRepository.save(user);
    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };
  }

  // đăng xuất
  async logout(id: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('Không tìm thấy người dùng');
    }
    user.refreshToken = null;
    await this.userRepository.save(user);
    return {
      message: 'Đăng xuất thành công',
    };
  }

  // tạo mới accessToken và refreshToken
  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // ✅ Kiểm tra refreshToken có hợp lệ không
    let payload: { userId: string; email: string };
    try {
      payload = await this.jwtService.verifyAsync<{
        userId: string;
        email: string;
      }>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException(
        'Refresh Token không hợp lệ hoặc đã hết hạn',
      );
    }

    // ✅ Kiểm tra user có tồn tại & refreshToken có khớp không
    const user = await this.userRepository.findOne({
      where: { id: payload.userId },
    });
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Refresh Token không hợp lệ');
    }

    // ✅ Tạo accessToken & refreshToken mới
    const token = await this.generateToken({ id: user.id, email: user.email });

    // ✅ Cập nhật refreshToken mới vào database
    user.refreshToken = token.refreshToken;
    await this.userRepository.save(user);

    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };
  }
}
