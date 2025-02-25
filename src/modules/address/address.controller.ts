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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('address')
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  // Endpoint: Thêm mới một địa chỉ
  // Method: POST
  // Url: /address
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo mới một địa chỉ' })
  @ApiResponse({ status: 201, description: 'Tạo mới một địa chỉ thành công' })
  @ApiResponse({ status: 400, description: 'Địa chỉ này đã tồn tại' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sửa một địa chỉ' })
  @ApiResponse({ status: 200, description: 'Sửa địa chỉ thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy địa chỉ' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa một địa chỉ' })
  @ApiResponse({ status: 200, description: 'Xóa địa chỉ thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy địa chỉ' })
  @UseGuards(AuthGuard)
  @Delete('/:aid')
  async deleteAddress(@Param('aid') aid: string, @Req() request: Request) {
    const { id } = request['user'];
    return this.addressService.deleteAddress(aid, String(id));
  }

  // Endpoint: Xem danh sách địa chỉ
  // Method: GET
  // Url: /address
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sửa một địa chỉ' })
  @ApiResponse({ status: 200, description: 'Trả về danh sách địa chỉ' })
  @UseGuards(AuthGuard)
  @Get('')
  async getAddresses(@Req() request: Request) {
    const { id } = request['user'];
    return this.addressService.getAddresses(String(id));
  }

  // Endpoint: Đặt địa chỉ làm mặc định
  // Method: PUT
  // Url: /address/address-default/:aid
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đặt địa chỉ làm mặc định' })
  @ApiResponse({
    status: 200,
    description: 'Đặt địa chỉ làm mặc định thành công',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy địa chỉ' })
  @UseGuards(AuthGuard)
  @Put('/address-default/:aid')
  async addressIsDefault(@Param('aid') aid: string, @Req() request: Request) {
    const { id } = request['user'];
    return this.addressService.addressIsDefault(String(id), aid);
  }
}
