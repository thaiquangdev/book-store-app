import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import slugify from 'slugify';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // tạo mới một loại sản phẩm
  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const categorySlug = slugify(createCategoryDto.categoryName, {
      lower: true,
    });

    // ✅ Kiểm tra xem loại sản phẩm đã tồn tại chưa
    const category = await this.categoryRepository.findOne({
      where: { categorySlug },
    });
    if (category) {
      throw new BadRequestException('Loại sản phẩm này đã tồn tại');
    }

    // ✅ Tạo mới loại sản phẩm
    const newCategory = this.categoryRepository.create({
      categoryName: createCategoryDto.categoryName,
      categorySlug,
    });

    await this.categoryRepository.save(newCategory);

    return newCategory;
  }

  // cập nhật loại sản phẩm
  async updateCategory(
    updateCategoryDto: UpdateCategoryDto,
    id: string,
  ): Promise<{ message: string }> {
    // ✅ Kiểm tra xem loại sản phẩm đã tồn tại chưa
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new BadRequestException('Loại sản phẩm này chưa tồn tại');
    }

    // ✅ Tạo slug mới
    const newSlug = slugify(updateCategoryDto.categoryName, { lower: true });

    // ✅ Kiểm tra nếu slug mới đã tồn tại
    if (newSlug !== category.categorySlug) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { categorySlug: newSlug },
      });
      if (existingCategory) {
        throw new BadRequestException(
          'Slug mới đã tồn tại, vui lòng chọn tên khác',
        );
      }
    }

    // ✅ Cập nhật thông tin
    category.categoryName = updateCategoryDto.categoryName;
    category.categorySlug = newSlug;

    await this.categoryRepository.save(category);

    return {
      message: 'Cập nhật loại sản phẩm thành công',
    };
  }

  // xóa loại sản phẩm
  async deleteCategory(id: string): Promise<{ message: string }> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new BadRequestException('Không tìm thấy loại sản phẩm');
    }

    await this.categoryRepository.remove(category);
    return {
      message: 'Xóa loại sản phẩm thành công',
    };
  }

  // lấy ra tất cả sản phẩm
  async getAllCategory(): Promise<Category[]> {
    return this.categoryRepository.find();
  }
}
