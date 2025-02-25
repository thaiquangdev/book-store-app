import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty()
  @IsUUID()
  pid: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Số sao không được để trống' })
  @IsNumber()
  @Min(1, { message: 'Tối thiểu là 1 sao' })
  @Max(5, { message: 'Tối đa là 5 sao' })
  star: number;

  @ApiProperty()
  @IsString({ message: 'Bình luận phải đúng định dạng' })
  @IsOptional()
  comment: string;
}
