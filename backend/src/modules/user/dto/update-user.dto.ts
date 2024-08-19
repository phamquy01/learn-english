import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDTO {
  @IsNotEmpty()
  id: string;

  name?: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  image: string;

  @IsOptional()
  address: string;
}
