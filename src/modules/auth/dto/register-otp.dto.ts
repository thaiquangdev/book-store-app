/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsNotEmpty, MinLength, Length } from 'class-validator';

export class RegisterOtpDto {
  @IsNotEmpty({ message: 'Tên người dùng không được để trống' })
  userName: string;

  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu tối thiểu phải 6 ký tự' })
  password: string;

  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @Length(10, 10, { message: 'Số điện thoại phải có đúng 10 ký tự' })
  phoneNumber: string;
}
