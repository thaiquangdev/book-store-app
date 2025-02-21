import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './review.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewService: ReviewsService) {}

  // Endpoint: Tạo mới một đánh giá - user
  // Method: POST
  // Url: /reviews/
  @UseGuards(AuthGuard)
  @Post('')
  async createReview(
    @Req() request: Request,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<{ message: string }> {
    const { id } = request['user'];
    return this.reviewService.createReview(String(id), createReviewDto);
  }

  // Endpoint: Cập nhật đánh giá - user
  // Method: PUT
  // Url: /reviews/:rid
  @UseGuards(AuthGuard)
  @Put('/:rid')
  async updateReview(
    @Req() request: Request,
    @Param('rid') rid: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<{ message: string }> {
    const { id } = request['user'];
    return this.reviewService.updateReview(String(id), rid, updateReviewDto);
  }

  // Endpoint: Xem danh đánh giá - user
  // Method: GET
  // Url: /reviews/
  @Get()
  async getReviews(): Promise<Review[]> {
    return this.reviewService.getReviews();
  }

  // Endpoint: Thích đánh giá - user
  // Method: POST
  // Url: /reviews/like-review
  @UseGuards(AuthGuard)
  @Post('/like-review')
  async likeReview(
    @Req() request: Request,
    @Body('rid') rid: string,
  ): Promise<{ message: string }> {
    const { id } = request['user'];
    return this.reviewService.likeReview(String(id), rid);
  }

  // Endpoint: Báo cáo đánh giá - user
  // Method: POST
  // Url: /reviews/report-review
  @UseGuards(AuthGuard)
  @Post('/report-review')
  async reportReview(
    @Req() request: Request,
    @Body() body: { rid: string; reason: string },
  ): Promise<{ message: string }> {
    const { id } = request['user'];
    return this.reviewService.reportReview(String(id), body.rid, body.reason);
  }
}
