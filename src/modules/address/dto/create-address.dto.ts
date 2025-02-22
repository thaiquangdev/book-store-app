import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString({ message: 'Họ và tên không đúng định dạng' })
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  fullName: string;

  @IsString({ message: 'Số điện thoại không đúng định dạng' })
  @IsNotEmpty({ message: 'Số đện thoại không được để trống' })
  phoneNumber: string;

  @IsString({ message: 'Tên đường không đúng định dạng' })
  @IsNotEmpty({ message: 'Tên đường không được để trống' })
  street: string;

  @IsString({ message: 'Tên thành phố không đúng định dạng' })
  @IsNotEmpty({ message: 'Tên thành phố không được để trống' })
  city: string;

  @IsString({ message: 'Tỉnh không đúng định dạng' })
  @IsNotEmpty({ message: 'Tỉnh không được để trống' })
  state: string;

  @IsNotEmpty({ message: 'Tên đất nước không được để trống' })
  @IsString({ message: 'Tên đất nước không đúng định dạng' })
  country: string;

  @IsString({ message: 'Mã code vùng không đúng định dạng' })
  @IsNotEmpty({ message: 'Mã code vùng không được để trống' })
  zipCode: string;
}
