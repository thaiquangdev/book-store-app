import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  Body,
  UseGuards,
  Put,
  Param,
  Get,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { storageConfig } from 'src/common/config/multer.config';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Roles } from 'src/common/decorators/roles.decoratior';
import { Role } from 'src/common/enums/role.enum';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import { ProductQueryDto } from './dto/product-query.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Endpoint: Tạo mới sản phẩm - admin
  // Method: POST
  // url: products/create-product
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('create-product')
  @UseInterceptors(
    FilesInterceptor('image-product', 20, {
      storage: storageConfig('image-product'),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname).toLowerCase();
        const allowedExtArr = ['.jpg', '.png', '.jpeg', '.webp'];

        if (!allowedExtArr.includes(ext)) {
          return cb(
            new BadRequestException(
              `Lỗi: Chỉ hỗ trợ upload file ${allowedExtArr.join(', ')}`,
            ),
            false,
          );
        }

        if (file.size > 5 * 1024 * 1024) {
          return cb(
            new BadRequestException('Lỗi: Chỉ hỗ trợ upload file dưới 5MB'),
            false,
          );
        }

        cb(null, true);
      },
    }),
  )
  createProduct(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createProductDto: CreateProductDto,
  ): Promise<{ message: string; product: Product }> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Không có file nào được upload');
    }
    const imageUrls = files.map(
      (file: { fieldname: string; filename: string }) =>
        file.fieldname + '/' + file.filename,
    );
    return this.productsService.createProduct(createProductDto, imageUrls);
  }

  // Endpoint: Cập nhật sản phẩm - admin
  // Method: PUT
  // url: products/update-product/:id
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(
    FilesInterceptor('image-product', 20, {
      storage: storageConfig('image-product'),
      fileFilter(req, file, cb) {
        const ext = extname(file.originalname).toLowerCase();
        const allowedExtArr = ['.jpg', '.png', '.jpeg', '.webp'];

        if (!allowedExtArr.includes(ext)) {
          return cb(
            new BadRequestException(
              `Lỗi: Chỉ hỗ trợ upload file ${allowedExtArr.join(', ')}`,
            ),
            false,
          );
        }

        if (file.size > 5 * 1024 * 1024) {
          return cb(
            new BadRequestException('Lỗi: Chỉ hỗ trợ upload file dưới 5MB'),
            false,
          );
        }

        cb(null, true);
      },
    }),
  )
  @Put('/update-product/:id')
  async updateProduct(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<{ message: string }> {
    const imageUrls = files.map(
      (file: { fieldname: string; filename: string }) =>
        file.fieldname + '/' + file.filename,
    );
    return this.productsService.updateProduct(id, updateProductDto, imageUrls);
  }

  // Endpoint: Xóa sản phẩm - admin
  // Method: DELETE
  // url: product/delete-product/:id
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete('/delete-product/:id')
  async deleteProduct(@Param('id') id: string): Promise<{ message: string }> {
    return this.productsService.deleteProduct(id);
  }

  // Endpoint: Xem chi tiết sản phẩm - user
  // Method: GET
  // url: products/:slug
  @Get('/:slug')
  async getProduct(@Param('slug') slug: string): Promise<Product> {
    return this.productsService.getProduct(slug);
  }

  // Endpoint: Xem danh sách sản phẩm - user
  // Method: GET
  // url: products/
  @Get('')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getProducts(@Query() query: ProductQueryDto): Promise<{
    message: string;
    total: number;
    page: number;
    limit: number;
    data: Product[];
  }> {
    return this.productsService.getProducts(query);
  }
}
