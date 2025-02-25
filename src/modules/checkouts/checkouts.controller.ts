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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('checkouts')
@Controller('checkouts')
export class CheckoutsController {
  constructor(private readonly checkoutsService: CheckoutsService) {}

  // Endpoint: Thanh toán COD
  // Method: POST
  // Url: /checkouts/cod
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thanh toán COD' })
  @ApiResponse({ status: 201, description: 'Thanh toán COD thành công' })
  @ApiResponse({ status: 400, description: 'Thanh toán COD thất bại' })
  @UseGuards(AuthGuard)
  @Post('/cod')
  async createCheckout(
    @Req() request: Request,
    @Body('addressId') addressId: string,
  ) {
    const { id } = request['user'];
    return this.checkoutsService.createCheckout(String(id), addressId);
  }

  // Endpoint: Thanh toán Zalopay
  // Method: POST
  // Url: /checkouts/zalopay
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thanh toán Zalopay' })
  @ApiResponse({ status: 201, description: 'Thanh toán Zalopay thành công' })
  @ApiResponse({ status: 400, description: 'Thanh toán Zalopay thất bại' })
  @UseGuards(AuthGuard)
  @Post('/zalopay')
  async createCheckoutZalopay(
    @Req() request: Request,
    @Body('addressId') addressId: string,
  ) {
    const { id } = request['user'];
    return this.checkoutsService.createCheckoutZalopay(String(id), addressId);
  }

  // Endpoint: Callback Zalopay
  // Method: GET
  // Url: /checkouts/callback
  @Get('/callback')
  async callBackZalopay(@Body() data: any) {
    return this.checkoutsService.callBackZalopay(data);
  }

  // Endpoint: Chuyển trạng thái sang shipped -  admin
  // Method: PUT
  // Url: /checkouts/shipped/:oid
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chuyển trạng thái sang shipped' })
  @ApiResponse({
    status: 200,
    description: 'Chuyển trạng thái sang shipped thành công',
  })
  @ApiResponse({
    status: 400,
    description: 'Chuyển trạng thái sang shipped thất bại',
  })
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Put('/shipped/:oid')
  async shippedOrder(@Param('oid') oid: string) {
    return this.checkoutsService.shipOrder(oid);
  }

  // Endpoint: Hủy đơn hàng - admin
  // Method: PUT
  // Url: /checkouts/cancel-order/:oid
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Hủy đơn hàng' })
  @ApiResponse({ status: 200, description: 'Hủy đơn hàng thành công' })
  @ApiResponse({ status: 400, description: 'Hủy đơn hàng thất bại' })
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Put('/cancel-order/:oid')
  async cancelOrder(@Param('oid') oid: string) {
    return this.checkoutsService.cancelOrder(oid);
  }

  // Endpoint: chuyển đơn hàng sang đã nhận hàng delived - admin
  // Method: PUT
  // Url: /checkouts/deliver-order/:oid
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chuyển đơn hàng sang nhận hàng delived' })
  @ApiResponse({
    status: 200,
    description: 'Chuyển đơn hàng sang nhận hàng delived thành công',
  })
  @ApiResponse({
    status: 400,
    description: 'Chuyển đơn hàng sang nhận hàng delived thất bại',
  })
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Put('/deliver-order/:oid')
  async deliverOrder(@Param('oid') oid: string) {
    return this.checkoutsService.deliveredOrder(oid);
  }

  // Endpoint: lấy danh sách đơn hàng đã mua - user
  // Method: GET
  // Url: /checkouts/get-orders-user
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xem danh sách đơn hàng' })
  @ApiResponse({ status: 200, description: 'Xem danh sách đơn hàng' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xem danh sách đơn hàng' })
  @ApiResponse({ status: 200, description: 'Xem danh sách đơn hàng' })
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('/get-orders')
  async getOrders(@Query() query: CheckoutQueryDto) {
    return this.checkoutsService.getOrdersForAdmin(query);
  }
}
