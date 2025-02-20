import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  Body,
  UseGuards,
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

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

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
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Không có file nào được upload');
    }
    const imageUrls = files.map(
      (file: { fieldname: string; filename: string }) =>
        file.fieldname + '/' + file.filename,
    );
    return this.productsService.createProduct(createProductDto, imageUrls);
  }
}
