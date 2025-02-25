import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({ example: 'Văn học', description: 'Tên loại sách' })
  @IsNotEmpty({ message: 'Tên loại sản phẩm không được để trống' })
  categoryName: string;
}
