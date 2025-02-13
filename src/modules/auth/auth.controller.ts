import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterOtpDto } from './dto/register-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Endpoint: đăng ký tài khoản
  // Method: POST
  // url: /auth/register-otp
  @Post('/register-otp')
  @UsePipes(new ValidationPipe({ transform: true }))
  async registerOtp(@Body() registerOtpDto: RegisterOtpDto): Promise<{
    message: string;
    user: {
      username: string;
      email: string;
      phoneNumber: string;
      emailVerify: boolean;
    };
  }> {
    return this.authService.registerOtp(registerOtpDto);
  }
}
