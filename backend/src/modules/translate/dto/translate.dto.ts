import { IsNotEmpty } from 'class-validator';

export class TranslateDTO {
  @IsNotEmpty()
  to: string;

  @IsNotEmpty()
  from: string;

  @IsNotEmpty()
  fromText: string;

  @IsNotEmpty()
  toText: string;
}
