import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateAddressDto {
  @ApiProperty({
    example: 'Thái Mai Tèo',
    description: 'Họ vàn tên khách hàng',
    required: false,
  })
  @IsOptional()
  fullName?: string;

  @ApiProperty({
    example: '0984545321',
    description: 'Số điện thoại khách hàng',
    required: false,
  })
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    example: '239 Tố Hữu',
    description: 'Tên đường khách hàng',
    required: false,
  })
  @IsOptional()
  street?: string;

  @ApiProperty({
    example: 'Đà Nẵng',
    description: 'Tên thành phố khách hàng',
    required: false,
  })
  @IsOptional()
  city?: string;

  @ApiProperty({
    example: 'Đà Nẵng',
    description: 'Tên tỉnh khách hàng',
    required: false,
  })
  @IsOptional()
  state?: string;

  @ApiProperty({
    example: 'Việt Nam',
    description: 'Tên Nước khách hàng',
    required: false,
  })
  @IsOptional()
  country?: string;

  @ApiProperty({
    example: '550000',
    description: 'Mã code tỉnh thành',
    required: false,
  })
  @IsOptional()
  zipCode?: string;
}
