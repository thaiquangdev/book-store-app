import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { Inventory } from './inventory.entity';
import { Wishlist } from '../wishlists/wishlist.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  productName: string;

  @Column({ unique: true })
  productSlug: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  supplier: string;

  @Column({ nullable: true })
  author: string;

  @Column({ nullable: true })
  publisher: string;

  @Column({ nullable: true })
  coverFormat: string;

  @Column({ type: 'int', nullable: true })
  yearOfPublication: number;

  @Column({ nullable: true })
  language: string;

  @Column({ type: 'int', nullable: true })
  pageOfNumber: number;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  avgRating: number;

  // ✅ Quan hệ 1-N: Một sản phẩm có nhiều ảnh
  @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
  images: ProductImage[];

  // ✅ Một sản phẩm có một kho
  @OneToOne(() => Inventory, (inventory) => inventory.product, {
    cascade: true,
  })
  @JoinColumn({ name: 'inventory_id' })
  inventory: Inventory;

  @OneToMany(() => Wishlist, (wishlist) => wishlist.product)
  wishlists: Wishlist[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
