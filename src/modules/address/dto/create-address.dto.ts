import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({
    example: 'Thái Mai Quang',
    description: 'Họ vàn tên khách hàng',
  })
  @IsString({ message: 'Họ và tên không đúng định dạng' })
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  fullName: string;

  @ApiProperty({
    example: '0984545321',
    description: 'Số điện thoại khách hàng',
  })
  @IsString({ message: 'Số điện thoại không đúng định dạng' })
  @IsNotEmpty({ message: 'Số đện thoại không được để trống' })
  phoneNumber: string;

  @ApiProperty({ example: '239 Tố Hữu', description: 'Tên đường khách hàng' })
  @IsString({ message: 'Tên đường không đúng định dạng' })
  @IsNotEmpty({ message: 'Tên đường không được để trống' })
  street: string;

  @ApiProperty({ example: 'Đà Nẵng', description: 'Tên thành phố khách hàng' })
  @IsString({ message: 'Tên thành phố không đúng định dạng' })
  @IsNotEmpty({ message: 'Tên thành phố không được để trống' })
  city: string;

  @ApiProperty({ example: 'Đà Nẵng', description: 'Tên tỉnh khách hàng' })
  @IsString({ message: 'Tỉnh không đúng định dạng' })
  @IsNotEmpty({ message: 'Tỉnh không được để trống' })
  state: string;

  @ApiProperty({ example: 'Việt Nam', description: 'Tên Nước khách hàng' })
  @IsNotEmpty({ message: 'Tên đất nước không được để trống' })
  @IsString({ message: 'Tên đất nước không đúng định dạng' })
  country: string;

  @ApiProperty({ example: '550000', description: 'Mã code tỉnh thành' })
  @IsString({ message: 'Mã code vùng không đúng định dạng' })
  @IsNotEmpty({ message: 'Mã code vùng không được để trống' })
  zipCode: string;
}
