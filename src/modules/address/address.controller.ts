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
} from '@nestjs/common';
import { AddressService } from './address.service';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  // Endpoint: Thêm mới một địa chỉ
  // Method: POST
  // Url: /address
  @UseGuards(AuthGuard)
  @Post('')
  async createAddress(
    @Req() request: Request,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    const { id } = request['user'];
    return this.addressService.createAddress(String(id), createAddressDto);
  }

  // Endpoint: Sửa một địa chỉ
  // Method: PUT
  // Url: /address/:aid
  @UseGuards(AuthGuard)
  @Put('/:aid')
  async updateAddress(
    @Req() request: Request,
    @Param('aid') aid: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    const { id } = request['user'];
    return this.addressService.updateAddress(String(id), aid, updateAddressDto);
  }

  // Endpoint: Xóa một địa chỉ
  // Method: DELETE
  // Url: /address/:aid
  @UseGuards(AuthGuard)
  @Delete('/:aid')
  async deleteAddress(@Param('aid') aid: string, @Req() request: Request) {
    const { id } = request['user'];
    return this.addressService.deleteAddress(aid, String(id));
  }

  // Endpoint: Xem danh sách địa chỉ
  // Method: GET
  // Url: /address
  @UseGuards(AuthGuard)
  @Get('')
  async getAddresses(@Req() request: Request) {
    const { id } = request['user'];
    return this.addressService.getAddresses(String(id));
  }

  // Endpoint: Đặt địa chỉ làm mặc định
  // Method: PUT
  // Url: /address/address-default/:aid
  @UseGuards(AuthGuard)
  @Put('/address-default/:aid')
  async addressIsDefault(@Param('aid') aid: string, @Req() request: Request) {
    const { id } = request['user'];
    return this.addressService.addressIsDefault(String(id), aid);
  }
}
