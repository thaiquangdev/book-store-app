import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID, Max, Min } from 'class-validator';

export class UpdateReviewDto {
  @ApiProperty()
  @IsUUID()
  pid: string;

  @ApiProperty()
  @IsNumber()
  @Min(1, { message: 'Tối thiểu là 1 sao' })
  @Max(5, { message: 'Tối đa là 5 sao' })
  star: number;

  @ApiProperty()
  @IsString({ message: 'Bình luận phải đúng định dạng' })
  comment: string;
}
