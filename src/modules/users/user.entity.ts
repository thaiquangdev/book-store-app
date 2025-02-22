import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Wishlist } from '../wishlists/wishlist.entity';
import { Cart } from '../carts/cart.entity';
import { Address } from '../address/address.entity';
import { Order } from '../checkouts/order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_name', nullable: false })
  username: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ name: 'phone_number', unique: true, nullable: false })
  phoneNumber: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false, default: 'user' })
  role: string;

  @Column({ name: 'refresh_token', type: 'varchar', nullable: true })
  refreshToken: string | null;

  @Column({ name: 'password_reset_token', type: 'varchar', nullable: true })
  passwordResetToken: string | null;

  @Column({
    name: 'password_reset_expiry',
    type: 'timestamp',
    nullable: true,
  })
  passwordResetExpiry: Date | null;

  @Column({ name: 'email_verify', default: false })
  emailVerify: boolean;

  @Column({ type: 'varchar', length: 6, nullable: true }) // ✅ OTP là chuỗi tối đa 6 ký tự
  otp: string | null;

  @Column({ type: 'timestamp', nullable: true }) // ✅ Định rõ kiểu timestamp
  otpExpiry: Date | null;

  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlists: Wishlist[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' }) // ✅ Dùng UpdateDateColumn thay vì CreateDateColumn
  updatedAt: Date;
}
