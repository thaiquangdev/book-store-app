import { IsNotEmpty } from 'class-validator';

export class UpdateCategoryDto {
  @IsNotEmpty({ message: 'Tên loại sản phẩm không được để trống' })
  categoryName: string;
}
