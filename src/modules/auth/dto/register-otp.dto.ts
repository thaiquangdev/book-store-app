import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, Length } from 'class-validator';

export class RegisterOtpDto {
  @ApiProperty({
    example: 'Thái Mai Quang',
    description: 'Họ và tên người dùng',
  })
  @IsNotEmpty({ message: 'Tên người dùng không được để trống' })
  userName: string;

  @ApiProperty({
    example: 'thaiquangqt2003@gmail.com',
    description: 'Email người dùng',
  })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({ example: '123456', description: 'Mật khẩu người dùng' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu tối thiểu phải 6 ký tự' })
  password: string;

  @ApiProperty({
    example: '0823423423',
    description: 'Số điện thoại người dùng',
  })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @Length(10, 10, { message: 'Số điện thoại phải có đúng 10 ký tự' })
  phoneNumber: string;
}
