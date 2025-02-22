import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { StockType } from 'src/common/enums/stock-type.enum';

@Entity('stock_history')
export class StockHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' }) // ✅ Một sản phẩm có nhiều lịch sử kho
  product: Product;

  @Column({ type: 'int' })
  quantity: number; // ✅ Số lượng thay đổi (+ nhập hàng, - bán hàng)

  @Column({ type: 'enum', enum: StockType }) // ✅ Loại thay đổi kho
  type: StockType;

  @CreateDateColumn()
  createdAt: Date;
}
