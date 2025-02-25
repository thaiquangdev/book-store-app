import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsUUID } from 'class-validator';

export class CartDto {
  @ApiProperty()
  @IsUUID('4', { message: 'ID sản phẩm không hợp lệ' })
  productId: string;

  @ApiProperty()
  @IsInt({ message: 'Số lượng phải là số nguyên' })
  @IsPositive({ message: 'Số lượng phải lớn hơn 0' })
  quantity: number;
}
