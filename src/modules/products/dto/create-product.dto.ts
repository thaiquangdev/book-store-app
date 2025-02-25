import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Sách 1', description: 'Tên sách' })
  @IsNotEmpty({ message: 'Tên sách không được để trống' })
  productName: string;

  @ApiProperty({ example: 20000, description: 'Giá sách' })
  @IsNotEmpty({ message: 'Giá sách không được để trống' })
  price: number;

  @ApiProperty({ example: 'Mô tả sách', description: 'Mô tả' })
  @IsNotEmpty({ message: 'Mô tả sách không được để trống' })
  description: string;

  @ApiProperty({ example: 'VTV', description: 'Nhà cung cấp' })
  @IsNotEmpty({ message: 'Nhà cung cấp không được để trống' })
  supplier: string;

  @ApiProperty({ example: 'Tố Hữu', description: 'Tác giả' })
  @IsNotEmpty({ message: 'Tác giả không được để trống' })
  author: string;

  @ApiProperty({ example: 'THiếu Nhi', description: 'Nhà cung cấp' })
  @IsNotEmpty({ message: 'Nhà xuất bản không được để trống' })
  publisher: string;

  @ApiProperty({ example: 'Bìa cứng', description: 'Loại bìa' })
  @IsNotEmpty({ message: 'Loại bìa không được để trống' })
  coverFormat: string;

  @ApiProperty({ example: 2020, description: 'Năm xuất bản' })
  @IsNotEmpty({ message: 'Năm xuất bản không được để trống' })
  yearOfPublication: number;

  @ApiProperty({ example: 'Tiếng Việt', description: 'Ngôn ngữ' })
  @IsNotEmpty({ message: 'Ngôn ngữ không được để trống' })
  language: string;

  @ApiProperty({ example: 200, description: 'Số trang' })
  @IsNotEmpty({ message: 'Số trang không được để trống' })
  pageOfNumber: number;
}
