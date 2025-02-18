import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendOtp(email: string, otp: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Mã xác thực OTP của bạn',
        text: `Mã OTP của bạn là: ${otp}`,
        html: `<p>Mã OTP của bạn là: <b>${otp}</b></p>`,
      });
    } catch (error) {
      console.error('Lỗi khi gửi email:', error);
      throw new Error('Không thể gửi email OTP');
    }
  }

  async forgotPassword(email: string, url: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Đặt lại mật khẩu',
        text: `Link đặt lại mật khẩu`,
        html: `<p>Nhấn vào link này để đặt lại mật khẩu: <a href="${url}">nhấn vào đây</a></p>`,
      });
    } catch (error) {
      console.error('Lỗi khi gửi email:', error);
      throw new Error('Không thể gửi email OTP');
    }
  }
}
