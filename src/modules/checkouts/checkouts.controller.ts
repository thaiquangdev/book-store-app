import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CheckoutsService } from './checkouts.service';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decoratior';
import { Role } from 'src/common/enums/role.enum';
import { CheckoutQueryDto } from './dto/checkout-query.dto';

@Controller('checkouts')
export class CheckoutsController {
  constructor(private readonly checkoutsService: CheckoutsService) {}

  // Endpoint: Thanh toán COD
  // Method: POST
  // Url: /checkouts/cod
  @UseGuards(AuthGuard)
  @Post('/cod')
  async createCheckout(
    @Req() request: Request,
    @Body('addressId') addressId: string,
  ) {
    const { id } = request['user'];
    return this.checkoutsService.createCheckout(String(id), addressId);
  }

  // Endpoint: Chuyển trạng thái sang shipped -  admin
  // Method: PUT
  // Url: /checkouts/shipped/:oid
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Put('/shipped/:oid')
  async shippedOrder(@Param('oid') oid: string) {
    return this.checkoutsService.shipOrder(oid);
  }

  // Endpoint: Hủy đơn hàng - admin
  // Method: PUT
  // Url: /checkouts/cancel-order/:oid
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Put('/cancel-order/:oid')
  async cancelOrder(@Param('oid') oid: string) {
    return this.checkoutsService.cancelOrder(oid);
  }

  // Endpoint: chuyển đơn hàng sang đã nhận hàng delived - admin
  // Method: PUT
  // Url: /checkouts/deliver-order/:oid
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Put('/deliver-order/:oid')
  async deliverOrder(@Param('oid') oid: string) {
    return this.checkoutsService.deliveredOrder(oid);
  }

  // Endpoint: lấy danh sách đơn hàng đã mua - user
  // Method: GET
  // Url: /checkouts/get-orders-user
  @UseGuards(AuthGuard)
  @Get('/get-orders-user')
  async getOrdersUser(
    @Req() request: Request,
    @Query() query: CheckoutQueryDto,
  ) {
    const { id } = request['user'];
    return this.checkoutsService.getOrders(String(id), query);
  }

  // Endpoint: lấy danh sách đơn hàng - admin
  // Method: GET
  // Url: /checkouts/get-orders
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('/get-orders')
  async getOrders(@Query() query: CheckoutQueryDto) {
    return this.checkoutsService.getOrdersForAdmin(query);
  }
}
