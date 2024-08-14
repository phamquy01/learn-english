import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TranslateDTO } from 'src/dto/translate.dto';
import { Translation } from 'src/entities/translate.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TranslateService {
  constructor(
    @InjectRepository(Translation)
    private readonly translateRepository: Repository<Translation>,
  ) {}
  async createTranslate(accountId: number, body: TranslateDTO) {
    const existingTranslate = await this.translateRepository.findOne({
      where: {
        ...body,
        account: { id: accountId },
      },
      relations: ['account'],
    });

    if (existingTranslate) {
      throw new ForbiddenException('Bản dịch này đã tồn tại');
    }

    const newTranslate = this.translateRepository.create({
      ...body,
      account: { id: accountId },
    });

    return this.translateRepository.save(newTranslate);
  }
}
