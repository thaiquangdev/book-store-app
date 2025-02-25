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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewService: ReviewsService) {}

  // Endpoint: Tạo mới một đánh giá - user
  // Method: POST
  // Url: /reviews/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo mới đánh giá' })
  @ApiResponse({ status: 201, description: 'Tạo mới đánh giá thành công' })
  @ApiResponse({ status: 400, description: 'Tạo mới đánh giá thất bại' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật đánh giá' })
  @ApiResponse({ status: 200, description: 'Cập nhật đánh giá thành công' })
  @ApiResponse({ status: 400, description: 'Cập nhật đánh giá thất bại' })
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
  @ApiOperation({ summary: 'Xem danh sách đánh giá' })
  @ApiResponse({ status: 200, description: 'Danh sách đánh giá' })
  @Get()
  async getReviews(): Promise<Review[]> {
    return this.reviewService.getReviews();
  }

  // Endpoint: Thích đánh giá - user
  // Method: POST
  // Url: /reviews/like-review
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thích đánh giá' })
  @ApiResponse({ status: 200, description: 'Thích đánh giá thành công' })
  @ApiResponse({ status: 400, description: 'Thích đánh giá thất bại' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Báo cáo đánh giá' })
  @ApiResponse({ status: 200, description: 'Báo cáo đánh giá thành công' })
  @ApiResponse({ status: 400, description: 'Báo cáo đánh giá thất bại' })
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
