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
import { UpdateStockDto } from './dto/update-stock.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Endpoint: Tạo mới sản phẩm - admin
  // Method: POST
  // url: products/create-product
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo mới sản phẩm' })
  @ApiResponse({ status: 201, description: 'Tạo mới sản phẩm thành công' })
  @ApiResponse({ status: 400, description: 'Tạo mới sản phẩm thất bại' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật sản phẩm' })
  @ApiResponse({ status: 200, description: 'Cập nhật sản phẩm thành công' })
  @ApiResponse({ status: 400, description: 'Cập nhật sản phẩm thất bại' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa sản phẩm' })
  @ApiResponse({ status: 200, description: 'Xóa sản phẩm thành công' })
  @ApiResponse({ status: 400, description: 'Xóa sản phẩm thất bại' })
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete('/delete-product/:id')
  async deleteProduct(@Param('id') id: string): Promise<{ message: string }> {
    return this.productsService.deleteProduct(id);
  }

  // Endpoint: Nhập xuất số lượng sản phẩm - admin
  // Method: PUT
  // url: products/update-stock
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Nhập xuất số lượng sản phẩm' })
  @ApiResponse({
    status: 200,
    description: 'Nhập xuất số lượng sản phẩm thành công',
  })
  @ApiResponse({
    status: 400,
    description: 'Nhập xuất số lượng sản phẩm thất bại',
  })
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Put('/update-stock')
  async updateStock(@Body() updateStockDto: UpdateStockDto) {
    return this.productsService.updateStock(updateStockDto);
  }

  // Endpoint: Xem lịch sử nhập - xuất - admin
  // Method: GET
  // url: products/history
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xem lịch sử nhập xuất' })
  @ApiResponse({ status: 201, description: 'Xem lịch sử nhập xuất ' })
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('/history')
  async getStockHistory() {
    return this.productsService.getStockHistoryByProduct();
  }

  // Endpoint: Xem chi tiết sản phẩm - user
  // Method: GET
  // url: products/:slug
  @ApiOperation({ summary: 'Xem chi tiết sản phẩm' })
  @ApiResponse({ status: 200, description: 'Chi tiết sản phẩm' })
  @Get('/:slug')
  async getProduct(@Param('slug') slug: string): Promise<Product> {
    return this.productsService.getProduct(slug);
  }

  // Endpoint: Xem danh sách sản phẩm - user
  // Method: GET
  // url: products/
  @ApiOperation({ summary: 'Xem danh sách sản phẩm' })
  @ApiResponse({ status: 200, description: 'Xem danh sách sản phẩm' })
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
