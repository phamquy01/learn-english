import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import aqp from 'api-query-params';
import { Word } from 'src/modules/word/entities/word.entity';
import { Repository, W } from 'typeorm';

@Injectable()
export class WordService {
  constructor(
    @InjectRepository(Word)
    private wordRepository: Repository<Word>,
  ) {}

  async getWords(current: number, pageSize: number) {
    const randomPage = Math.floor(Math.random() * 100);
    if (!current) current = randomPage;
    if (!pageSize) pageSize = 20;

    const totalItems = await this.wordRepository.count();
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (+current - 1) * pageSize;
    const words = await this.wordRepository.find({
      skip,
      take: pageSize,
    });
    return {
      message: 'Lấy dữ liệu từ vựng thành công',
      words,
      totalItems,
      totalPages,
    };
  }
}
