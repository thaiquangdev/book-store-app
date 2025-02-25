import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Roles } from 'src/common/decorators/roles.decoratior';
import { Role } from 'src/common/enums/role.enum';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './category.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // Endpoint: Tạo mới loại sách - admin
  // Method: POST
  // Url: categories/create-category
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo mới loại sách' })
  @ApiResponse({ status: 201, description: 'Thêm mới loại sách thành công' })
  @ApiResponse({ status: 400, description: 'Thêm mới loại sách thất bại' })
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('/create-category')
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  // Endpoint: Cập nhật loại sách - admin
  // Method: PUT
  // Url: categories/update-category/:slug
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật loại sách' })
  @ApiResponse({ status: 201, description: 'Cập nhật loại sách thành công' })
  @ApiResponse({ status: 400, description: 'Cập nhật loại sách thất bại' })
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Put('/update-category/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<{ message: string }> {
    return this.categoriesService.updateCategory(updateCategoryDto, id);
  }

  // Endpoint: Xóa loại sách - admin
  // Method: DELETE
  // Url: categories/delete-category/:slug
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa loại sách' })
  @ApiResponse({ status: 201, description: 'Xóa loại sách thành công' })
  @ApiResponse({ status: 400, description: 'Xóa loại sách thất bại' })
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete('/delete-category/:id')
  async deleteCategory(@Param('id') id: string): Promise<{ message: string }> {
    return this.categoriesService.deleteCategory(id);
  }

  // Endpoint: Xem tất cả loại sách - user
  // Method: GET
  // Url: categories/get-categories
  @ApiOperation({ summary: 'Xem danh sách loại sách' })
  @ApiResponse({ status: 201, description: 'Danh sách loại sách thành công' })
  @Get('/get-categories')
  async getCategories(): Promise<Category[]> {
    return this.categoriesService.getAllCategory();
  }
}
