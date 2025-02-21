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
  @IsUUID()
  pid: string;

  @IsNotEmpty({ message: 'Số sao không được để trống' })
  @IsNumber()
  @Min(1, { message: 'Tối thiểu là 1 sao' })
  @Max(5, { message: 'Tối đa là 5 sao' })
  star: number;

  @IsString({ message: 'Bình luận phải đúng định dạng' })
  @IsOptional()
  comment: string;
}
