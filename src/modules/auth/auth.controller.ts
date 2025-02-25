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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Endpoint: đăng ký tài khoản
  // Method: POST
  // url: /auth/register-otp
  @Post('/register-otp')
  @ApiOperation({ summary: 'Đăng ký người dùng gửi OTP qua mail' })
  @ApiResponse({
    status: 201,
    description: 'Đăng ký thành công, hãy kiểm tra email',
  })
  @ApiResponse({
    status: 400,
    description: 'Người dùng này đã tồn tại',
  })
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
  @ApiOperation({ summary: 'Xác minh tài khoản bằng OTP' })
  @ApiResponse({ status: 200, description: 'Xác minh tài khoản thành công' })
  @ApiResponse({ status: 400, description: 'Mã otp không đúng hoặc hết hạn' })
  @Post('/verify-otp')
  async verifyOtp(@Body() body: VerifyOtpDto): Promise<{ message: string }> {
    return this.authService.verifyOtp(body.email, body.otp);
  }

  // Endpoint: đăng nhập
  // Method: POST
  // url: /auth/login
  @ApiOperation({ summary: 'Đăng nhập' })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công' })
  @ApiResponse({ status: 400, description: 'Email hoặc mật khẩu không đúng' })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.login(loginDto);
  }

  // Endpoint: đăng xuất
  // Method: GET
  // url: /auth/logout
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đăng xuất' })
  @ApiResponse({ status: 200, description: 'Đăng xuất thành công' })
  @ApiResponse({ status: 401, description: 'Bạn chưa đăng nhập' })
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
