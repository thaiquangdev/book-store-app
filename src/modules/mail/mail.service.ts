import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

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
}
