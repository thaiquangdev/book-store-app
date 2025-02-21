import { IsUUID } from 'class-validator';

export class WishlistDto {
  @IsUUID()
  pid: string;
}
