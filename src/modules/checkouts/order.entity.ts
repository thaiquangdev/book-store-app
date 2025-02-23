import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Address } from '../address/address.entity';
import { OrderStatus } from 'src/common/enums/order-status.enum';
import { OrderItem } from './order-item.entity';
import { PaymentMethod } from 'src/common/enums/payment-method.enum'; // ✅ Import Enum

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];

  @ManyToOne(() => Address, { onDelete: 'SET NULL', nullable: true })
  address: Address;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: string;

  @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.COD }) // ✅ Thêm phương thức thanh toán
  paymentMethod: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
