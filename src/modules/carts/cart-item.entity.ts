import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../products/product.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' }) // ✅ Liên kết với giỏ hàng
  cart: Cart;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' }) // ✅ Liên kết với sản phẩm
  product: Product;

  @Column({ type: 'int', default: 1 }) // ✅ Số lượng sản phẩm trong giỏ hàng
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 }) // ✅ Lưu giá tại thời điểm thêm vào giỏ
  price: number;
}
