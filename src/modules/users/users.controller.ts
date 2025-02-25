import { Body, Controller, Put, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { ChangeProfileDto } from './dto/change-profile.dto';
import { Request } from 'express';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // Endpoint: thay đổi thông tin người dùng
  // Method: PUT
  // url: /users/change-profile
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thay đổi thông tin người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Thay đổi thông tin người dùng thành công',
  })
  @ApiResponse({
    status: 400,
    description: 'Thay đổi thông tin người dùng thất bại',
  })
  @UseGuards(AuthGuard)
  @Put('/change-profile')
  async changeProfile(
    @Body() changeProfileDto: ChangeProfileDto,
    @Req() req: Request,
  ) {
    const { id } = req['user'];
    return this.userService.changeProfile(changeProfileDto, String(id));
  }

  // Endpoint: thay đổi mật khẩu
  // Method: PUT
  // url: /users/change-password
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thay đổi mật khẩu' })
  @ApiResponse({
    status: 200,
    description: 'Thay đổi mật khẩu thành công',
  })
  @ApiResponse({
    status: 400,
    description: 'Thay đổi mật khẩu thất bại',
  })
  @UseGuards(AuthGuard)
  @Put('/change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request,
  ) {
    const { id } = req['user'];
    return this.userService.changePassword(changePasswordDto, String(id));
  }

  // Endpoint: quên mật khẩu
  // Method: PUT
  // url: /users/forgot-password
  @ApiOperation({ summary: 'Quên mật khẩu' })
  @ApiResponse({
    status: 200,
    description: 'Gửi mail thành công, vui lòng kiểm tra email',
  })
  @ApiResponse({
    status: 400,
    description: 'Gửi mail thất bại',
  })
  @Put('/forgot-password')
  async forgotPassword(@Body() email: string): Promise<{ message: string }> {
    return this.userService.forgotPassword(email);
  }

  // Endpoint: đặt lại mật khẩu
  // Method: PUT
  // url: /users/reset-password
  @ApiOperation({ summary: 'Đặt lại mật khẩu' })
  @ApiResponse({
    status: 200,
    description: 'Đặt lại mật khẩu thành công',
  })
  @ApiResponse({
    status: 400,
    description: 'Đặt lại mật khẩu thất bại',
  })
  @Put('/reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.userService.resetPassword(resetPasswordDto);
  }
}
