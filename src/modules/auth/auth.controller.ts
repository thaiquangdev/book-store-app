import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterOtpDto } from './dto/register-otp.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { Request } from 'express';

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

  // Endpoint: xác thực otp
  // Method: POST
  // url: /auth/verify-otp
  @Post('/verify-otp')
  async verifyOtp(
    @Body() body: { email: string; otp: string },
  ): Promise<{ message: string }> {
    return this.authService.verifyOtp(body.email, body.otp);
  }

  // Endpoint: đăng nhập
  // Method: POST
  // url: /auth/login
  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.login(loginDto);
  }

  // Endpoint: đăng xuất
  // Method: GET
  // url: /auth/logout
  @UseGuards(AuthGuard)
  @Get('/logout')
  async logout(@Req() req: Request): Promise<{ message: string }> {
    const { id } = req['user'];
    return this.authService.logout(String(id));
  }

  // Endpoint: tạo mới accessToken và refreshToken
  // Method: POST
  // url: /auth/refresh-token
  @Post('/refresh-token')
  async refreshToken(
    @Body() refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.refreshToken(refreshToken);
  }
}
