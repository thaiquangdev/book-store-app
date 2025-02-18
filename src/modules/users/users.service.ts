import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { ChangeProfileDto } from './dto/change-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { comparePassword, hashPassword } from 'src/common/utils/password.util';
import * as crypto from 'crypto';
import { MailService } from '../mail/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  // thay đổi thông tin người dùng
  async changeProfile(changeProfileDto: ChangeProfileDto, id: string) {
    // ✅ Tìm user theo ID
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('Không tìm thấy người dùng');
    }

    // ✅ Kiểm tra nếu số điện thoại đã tồn tại ở user khác
    if (
      changeProfileDto.phoneNumber &&
      changeProfileDto.phoneNumber !== user.phoneNumber
    ) {
      const existingUser = await this.userRepository.findOne({
        where: { phoneNumber: changeProfileDto.phoneNumber },
      });

      if (existingUser) {
        throw new BadRequestException('Số điện thoại này đã được sử dụng');
      }
    }

    //✅ Cập nhật thông tin
    user.username = changeProfileDto.username || user.username;
    user.phoneNumber = changeProfileDto.phoneNumber || user.phoneNumber;

    await this.userRepository.save(user);
    return {
      message: 'Thay đổi thông tin người dùng thành công',
    };
  }

  // thay đổi mật khẩu
  async changePassword(changePasswordDto: ChangePasswordDto, id: string) {
    // ✅ Tìm user theo ID
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('Không tìm thấy người dùng');
    }

    // ✅ Kiểm tra mật khẩu cũ đúng không
    const isPasswordValid = comparePassword(
      changePasswordDto.oldPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Mật khẩu cũ không đúng');
    }

    // ✅ Tạo mật khẩu mới
    const hashedPassword = hashPassword(changePasswordDto.newPassword);

    // ✅ Lưu vào db
    user.password = hashedPassword;

    await this.userRepository.save(user);

    return {
      message: 'Thay đổi mật khẩu thành công',
    };
  }

  // quên mật khẩu - gửi mail
  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('Không tìm thấy người dùng');
    }
    // tạo mới token
    const token = crypto.randomBytes(32).toString('hex');
    const tokenExpire = new Date(Date.now() + 15 * 60 * 1000);

    user.passwordResetToken = token;
    user.passwordResetExpiry = tokenExpire;
    await this.userRepository.save(user);

    try {
      await this.mailService.forgotPassword(email, token);
    } catch {
      throw new HttpException(
        'Không thể gửi email. Vui lòng thử lại sau.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      message: 'Gửi mail thành công. Hãy kiểm tra email của bạn',
    };
  }

  // đặt lại mật khẩu
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // ✅ Kiểm tra user có tồn tại với token không
    const user = await this.userRepository.findOne({
      where: { passwordResetToken: resetPasswordDto.token },
    });
    if (!user) {
      throw new BadRequestException('Token không đúng hoặc hết hạn');
    }

    // ✅ Kiểm tra thời gian hết hạn của token
    if (user.passwordResetExpiry && new Date() > user.passwordResetExpiry) {
      throw new BadRequestException('Token không đúng hoặc hết hạn');
    }

    // ✅ Xóa token trước khi cập nhật mật khẩu (tránh bị dùng lại nếu lỗi)
    user.passwordResetToken = null;
    user.passwordResetExpiry = null;

    // ✅ Hash mật khẩu mới
    const hashedPassword = hashPassword(resetPasswordDto.newPassword);
    user.password = hashedPassword;

    await this.userRepository.save(user);
    return {
      message: 'Đặt lại mật khẩu thành công',
    };
  }
}
