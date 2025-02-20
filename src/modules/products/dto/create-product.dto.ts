import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  productName: string;

  @IsNotEmpty({ message: 'Giá sản phẩm không được để trống' })
  price: number;

  @IsNotEmpty({ message: 'Mô tả sản phẩm không được để trống' })
  description: string;

  @IsNotEmpty({ message: 'Nhà cung cấp không được để trống' })
  supplier: string;

  @IsNotEmpty({ message: 'Tác giả không được để trống' })
  author: string;

  @IsNotEmpty({ message: 'Nhà xuất bản không được để trống' })
  publisher: string;

  @IsNotEmpty({ message: 'Loại bìa không được để trống' })
  coverFormat: string;

  @IsNotEmpty({ message: 'Năm xuất bản không được để trống' })
  yearOfPublication: number;

  @IsNotEmpty({ message: 'Ngôn ngữ không được để trống' })
  language: string;

  @IsNotEmpty({ message: 'Số trang không được để trống' })
  pageOfNumber: number;
}
