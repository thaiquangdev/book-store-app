import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class ProductQueryDto {
  @ApiProperty({ example: 'a' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ example: 'Văn Học' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: 'Thiếu Nhi' })
  @IsOptional()
  @IsString()
  publisher?: string;

  @ApiProperty({ example: 'Tiếng Việt' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ example: 'Bìa mềm' })
  @IsOptional()
  @IsString()
  coverFormat?: string;

  @ApiProperty({ example: 200 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiProperty({ example: 500000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';

  @ApiProperty({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}
