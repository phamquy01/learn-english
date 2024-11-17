import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { WordService } from './word.service';

@Controller('words')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  //pagination
  @Get()
  async getWords(
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.wordService.getWords(current, pageSize);
  }
}
