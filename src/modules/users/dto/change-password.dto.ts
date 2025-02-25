import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: '123456', description: 'Nhập vào mật khẩu' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu tối thiểu phải 6 ký tự' })
  oldPassword: string;

  @ApiProperty({ example: '1234567', description: 'NHập vào mật khẩu mới' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu tối thiểu phải 6 ký tự' })
  newPassword: string;
}
