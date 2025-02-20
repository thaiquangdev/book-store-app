import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import slugify from 'slugify';
import * as fs from 'fs';
import * as path from 'path';
import { Product } from './product.entity';
import { ProductImage } from './product-image.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
  ) {}

  // ✅ Hàm xóa ảnh nếu sản phẩm đã tồn tại
  private deleteUploadedImages(images: string[]) {
    for (const image of images) {
      const filePath = path.join(process.cwd(), 'uploads', image);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(`❌ Không thể xóa file: ${filePath} - ${err.message}`);
        } else {
          console.log(`✅ Đã xóa file: ${filePath}`);
        }
      });
    }
  }

  // tạo mới sản phẩm
  async createProduct(createProductDto: CreateProductDto, images: string[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const slug = slugify(createProductDto.productName, { lower: true });

      // ✅ Kiểm tra sản phẩm đã tồn tại chưa
      const productExist = await queryRunner.manager.findOne(Product, {
        where: { productSlug: slug },
      });
      if (productExist) {
        this.deleteUploadedImages(images);
        throw new BadRequestException('Sản phẩm này đã tồn tại');
      }

      // ✅ Tạo mới sản phẩm
      const newProduct = new Product();
      Object.assign(newProduct, {
        productName: createProductDto.productName,
        productSlug: slug,
        price: createProductDto.price,
        description: createProductDto.description,
        supplier: createProductDto.supplier,
        author: createProductDto.author,
        publisher: createProductDto.publisher,
        coverFormat: createProductDto.coverFormat,
        yearOfPublication: createProductDto.yearOfPublication,
        language: createProductDto.language,
      });

      await queryRunner.manager.save(newProduct);

      // ✅ Lưu ảnh vào DB
      if (images && images.length > 0) {
        const productImages = images.map((image) => {
          const newImage = new ProductImage();
          newImage.url = image;
          newImage.product = newProduct;
          return newImage;
        });

        await queryRunner.manager.save(ProductImage, productImages);
      }

      // ✅ Commit transaction
      await queryRunner.commitTransaction();

      return { message: 'Tạo sản phẩm thành công', product: newProduct };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
