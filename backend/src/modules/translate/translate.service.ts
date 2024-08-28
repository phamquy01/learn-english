import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TranslateDTO } from 'src/modules/translate/dto/translate.dto';
import { Translation } from 'src/modules/translate/entities/translate.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TranslateService {
  constructor(
    @InjectRepository(Translation)
    private readonly translateRepository: Repository<Translation>,
  ) {}

  async createOrUpdate(user: any, body: TranslateDTO) {
    console.log('userId', user);
    console.log('body', body);

    const translation = await this.translateRepository.findOne({
      where: {
        fromText: body.fromText,
        from: body.from,
        to: body.to,
        user: { id: user.userId },
      },
    });

    if (translation) {
      await this.translateRepository.update(
        { id: translation.id, user: { id: user.userId } },
        { ...body },
      );
      return await this.translateRepository.findOne({
        where: { id: translation.id },
      });
    } else {
      const createTranslation = this.translateRepository.create({
        fromText: body.fromText,
        from: body.from,
        toText: body.toText,
        to: body.to,
        user: { id: user.userId },
      });
      return await this.translateRepository.save(createTranslation);
    }
  }
}
