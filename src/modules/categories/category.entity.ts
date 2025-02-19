import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'category_name', nullable: false })
  categoryName: string;

  @Column({ name: 'category_slug', nullable: false })
  categorySlug: string;
}
