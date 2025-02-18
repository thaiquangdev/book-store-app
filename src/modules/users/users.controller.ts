import { Body, Controller, Put, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { ChangeProfileDto } from './dto/change-profile.dto';
import { Request } from 'express';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // Endpoint: thay đổi thông tin người dùng
  // Method: PUT
  // url: /users/change-profile
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
  @Put('/forgot-password')
  async forgotPassword(@Body() email: string): Promise<{ message: string }> {
    return this.userService.forgotPassword(email);
  }

  // Endpoint: đặt lại mật khẩu
  // Method: DELETE
  // url: /users/reset-password
  @Put('/forgot-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.userService.resetPassword(resetPasswordDto);
  }
}
