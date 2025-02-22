import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import slugify from 'slugify';
import * as fs from 'fs';
import * as path from 'path';
import { Product } from './product.entity';
import { ProductImage } from './product-image.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { Inventory } from './inventory.entity';
import { StockHistory } from './stock-history.entity';
import { StockType } from 'src/common/enums/stock-type.enum';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    @InjectRepository(StockHistory)
    private readonly stockHistoryRepository: Repository<StockHistory>,
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

  // Hàm tìm sản phẩm
  private async findOneProduct(id: string) {
    return await this.productRepository.findOne({ where: { id } });
  }

  // tạo mới sản phẩm
  async createProduct(
    createProductDto: CreateProductDto,
    images: string[],
  ): Promise<{ message: string; product: Product }> {
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

  // Cập nhật sản phẩm
  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
    images: string[],
  ): Promise<{ message: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = await this.findOneProduct(id);
      if (!product) {
        this.deleteUploadedImages(images);
        throw new BadRequestException('Không tìm thấy sản phẩm');
      }

      // ✅ Nếu cập nhật tên sản phẩm, kiểm tra slug mới
      if (
        updateProductDto.productName &&
        updateProductDto.productName !== product.productName
      ) {
        const newSlug = slugify(updateProductDto.productName, { lower: true });

        // Kiểm tra xem slug mới đã tồn tại chưa (tránh trùng lặp)
        const existingProduct = await queryRunner.manager.findOne(Product, {
          where: { productSlug: newSlug },
        });
        if (existingProduct) {
          throw new BadRequestException('Sản phẩm với tên này đã tồn tại');
        }

        product.productName = updateProductDto.productName;
        product.productSlug = newSlug;
      }

      // ✅ Cập nhật các thuộc tính khác
      Object.assign(product, updateProductDto);

      await queryRunner.manager.save(product);

      // ✅ Xóa ảnh cũ & thêm ảnh mới nếu có
      if (images && images.length > 0) {
        const oldImages = await queryRunner.manager.find(ProductImage, {
          where: { product },
        });

        // Xóa ảnh trong thư mục nếu cần
        const oldImageUrls = oldImages.map((img) => img.url);
        this.deleteUploadedImages(oldImageUrls);

        // Xóa ảnh trong DB
        await queryRunner.manager.delete(ProductImage, { product });

        // Lưu ảnh mới
        const newImages = images.map((image) => {
          const newImage = new ProductImage();
          newImage.url = image;
          newImage.product = product;
          return newImage;
        });

        await queryRunner.manager.save(ProductImage, newImages);
      }

      // ✅ Commit transaction
      await queryRunner.commitTransaction();

      return { message: 'Cập nhật sản phẩm thành công' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // xóa sản phẩm
  async deleteProduct(id: string): Promise<{ message: string }> {
    // ✅ Kiểm tra sản phẩm có tồn tại không
    const product = await this.findOneProduct(id);
    if (!product) {
      throw new BadRequestException('Không tìm thấy sản phẩm');
    }

    // ✅ Lấy danh sách ảnh sản phẩm
    const imageProducts = await this.productImageRepository.find({
      where: { product },
    });
    const imageUrls = imageProducts.map((img) => img.url);

    // ✅ Xóa ảnh trên server
    this.deleteUploadedImages(imageUrls);

    // ✅ Xóa sản phẩm trong database
    await this.productRepository.remove(product);

    return {
      message: 'Xóa sản phẩm thành công',
    };
  }

  // xem chi tiết sản phẩm
  async getProduct(slug: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { productSlug: slug },
      relations: {
        images: true,
      },
    });
    if (!product) {
      throw new BadRequestException('Không tìm thấy sản phẩm');
    }
    return product;
  }

  // xem danh sách sản phẩm
  async getProducts(query: ProductQueryDto): Promise<{
    message: string;
    total: number;
    page: number;
    limit: number;
    data: Product[];
  }> {
    const {
      search,
      category,
      publisher,
      language,
      coverFormat,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
      page = 1,
      limit = 10,
    } = query;
    const queryBuilder = this.productRepository.createQueryBuilder('product');
    // ✅ Tìm kiếm theo tên hoặc mô tả
    if (search) {
      queryBuilder.andWhere(
        '(product.productName LIKE :search OR product.description LIKE :search)',
        {
          search: `%${search}%`,
        },
      );
    }

    // ✅ Lọc theo danh mục (nếu có bảng `Category`, cần JOIN)
    if (category) {
      queryBuilder.andWhere('product.category = :category', { category });
    }

    // ✅ Lọc theo nhà cung cấp
    if (publisher) {
      queryBuilder.andWhere('product.publisher = :publisher', { publisher });
    }

    // ✅ Lọc theo ngôn ngữ
    if (language) {
      queryBuilder.andWhere('product.language = :language', { language });
    }

    // ✅ Lọc theo hình thức
    if (coverFormat) {
      queryBuilder.andWhere('product.coverFormat = :coverFormat', {
        coverFormat,
      });
    }

    // ✅ Lọc theo giá
    if (minPrice) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    }
    if (maxPrice) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    // ✅ Sắp xếp kết quả
    if (sortBy) {
      queryBuilder.orderBy(
        `product.${sortBy}`,
        sortOrder === 'DESC' ? 'DESC' : 'ASC',
      );
    } else {
      queryBuilder.orderBy('product.createdAt', 'DESC'); // Mặc định sắp xếp theo ngày tạo mới nhất
    }

    // ✅ Phân trang
    const total = await queryBuilder.getCount();
    const data = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      message: 'Lấy danh sách sản phẩm thành công',
      total,
      page,
      limit,
      data,
    };
  }

  // nhập - xuất số lượng sản phẩm
  async updateStock(updateStockDto: UpdateStockDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let inventory = await queryRunner.manager.findOne(Inventory, {
        where: { product: { id: updateStockDto.pid } },
      });

      if (!inventory) {
        inventory = queryRunner.manager.create(Inventory, {
          product: { id: updateStockDto.pid },
        });
        await queryRunner.manager.save(inventory);
      }

      if (
        updateStockDto.type === StockType.EXPORT &&
        inventory.stock < updateStockDto.quantity
      ) {
        throw new BadRequestException('Số lượng tồn kho không đủ');
      }

      // ✅ Cập nhật số lượng nhập/xuất
      if (updateStockDto.type === StockType.IMPORT) {
        inventory.stock += updateStockDto.quantity;
        inventory.imported += updateStockDto.quantity; // ✅ Cập nhật tổng số lượng đã nhập
      } else {
        inventory.stock -= updateStockDto.quantity;
        inventory.sold += updateStockDto.quantity; // ✅ Cập nhật tổng số lượng đã bán
      }

      await queryRunner.manager.save(inventory);

      // ✅ Lưu lịch sử nhập/xuất vào `stock_history`
      const stockHistory = queryRunner.manager.create(StockHistory, {
        product: { id: updateStockDto.pid },
        quantity: updateStockDto.quantity,
        type: updateStockDto.type,
      });

      await queryRunner.manager.save(stockHistory);

      await queryRunner.commitTransaction();
      return {
        message: `${updateStockDto.type === StockType.IMPORT ? 'Nhập' : 'Xuất'} hàng thành công`,
        updatedStock: inventory.stock,
        totalSold: inventory.sold,
        totalImported: inventory.imported,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Xem lịch sử nhập - xuất
  async getStockHistoryByProduct() {
    return this.stockHistoryRepository.find({
      relations: {
        product: true,
      },
      select: {
        product: {
          productName: true,
        },
        quantity: true,
        type: true,
        id: true,
      },
    });
  }
}
