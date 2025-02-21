import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { LikeReview } from './like-review.entity';
import { ReportReview } from './report-review.entity';
import { User } from '../users/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Product } from '../products/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, LikeReview, ReportReview, User, Product]),
    JwtModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
