import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateAuthDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  password: string;

  @IsOptional()
  name?: string;
}
