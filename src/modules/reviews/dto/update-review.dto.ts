import { IsNumber, IsString, IsUUID, Max, Min } from 'class-validator';

export class UpdateReviewDto {
  @IsUUID()
  pid: string;

  @IsNumber()
  @Min(1, { message: 'Tối thiểu là 1 sao' })
  @Max(5, { message: 'Tối đa là 5 sao' })
  star: number;

  @IsString({ message: 'Bình luận phải đúng định dạng' })
  comment: string;
}
