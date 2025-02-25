import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ChangeProfileDto {
  @ApiProperty({ example: 'Thái Mai Tèo', description: 'Họ và tên' })
  @IsOptional()
  username: string;

  @ApiProperty({ example: '0243212323', description: 'Số điện thoại' })
  @IsOptional()
  phoneNumber: string;
}
