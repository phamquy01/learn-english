import { IsNotEmpty } from 'class-validator';

export class SaveTranslationDTO {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  saved: boolean;
}
