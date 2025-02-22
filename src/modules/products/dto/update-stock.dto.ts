import { IsEnum, IsInt, IsUUID, Min } from 'class-validator';
import { StockType } from 'src/common/enums/stock-type.enum';

export class UpdateStockDto {
  @IsUUID()
  pid: string;

  @IsInt()
  @Min(1, { message: 'Số lượng phải lớn hơn 0' })
  quantity: number;

  @IsEnum(['IMPORT', 'EXPORT'], { message: 'Loại giao dịch không hợp lệ' })
  type: StockType;
}
