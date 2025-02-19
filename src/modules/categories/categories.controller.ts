import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Roles } from 'src/common/decorators/roles.decoratior';
import { Role } from 'src/common/enums/role.enum';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // Endpoint: Tạo mới loại sản phẩm - admin
  // Method: POST
  // Url: categories/create-category
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('/create-category')
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  // Endpoint: Cập nhật loại sản phẩm - admin
  // Method: PUT
  // Url: categories/update-category/:slug
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Put('/update-category/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<{ message: string }> {
    return this.categoriesService.updateCategory(updateCategoryDto, id);
  }

  // Endpoint: Xóa loại sản phẩm - admin
  // Method: DELETE
  // Url: categories/delete-category/:slug
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete('/delete-category/:id')
  async deleteCategory(@Param('id') id: string): Promise<{ message: string }> {
    return this.categoriesService.deleteCategory(id);
  }

  // Endpoint: Xem tất cả loại sản phẩm - user
  // Method: GET
  // Url: categories/get-categories
  @Get('/get-categories')
  async getCategories(): Promise<Category[]> {
    return this.categoriesService.getAllCategory();
  }
}
