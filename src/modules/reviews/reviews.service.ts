import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { Product } from '../products/product.entity';
import { UpdateReviewDto } from './dto/update-review.dto';
import { LikeReview } from './like-review.entity';
import { ReportReview } from './report-review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(LikeReview)
    private readonly likeReviewRepository: Repository<LikeReview>,
    @InjectRepository(ReportReview)
    private readonly reportReviewRepository: Repository<ReportReview>,
    private readonly dataSource: DataSource,
  ) {}

  // hàm tính số sao trung bình trong sản phẩm
  private async calculateAvgRating(
    productId: string,
    queryRunner: QueryRunner,
  ) {
    // ✅ Lấy danh sách tất cả review của sản phẩm
    const product = await queryRunner.manager.findOne(Product, {
      where: { id: productId },
      relations: ['reviews'],
    });

    if (!product) {
      throw new BadRequestException('Không tìm thấy sản phẩm');
    }

    // ✅ Tính trung bình số sao
    const totalStars = product.reviews.reduce(
      (sum, review) => sum + review.star,
      0,
    );
    const avgRating = totalStars / product.reviews.length;

    // ✅ Cập nhật `avgRating` trong `Product`
    await queryRunner.manager.update(Product, product.id, { avgRating });

    return avgRating;
  }

  // tạo mới một bình luận
  async createReview(
    uid: string,
    createReviewDto: CreateReviewDto,
  ): Promise<{ message: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // ✅ Kiểm tra xem user đã đánh giá sản phẩm này chưa
      const existingReview = await queryRunner.manager.findOne(Review, {
        where: { user: { id: uid }, product: { id: createReviewDto.pid } },
      });

      if (existingReview) {
        throw new BadRequestException('Bạn đã đánh giá sản phẩm này');
      }

      // ✅ Tạo mới đánh giá
      const newReview = queryRunner.manager.create(Review, {
        user: { id: uid },
        product: { id: createReviewDto.pid },
        comment: createReviewDto.comment,
        star: createReviewDto.star,
      });

      await queryRunner.manager.save(newReview);

      // ✅ Tính trung bình số sao mới của sản phẩm
      await this.calculateAvgRating(createReviewDto.pid, queryRunner);

      // ✅ Commit transaction
      await queryRunner.commitTransaction();

      return { message: 'Đánh giá sản phẩm thành công' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // cập nhật đánh giá sản phẩm
  async updateReview(
    uid: string,
    rid: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<{ message: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // ✅ Kiểm tra xem đánh giá này có tồn tại không & có thuộc user không
      const reviewExist = await queryRunner.manager.findOne(Review, {
        where: { id: rid },
        relations: ['user', 'product'],
      });

      if (!reviewExist) {
        throw new BadRequestException('Không tìm thấy đánh giá này');
      }

      if (reviewExist.user.id !== uid) {
        throw new BadRequestException(
          'Bạn không thể sửa đánh giá của người khác',
        );
      }

      // ✅ Cập nhật đánh giá
      reviewExist.star = updateReviewDto.star ?? reviewExist.star;
      reviewExist.comment = updateReviewDto.comment ?? reviewExist.comment;

      await queryRunner.manager.save(reviewExist);

      // ✅ Tính trung bình số sao mới của sản phẩm
      await this.calculateAvgRating(updateReviewDto.pid, queryRunner);

      // ✅ Commit transaction
      await queryRunner.commitTransaction();

      return { message: 'Cập nhật đánh giá sản phẩm thành công' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // xem danh sách đánh giá
  async getReviews(): Promise<Review[]> {
    return this.reviewRepository.find({
      relations: {
        likes: true,
      },
    });
  }

  // thích đánh giá
  async likeReview(uid: string, rid: string): Promise<{ message: string }> {
    // ✅ Kiểm tra xem review có tồn tại không
    const review = await this.reviewRepository.findOne({ where: { id: rid } });
    if (!review) {
      throw new BadRequestException('Không tìm thấy đánh giá');
    }

    // ✅ Kiểm tra xem user đã thích review này chưa
    const existingLike = await this.likeReviewRepository.findOne({
      where: { user: { id: uid }, review: { id: rid } },
    });

    if (existingLike) {
      throw new BadRequestException('Bạn đã thích đánh giá này');
    }

    // ✅ Thêm like mới
    const newLike = this.likeReviewRepository.create({
      user: { id: uid },
      review: { id: rid },
    });

    await this.likeReviewRepository.save(newLike);

    return { message: 'Thích đánh giá thành công' };
  }

  // báo cáo đánh giá
  async reportReview(
    uid: string,
    rid: string,
    reason: string,
  ): Promise<{ message: string }> {
    // ✅ Kiểm tra xem review có tồn tại không
    const review = await this.reviewRepository.findOne({ where: { id: rid } });
    if (!review) {
      throw new BadRequestException('Không tìm thấy đánh giá');
    }

    // ✅ Kiểm tra xem user đã báo cáo review này chưa
    const existingReport = await this.reportReviewRepository.findOne({
      where: { user: { id: uid }, review: { id: rid } },
    });

    if (existingReport) {
      throw new BadRequestException('Bạn đã báo cáo đánh giá này trước đó');
    }

    // ✅ Tạo báo cáo mới
    const newReport = this.reportReviewRepository.create({
      user: { id: uid },
      review: { id: rid },
      reason,
    });

    await this.reportReviewRepository.save(newReport);

    return { message: 'Báo cáo đánh giá thành công' };
  }
}
