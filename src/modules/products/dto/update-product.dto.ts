import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({ example: 'Sách 1', description: 'Tên sách', required: false })
  @IsOptional()
  productName?: string;

  @ApiProperty({ example: 20000, description: 'Giá sách', required: false })
  @IsOptional()
  price?: number;

  @ApiProperty({ example: 'Mô tả sách', description: 'Mô tả', required: false })
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'VTV', description: 'Nhà cung cấp', required: false })
  @IsOptional()
  supplier?: string;

  @ApiProperty({ example: 'Tố Hữu', description: 'Tác giả', required: false })
  @IsOptional()
  author?: string;

  @ApiProperty({
    example: 'THiếu Nhi',
    description: 'Nhà cung cấp',
    required: false,
  })
  @IsOptional()
  publisher?: string;

  @ApiProperty({
    example: 'Bìa cứng',
    description: 'Loại bìa',
    required: false,
  })
  @IsOptional()
  coverFormat?: string;

  @ApiProperty({ example: 2020, description: 'Năm xuất bản', required: false })
  @IsOptional()
  yearOfPublication?: number;

  @ApiProperty({
    example: 'Tiếng Việt',
    description: 'Ngôn ngữ',
    required: false,
  })
  @IsOptional()
  language?: string;

  @ApiProperty({ example: 200, description: 'Số trang', required: false })
  @IsOptional()
  pageOfNumber?: number;
}
