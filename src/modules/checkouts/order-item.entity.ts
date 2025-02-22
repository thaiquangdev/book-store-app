import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../products/product.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order: Order; // ✅ Đơn hàng chứa sản phẩm này

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  product: Product; // ✅ Sản phẩm trong đơn hàng

  @Column({ type: 'int' })
  quantity: number; // ✅ Số lượng sản phẩm đã mua

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number; // ✅ Lưu giá sản phẩm tại thời điểm đặt hàng
}
