import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Review } from '../reviews/review.entity';

@Entity('report_reviews')
export class ReportReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Review, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'review_id' })
  review: Review;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text' })
  reason: string;

  @CreateDateColumn()
  createdAt: Date;
}
