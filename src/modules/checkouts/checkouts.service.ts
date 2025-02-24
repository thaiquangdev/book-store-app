import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { DataSource, QueryRunner, Repository } from 'typeorm';
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
import { Product } from '../products/product.entity';

import axios from 'axios';
import * as moment from 'moment';
import * as CryptoJS from 'crypto-js';
import * as crypto from 'crypto';
import { ZaloPayConfig } from 'src/common/config/zalopay.config';

@Injectable()
export class CheckoutsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly dataSource: DataSource,
  ) {}

  // Hàm tìm kiếm giỏ hàng của user
  private async findOneCartUser(userId: string, queryRunner: QueryRunner) {
    return await queryRunner.manager.findOne(Cart, {
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });
  }

  // Hàm tìm kiếm địa chỉ của người dùng
  private async findOneAddress(
    userId: string,
    addressId: string,
    queryRunner: QueryRunner,
  ) {
    return await queryRunner.manager.findOne(Address, {
      where: { user: { id: userId }, id: addressId },
    });
  }

  // Hàm tìm kiếm kho của sản phẩm
  private async findOneInvetoryProduct(
    product: Product,
    queryRunner: QueryRunner,
  ) {
    return await queryRunner.manager.findOne(Inventory, {
      where: { product: { id: product.id } },
    });
  }

  async createCheckout(userId: string, addressId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Lấy giỏ hàng của user
      const cart = await this.findOneCartUser(userId, queryRunner);

      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Giỏ hàng trống');
      }

      // kiểm tra địa chỉ giao hàng
      const address = await this.findOneAddress(userId, addressId, queryRunner);

      if (!address) {
        throw new BadRequestException('Địa chỉ không hợp lệ');
      }

      let totalAmount = 0;
      const orderItems: OrderItem[] = [];

      // chuyển từ cartItem sang orderItem
      for (const item of cart.items) {
        const product = item.product;

        // kiểm tra số lượng tồn kho
        const inventory = await this.findOneInvetoryProduct(
          product,
          queryRunner,
        );

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

  async createCheckoutZalopay(userId: string, addressId: string) {
    const querryRunner = this.dataSource.createQueryRunner();
    await querryRunner.connect();
    await querryRunner.startTransaction();

    try {
      // Tìm kiếm giỏ hàng của người dùng
      const cart = await this.findOneCartUser(userId, querryRunner);
      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Giỏ hàng trống');
      }

      // Tìm địa chỉ của người dùng
      const address = await this.findOneAddress(
        userId,
        addressId,
        querryRunner,
      );
      if (!address) {
        throw new BadRequestException('Không tìm thấy địa chỉ người dùng');
      }

      let totalAmount = 0;
      const orderItems: OrderItem[] = [];
      // chuyển từ cartItem sang orderItem
      for (const item of cart.items) {
        const product = item.product;

        // kiểm tra số lượng tồn kho
        const inventory = await this.findOneInvetoryProduct(
          product,
          querryRunner,
        );

        if (!inventory || inventory.stock < item.quantity) {
          throw new BadRequestException(
            `Sản phẩm "${product.productName}" không đủ hàng trong kho.`,
          );
        }
        totalAmount += item.price * item.quantity;

        // lưu vào orderItem
        orderItems.push(
          querryRunner.manager.create(OrderItem, {
            product,
            quantity: item.quantity,
            price: item.price,
          }),
        );
      }

      // Tạo thông tin giao dịch zalopay
      const transID = Math.floor(Math.random() * 1000000);
      const orderCode = `${Math.random() * 1000}`;
      const embed_data = { redirectUrl: 'https://facebook.com' };
      const items = [{}];
      const orderRequest = {
        app_id: ZaloPayConfig.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // ID giao dịch
        app_user: `user_${userId}`,
        app_time: Date.now(), // Thời gian tạo giao dịch (miliseconds)
        amount: totalAmount,
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        description: `Thanh toán đơn hàng #${orderCode}`,
        mac: '',
      };

      console.log(orderRequest);

      // Tạo chuỗi ký MAC (HMAC SHA256)
      const data = [
        orderRequest.app_id,
        orderRequest.app_trans_id,
        orderRequest.app_user,
        orderRequest.amount,
        orderRequest.app_time,
        orderRequest.embed_data,
        orderRequest.item,
      ].join('|');

      orderRequest.mac = CryptoJS.HmacSHA256(
        data,
        ZaloPayConfig.key1,
      ).toString();

      // Gửi yêu cầu đến zalopay
      const zalopayResponse = await axios.post(ZaloPayConfig.endpoint, null, {
        params: orderRequest,
      });

      console.log(zalopayResponse);

      if (!zalopayResponse.data || zalopayResponse.data.return_code !== 1) {
        throw new HttpException(
          zalopayResponse.data.return_message || 'Giao dịch ZaloPay thất bại',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // tạo đơn hàng
      const order = querryRunner.manager.create(Order, {
        user: { id: userId },
        items: orderItems,
        address: address,
        totalAmount,
        status: 'PENDING',
        paymentMethod: 'ZALOPAY',
        orderCode,
        transactionId: transID,
      });

      await querryRunner.manager.save(order);

      await querryRunner.commitTransaction();

      return {
        message: 'Tạo đơn hàng thanh toán zalopay thành công',
        paymentUrl: zalopayResponse.data.order_url,
        orderId: order.id,
        orderCode: order.orderCode,
      };
    } catch (error) {
      await querryRunner.rollbackTransaction();
      throw error;
    } finally {
      await querryRunner.release();
    }
  }

  async callBackZalopay(body: any) {
    const result: { return_code: number; return_message: string } = {
      return_code: 0,
      return_message: '',
    };

    const querryRunner = this.dataSource.createQueryRunner();
    await querryRunner.connect();
    await querryRunner.startTransaction();

    try {
      const { data: dataStr, mac: reqMac } = body;
      const mac = CryptoJS.HmacSHA256(dataStr, ZaloPayConfig.key2).toString();

      if (reqMac !== mac) {
        console.log('Mac không hợp lệ');
        result.return_code = -1;
        result.return_message = 'MAC không hợp lệ';
        return result;
      }

      const dataJson = JSON.parse(dataStr);
      const transactionId = dataJson['app_trans_id'];
      const order = await querryRunner.manager.findOne(Order, {
        where: { transactionId },
        relations: ['items', 'items.product'],
      });

      if (!order) {
        result.return_code = 0;
        result.return_message = 'Không tìm thấy đơn hàng';
        return result;
      }

      // cập nhật status
      order.status = OrderStatus.PAID;
      await querryRunner.manager.save(order);

      // cập nhật số lượng trong kho
      for (const item of order.items) {
        const iventory = await this.findOneInvetoryProduct(
          item.product,
          querryRunner,
        );
        if (!iventory) {
          throw new BadRequestException('Không tìm thấy Kho của sản phẩm');
        }

        iventory.stock -= item.quantity;
        iventory.sold += item.quantity;
        await querryRunner.manager.save(iventory);
      }

      // xóa giỏ hàng cũ
      await querryRunner.manager.delete(Cart, { user: { id: order.user.id } });

      await querryRunner.commitTransaction();

      result.return_code = 1;
      result.return_message = 'Giao dịch thành công';
      return result;
    } catch (error) {
      await querryRunner.rollbackTransaction();
      throw error;
    } finally {
      await querryRunner.release();
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
