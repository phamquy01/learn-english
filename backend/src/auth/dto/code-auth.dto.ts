import { IsNotEmpty } from 'class-validator';

export class CodeAuthDTO {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  code: string;
}
