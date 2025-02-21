import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './wishlist.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { WishlistDto } from './dto/wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Hàm tìm kiếm sản phẩm trong wishlist
  private async findProductInWishlist(
    pid: string,
    uid: string,
  ): Promise<Wishlist | null> {
    return this.wishlistRepository.findOne({
      where: { product: { id: pid }, user: { id: uid } },
    });
  }

  // thêm sản phẩm vào danh sách yêu thích
  async addProductToWishlist(
    uid: string,
    wishlistDto: WishlistDto,
  ): Promise<{ message: string }> {
    // ✅ Kiểm tra user có tồn tại không
    const user = await this.userRepository.findOne({
      where: { id: uid },
    });
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    // ✅ Kiểm tra sản phẩm có tồn tại không
    const product = await this.productRepository.findOne({
      where: { id: wishlistDto.pid },
    });
    if (!product) {
      throw new BadRequestException('Sản phẩm không tồn tại');
    }

    // ✅ Kiểm tra xem sản phẩm đã có trong danh sách yêu thích chưa
    const existingWishlist = await this.findProductInWishlist(
      wishlistDto.pid,
      uid,
    );

    if (existingWishlist) {
      throw new BadRequestException(
        'Sản phẩm này đã có trong danh sách yêu thích',
      );
    }

    // ✅ Tạo mới wishlist
    const wishlist = this.wishlistRepository.create({
      product,
      user,
    });

    await this.wishlistRepository.save(wishlist);

    return {
      message: 'Thêm sản phẩm vào danh sách yêu thích thành công',
    };
  }

  // xóa sản phẩm trong danh sách yêu thích
  async deleteProductWishlist(
    uid: string,
    pid: string,
  ): Promise<{ message: string }> {
    // ✅ Kiểm tra xem sản phẩm có trong wishlist không
    const existingWishlist = await this.findProductInWishlist(pid, uid);

    if (!existingWishlist) {
      throw new BadRequestException(
        'Sản phẩm chưa có trong danh sách yêu thích',
      );
    }

    await this.wishlistRepository.remove(existingWishlist);
    return {
      message: 'Xóa sản phẩm trong danh sách yêu thích thành công',
    };
  }

  // xem danh sách sản phẩm trong wishlist
  async getAllProductsInWishlist(): Promise<Wishlist[]> {
    return this.wishlistRepository.find({ relations: { product: true } });
  }
}
