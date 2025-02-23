import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Cart } from '../carts/cart.entity';
import { Address } from '../address/address.entity';
import { OrderItem } from './order-item.entity';
import { Order } from './order.entity';
import { Inventory } from '../products/inventory.entity';
import { StockHistory } from '../products/stock-history.entity';
import { StockType } from 'src/common/enums/stock-type.enum';
import { OrderStatus } from 'src/common/enums/order-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { CheckoutQueryDto } from './dto/checkout-query.dto';

@Injectable()
export class CheckoutsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly dataSource: DataSource,
  ) {}

  async createCheckout(userId: string, addressId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Lấy giỏ hàng của user
      const cart = await queryRunner.manager.findOne(Cart, {
        where: { user: { id: userId } },
        relations: ['items', 'items.product'],
      });

      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Giỏ hàng trống');
      }

      // kiểm tra địa chỉ giao hàng
      const address = await queryRunner.manager.findOne(Address, {
        where: { user: { id: userId }, id: addressId },
      });

      if (!address) {
        throw new BadRequestException('Địa chỉ không hợp lệ');
      }

      let totalAmount = 0;
      const orderItems: OrderItem[] = [];

      // chuyển từ cartItem sang orderItem
      for (const item of cart.items) {
        const product = item.product;

        // kiểm tra số lượng tồn kho
        const inventory = await queryRunner.manager.findOne(Inventory, {
          where: { product: { id: product.id } },
        });

        if (!inventory || inventory.stock < item.quantity) {
          throw new BadRequestException(
            `Sản phẩm "${product.productName}" không đủ hàng trong kho.`,
          );
        }
        totalAmount += item.price * item.quantity;

        // lưu vào orderItem
        orderItems.push(
          queryRunner.manager.create(OrderItem, {
            product,
            quantity: item.quantity,
            price: item.price,
          }),
        );
      }

      // tạo đơn hàng
      const order = queryRunner.manager.create(Order, {
        user: { id: userId },
        items: orderItems,
        address: address,
        totalAmount,
        status: 'PENDING',
        paymentMethod: 'COD',
      });

      await queryRunner.manager.save(order);

      // Xóa giỏ hàng sau khi đặt hàng thành công
      await queryRunner.manager.remove(cart);

      await queryRunner.commitTransaction();
      return {
        message: 'Đặt hàng thành công',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async shipOrder(orderId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // lấy đơn hàng
      const order = await queryRunner.manager.findOne(Order, {
        where: { id: orderId },
        relations: ['items', 'items.product'],
      });

      if (!order) {
        throw new BadRequestException('Không tìm thấy đơn hàng');
      }

      if (order.status !== 'PENDING') {
        throw new BadRequestException('Đơn hàng không hợp lệ để xuất kho');
      }

      // kiểm tra tồn kho trước khi xuất hàng
      for (const item of order.items) {
        const inventory = await queryRunner.manager.findOne(Inventory, {
          where: { product: { id: item.product.id } },
        });

        if (!inventory || inventory.stock < item.quantity) {
          throw new BadRequestException(
            `Sản phẩm "${item.product.productName}" không đủ số lượng trong kho.`,
          );
        }

        // trừ số lượng tồn kho
        inventory.stock -= item.quantity;
        inventory.sold += item.quantity;
        await queryRunner.manager.save(inventory);

        // lưu vào lịch sử nhập xuất kho
        const stockHistory = queryRunner.manager.create(StockHistory, {
          product: { id: item.product.id },
          quantity: -item.quantity,
          type: StockType.EXPORT,
        });

        await queryRunner.manager.save(stockHistory);
      }

      // Cập nhật trạng thái thành SHIPPED
      order.status = 'SHIPPED';
      await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();
      return { message: 'Xuất kho thành công', orderId: order.id };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async cancelOrder(orderId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // lấy đơn hàng
      const order = await queryRunner.manager.findOne(Order, {
        where: { id: orderId },
        relations: ['items', 'items.product'],
      });

      if (!order) {
        throw new BadRequestException('Không tìm thấy đơn hàng');
      }

      if (order.status !== 'SHIPPED') {
        throw new BadRequestException('Chỉ có thể hủy đơn hàng đã xuất kho');
      }

      // Hoàn kho số lượng sản phẩm
      for (const item of order.items) {
        const inventory = await queryRunner.manager.findOne(Inventory, {
          where: { product: { id: item.product.id } },
        });

        if (!inventory) {
          throw new BadRequestException(
            `Không tìm thấy kho cho sản phẩm "${item.product.productName}"`,
          );
        }

        inventory.stock += item.quantity;
        inventory.sold -= item.quantity;

        await queryRunner.manager.save(inventory);

        // lưu vào lịch sử
        const stockHistory = queryRunner.manager.create(StockHistory, {
          product: { id: item.product.id },
          quantity: item.quantity,
          type: StockType.IMPORT,
        });

        await queryRunner.manager.save(stockHistory);
      }

      // chuyển trạng thái sang cancel
      order.status = OrderStatus.CANCELLED;
      await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();

      return {
        message: 'Hủy đơn hàng thành công',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deliveredOrder(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new BadRequestException('Không tìm thấy đơn hàng');
    }

    if (order.status !== 'SHIPPED') {
      throw new BadRequestException('Chỉ có thể hoàn tất đơn hàng đã giao');
    }

    // Cập nhật trạng thái thành SHIPPED
    order.status = OrderStatus.DELIVERED;
    await this.orderRepository.save(order);
    return {
      message: 'Cập nhật trạng thái đơn hàng thành DELIVERED thành công',
    };
  }

  async getOrders(userId: string, query: CheckoutQueryDto) {
    const { status, paymentMethod, page = 1, limit = 10 } = query;
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .where('order.userId = :userId', { userId })
      .leftJoinAndSelect('order.items', 'items')
      .orderBy('order.createdAt', 'DESC');

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    if (paymentMethod) {
      queryBuilder.andWhere('order.paymentMethod = :paymentMethod', {
        paymentMethod,
      });
    }

    const total = await queryBuilder.getCount();
    const data = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      total,
      page,
      limit,
      data,
    };
  }

  async getOrdersForAdmin(query: CheckoutQueryDto) {
    const { status, paymentMethod, page = 1, limit = 10 } = query;
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .orderBy('order.createdAt', 'DESC');

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    if (paymentMethod) {
      queryBuilder.andWhere('order.paymentMethod = :paymentMethod', {
        paymentMethod,
      });
    }

    const total = await queryBuilder.getCount();
    const data = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      total,
      page,
      limit,
      data,
    };
  }
}
