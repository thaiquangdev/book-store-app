import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { AuthGuard } from '../auth/auth.guard';
import { WishlistDto } from './dto/wishlist.dto';
import { Wishlist } from './wishlist.entity';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistService: WishlistsService) {}

  // Endpoint: Thêm sản phẩm vào danh sách yêu thích - user
  // Method: POST
  // Url: wishlists/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thêm sản phẩm vào danh sách yêu thích' })
  @ApiResponse({
    status: 201,
    description: 'Thêm sản phẩm vào danh sách yêu thích thành công',
  })
  @UseGuards(AuthGuard)
  @Post('')
  async addProductToWishlist(
    @Body() wishlistDto: WishlistDto,
    @Req() request: Request,
  ): Promise<{ message: string }> {
    const { id } = request['user'];
    return this.wishlistService.addProductToWishlist(String(id), wishlistDto);
  }

  // Endpoint: Xóa sản phẩm khỏi danh sách yêu thích
  // Method: DELETE
  // Url: wishlist/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa sản phẩm khỏi danh sách yêu thích' })
  @ApiResponse({
    status: 200,
    description: 'Xóa sản phẩm khỏi danh sách yêu thích thành công',
  })
  @UseGuards(AuthGuard)
  @Delete('/:pid')
  async deleteProductInWishlist(
    @Param('pid') pid: string,
    @Req() request: Request,
  ) {
    const { id } = request['user'];
    return this.wishlistService.deleteProductWishlist(String(id), pid);
  }

  // Endpoint: Xem danh sách sản phẩm trong wishlist
  // Method: GET
  // Url: wishlist/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xem danh sách sản phẩm trong wishlist' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách sản phẩm trong danh sách yêu thích',
  })
  @UseGuards(AuthGuard)
  @Get()
  async getProductsInWishlist(): Promise<Wishlist[]> {
    return this.wishlistService.getAllProductsInWishlist();
  }
}
