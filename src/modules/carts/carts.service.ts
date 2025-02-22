import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { DataSource, Repository } from 'typeorm';
import { Product } from '../products/product.entity';
import { CartItem } from './cart-item.entity';
import { Inventory } from '../products/inventory.entity';
import { CartDto } from './dto/cart.dto';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    private readonly dataSource: DataSource,
  ) {}

  // Thêm sản phẩm vào giỏ hàng
  async addToCart(
    userId: string,
    cartDto: CartDto,
  ): Promise<{ message: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // ✅ Tìm giỏ hàng của user
      let cart = await queryRunner.manager.findOne(Cart, {
        where: { user: { id: userId } },
        relations: ['items', 'items.product'],
      });

      // ✅ Nếu user chưa có giỏ hàng, tạo mới
      if (!cart) {
        cart = queryRunner.manager.create(Cart, {
          user: { id: userId },
          items: [],
        });
        await queryRunner.manager.save(cart);
      }

      // ✅ Tìm sản phẩm
      const product = await queryRunner.manager.findOne(Product, {
        where: {
          id: cartDto.productId,
        },
      });

      if (!product) {
        throw new BadRequestException('Sản phẩm không tồn tại');
      }

      // ✅ Kiểm tra số lượng tồn kho
      const inventory = await queryRunner.manager.findOne(Inventory, {
        where: { product: { id: cartDto.productId } },
      });

      if (!inventory || inventory.stock < cartDto.quantity) {
        throw new BadRequestException('Số lượng tồn kho không đủ');
      }

      // ✅ Tìm sản phẩm trong giỏ hàng
      let cartItem = await queryRunner.manager.findOne(CartItem, {
        where: { cart: { id: cart.id }, product: { id: cartDto.productId } },
      });
      if (cartItem) {
        cartItem.quantity += cartDto.quantity;
      } else {
        cartItem = queryRunner.manager.create(CartItem, {
          cart,
          product,
          quantity: cartDto.quantity,
          price: product.price,
        });
      }
      await queryRunner.manager.save(cartItem);
      await queryRunner.commitTransaction();
      return {
        message: 'Sản phẩm đã được thêm vào giỏ hàng',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // chỉnh sửa số lượng sản phẩm trong giỏ hàng
  async updateCartItem(
    userId: string,
    cartDto: CartDto,
  ): Promise<{ message: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // ✅ Tìm sản phẩm trong giỏ hàng của user
      const cartItem = await queryRunner.manager.findOne(CartItem, {
        where: {
          cart: { user: { id: userId } },
          product: { id: cartDto.productId },
        },
        relations: ['product'],
      });

      if (!cartItem) {
        throw new BadRequestException('Sản phẩm không có trong giỏ hàng');
      }

      if (cartDto.quantity <= 0) {
        // ✅ Nếu số lượng <= 0, xóa sản phẩm khỏi giỏ hàng
        await queryRunner.manager.remove(cartItem);
      } else {
        // ✅ Kiểm tra số lượng tồn kho
        const inventory = await queryRunner.manager.findOne(Inventory, {
          where: { product: { id: cartDto.productId } },
        });

        if (!inventory || inventory.stock < cartDto.quantity) {
          throw new BadRequestException('Số lượng tồn kho không đủ');
        }

        // ✅ Cập nhật số lượng sản phẩm trong giỏ hàng
        cartItem.quantity = cartDto.quantity;
        await queryRunner.manager.save(cartItem);
      }

      await queryRunner.commitTransaction();
      return { message: 'Cập nhật số lượng sản phẩm thành công' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Xóa sản phẩm trong giỏ hàng
  async deleteCartItem(userId: string, productId: string) {
    // ✅ Tìm sản phẩm trong giỏ hàng của user
    const cartItem = await this.cartItemRepository.findOne({
      where: {
        cart: {
          user: { id: userId },
        },
        product: { id: productId },
      },
    });
    // ✅ Xóa sản phẩm khỏi giỏ hàng
    if (!cartItem) {
      throw new BadRequestException('Không tìm thấy sản phẩm trong giỏ hàng');
    }

    await this.cartItemRepository.remove(cartItem);
    return {
      message: 'Xóa sản phẩm khỏi giỏ hàng thành công',
    };
  }

  // Xem danh sách sản phẩm trong giỏ hàng
  async getProductsInCart(userId: string): Promise<
    {
      productId: string;
      productName: string;
      price: number;
      quantity: number;
      totalPrice: number;
    }[]
  > {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'], // Lấy sản phẩm trong giỏ hàng
    });

    if (!cart) {
      throw new BadRequestException('Giỏ hàng trống');
    }

    // Nếu giỏ hàng có sản phẩm, trả về thông tin chi tiết
    return cart.items.map((item) => ({
      productId: item.product.id,
      productName: item.product.productName,
      price: item.product.price,
      quantity: item.quantity,
      totalPrice: item.quantity * item.product.price, // Tính tổng giá sản phẩm
    }));
  }
}
