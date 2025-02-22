import { IsOptional } from 'class-validator';

export class UpdateAddressDto {
  @IsOptional()
  fullName: string;

  @IsOptional()
  phoneNumber: string;

  @IsOptional()
  street: string;

  @IsOptional()
  city: string;

  @IsOptional()
  state: string;

  @IsOptional()
  country: string;

  @IsOptional()
  zipCode: string;
}
