import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { CartDto } from './dto/cart.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('carts')
@Controller('carts')
export class CartsController {
  constructor(private readonly cartService: CartsService) {}

  // Endpoint: thêm sản phẩm vào giỏ hàng
  // Method: POST
  // Url: /carts/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thêm sản phẩm vào giỏ hàng' })
  @ApiResponse({
    status: 201,
    description: 'Thêm sản phẩm vào giỏ hàng thành công',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @Post('')
  async addToCart(
    @Req() request: Request,
    @Body() cartDto: CartDto,
  ): Promise<{ message: string }> {
    const { id } = request['user'];
    return this.cartService.addToCart(String(id), cartDto);
  }

  // Endpoint: cập nhật số lượng sản phẩm
  // Method: PUT
  // Url: /carts/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật số lượng sản phẩm trong giỏ hàng' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật số lượng sản phẩm trong giỏ hàng',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @Put('')
  async updateCartItem(
    @Req() request: Request,
    @Body() cartDto: CartDto,
  ): Promise<{ message: string }> {
    const { id } = request['user'];
    return this.cartService.updateCartItem(String(id), cartDto);
  }

  // Endpoint: xóa sản phẩm trong giỏ hàng
  // Method: DELETE
  // Url: /carts/:pid
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa sản phẩm trong giỏ hàng' })
  @ApiResponse({
    status: 200,
    description: 'Xóa sản phẩm trong giỏ hàng',
  })
  @UseGuards(AuthGuard)
  @Delete('/:pid')
  async deleteProductInCart(
    @Req() request: Request,
    @Param('pid') pid: string,
  ): Promise<{ message: string }> {
    const { id } = request['user'];
    return this.cartService.deleteCartItem(String(id), pid);
  }

  // Endpoint: Xem danh sách sản phẩm trong giỏ hàng
  // Method: GET
  // Url: /cart/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xem danh sách sản phẩm trong giỏ hàng' })
  @ApiResponse({
    status: 200,
    description: 'Xem danh sách sản phẩm trong giỏ hàng',
  })
  @UseGuards(AuthGuard)
  @Get('')
  async getProductsInCart(@Req() request: Request): Promise<
    {
      productId: string;
      productName: string;
      price: number;
      quantity: number;
      totalPrice: number;
    }[]
  > {
    const { id } = request['user'];
    return this.cartService.getProductsInCart(String(id));
  }
}
