import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsUUID, Min } from 'class-validator';
import { StockType } from 'src/common/enums/stock-type.enum';

export class UpdateStockDto {
  @ApiProperty()
  @IsUUID()
  pid: string;

  @ApiProperty()
  @IsInt()
  @Min(1, { message: 'Số lượng phải lớn hơn 0' })
  quantity: number;

  @ApiProperty()
  @IsEnum(['IMPORT', 'EXPORT'], { message: 'Loại giao dịch không hợp lệ' })
  type: StockType;
}
