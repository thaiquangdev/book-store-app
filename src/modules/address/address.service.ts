import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './address.entity';
import { Not, Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  // Hàm tìm kiếm địa chỉ
  private async findOneAddress(addressId: string, userId: string) {
    return this.addressRepository.findOne({
      where: { id: addressId, user: { id: userId } },
    });
  }

  // thêm mới một địa chỉ
  async createAddress(userId: string, createAddressDto: CreateAddressDto) {
    const address = await this.addressRepository.findOne({
      where: {
        user: { id: userId },
        street: createAddressDto.street,
        city: createAddressDto.city,
        state: createAddressDto.state,
        country: createAddressDto.country,
      },
    });

    if (address) {
      throw new BadRequestException('Địa chỉ này đã tồn tại.');
    }

    // tạo mới một địa chỉ
    const newAddress = this.addressRepository.create({
      user: { id: userId },
      ...createAddressDto,
    });

    await this.addressRepository.save(newAddress);
    return {
      message: 'Tạo mới một địa chỉ thành công.',
      address: newAddress,
    };
  }

  // sửa một địa chỉ
  async updateAddress(
    userId: string,
    aid: string,
    updateAddressDto: UpdateAddressDto,
  ) {
    const address = await this.findOneAddress(aid, userId);
    if (!address) {
      throw new BadRequestException('Không tìm thấy địa chỉ');
    }

    // cập nhật địa chỉ nếu có trường nào thay đổi
    const existingAddress = await this.addressRepository.findOne({
      where: {
        user: { id: userId },
        street: updateAddressDto.street ?? address.street,
        city: updateAddressDto.city ?? address.city,
        state: updateAddressDto.state ?? address.state,
        zipCode: updateAddressDto.zipCode ?? address.zipCode,
        country: updateAddressDto.country ?? address.country,
        id: Not(aid), // Loại trừ địa chỉ hiện tại
      },
    });

    if (existingAddress) {
      throw new BadRequestException('Địa chỉ này đã tồn tại.');
    }

    Object.assign(address, updateAddressDto);

    await this.addressRepository.save(address);
    return {
      message: 'Cập nhật địa chỉ thành công',
      address,
    };
  }

  // Xóa một địa chỉ
  async deleteAddress(aid: string, userId: string) {
    const address = await this.findOneAddress(aid, userId);
    if (!address) {
      throw new BadRequestException('Không tìm thấy địa chỉ');
    }

    await this.addressRepository.remove(address);
    return {
      message: 'Xóa địa chỉ thành công',
    };
  }

  // xem danh sách địa chỉ
  async getAddresses(userId: string) {
    return this.addressRepository.find({
      where: {
        user: { id: userId },
      },
    });
  }

  // đặt địa chỉ làm mặc định
  async addressIsDefault(
    userId: string,
    aid: string,
  ): Promise<{ message: string }> {
    // Tìm địa chỉ cần đặt làm mặc định
    const address = await this.findOneAddress(aid, userId);
    if (!address) {
      throw new BadRequestException('Không tìm thấy địa chỉ');
    }

    // Bỏ mặc định tất cả địa chỉ khác của user
    await this.addressRepository.update(
      { user: { id: userId }, isDefault: true },
      { isDefault: false },
    );

    // Cập nhật địa chỉ mới thành mặc định
    address.isDefault = true;
    await this.addressRepository.save(address);

    return { message: 'Đặt địa chỉ làm mặc định thành công' };
  }
}
