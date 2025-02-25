import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class WishlistDto {
  @ApiProperty()
  @IsUUID()
  pid: string;
}
