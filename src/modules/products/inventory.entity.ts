import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Product, (product) => product.inventory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' }) // ✅ Liên kết với Product
  product: Product;

  @Column({ type: 'int', default: 0 }) // ✅ Số lượng hàng tồn kho
  stock: number;

  @Column({ type: 'int', default: 0 }) // ✅ Số lượng đã bán
  sold: number;

  @Column({ type: 'int', default: 0 }) // ✅ Số lượng đã nhập
  imported: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // ✅ Ngày cập nhật kho
  updatedAt: Date;
}
