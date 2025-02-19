import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { User } from 'src/modules/users/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector, // ✅ Fix chính tả
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // ✅ Lấy danh sách roles từ metadata
    const allowedRoles = this.reflector.get<string[]>(
      'allowedRoles',
      context.getHandler(),
    );

    if (!allowedRoles || allowedRoles.length === 0) {
      return true; // ✅ Nếu không có role yêu cầu, cho phép truy cập
    }

    // ✅ Lấy request & user từ context
    const request = context.switchToHttp().getRequest<Request>();
    const user = request['user'] as { id: string } | undefined;

    if (!user || !user.id) {
      throw new UnauthorizedException('Bạn cần đăng nhập để truy cập');
    }

    // ✅ Tìm user trong database
    const foundUser = await this.userRepository.findOne({
      where: { id: user.id },
      select: { role: true },
    });

    if (!foundUser) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    // ✅ Kiểm tra quyền
    if (!allowedRoles.includes(foundUser.role)) {
      throw new ForbiddenException(
        'Bạn không có quyền truy cập vào tài nguyên này',
      );
    }

    return true;
  }
}
