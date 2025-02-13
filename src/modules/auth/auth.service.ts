import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { RegisterOtpDto } from './dto/register-otp.dto';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  // Hàm kiểm tra email đã tồn tại chưa
  private async checkEmailExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    return !!user; // Trả về true nếu email đã tồn tại
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
    try {
      // Kiểm tra email đã tồn tại chưa
      const emailExists = await this.checkEmailExists(email);
      if (emailExists) {
        throw new HttpException('Email đã tồn tại', HttpStatus.BAD_REQUEST);
      }

      // Hash mật khẩu
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const hashedPassword = (await bcrypt.hash(password, 12)) as string;

      // Tạo OTP
      const otp: string = crypto.randomInt(100000, 999999).toString();
      const otpExpiry: Date = new Date();
      otpExpiry.setMinutes(otpExpiry.getMinutes() + 5); // OTP hết hạn sau 5 phút

      // Tạo user mới
      const newUser: User = this.userRepository.create({
        email,
        username: userName,
        phoneNumber,
        password: hashedPassword,
        otp,
        otpExpiry,
      });

      // Lưu user vào DB
      const savedUser: User = await this.userRepository.save(newUser);

      // Trả về kết quả
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
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(
        'Lỗi không xác định',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
