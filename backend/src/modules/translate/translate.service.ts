import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SaveTranslationDTO } from 'src/modules/translate/dto/save-translation.dto';
import { TranslateDTO } from 'src/modules/translate/dto/translate.dto';
import { Translation } from 'src/modules/translate/entities/translate.entity';
import { Repository } from 'typeorm';

interface IUserRequest {
  userId: string;
  name: string;
  email: string;
}
@Injectable()
export class TranslateService {
  constructor(
    @InjectRepository(Translation)
    private readonly translateRepository: Repository<Translation>,
  ) {}

  async getTranslations(user: IUserRequest) {
    const result = await this.translateRepository.find({
      where: { user: { id: user.userId } },
      order: { timestamp: 'DESC' },
    });
    return {
      data: {
        translations: result,
        userId: user.userId,
      },
      message: 'Translations get list successfully',
    };
  }

  async saveTranslation(translateDTO: SaveTranslationDTO) {
    const translation = await this.translateRepository.findOne({
      where: {
        id: translateDTO.id,
        user: { id: translateDTO.userId },
      },
    });

    if (!translation) {
      throw new BadRequestException('Translation không tồn tại');
    }

    await this.translateRepository.update(
      {
        id: translateDTO.id,
        user: { id: translateDTO.userId },
      },
      { save: translateDTO.saved },
    );

    return {
      message: 'Translation lưu thành công',
    };
  }

  async deleteTranslation(userId: string, translationId: string) {
    const translation = await this.translateRepository.findOne({
      where: {
        id: translationId,
        user: { id: userId },
      },
    });

    if (!translation) {
      throw new BadRequestException('Translation not found');
    }

    await this.translateRepository.delete(translationId);

    const result = await this.translateRepository.find({
      where: { user: { id: userId }, id: translationId },
    });
    return {
      data: {
        translations: result,
        userId: userId,
      },
      message: 'Translation deleted successfully',
    };
  }

  async createTranslation(user: IUserRequest, body: TranslateDTO) {
    const translation = await this.translateRepository.findOne({
      where: {
        fromText: body.fromText,
        from: body.from,
        to: body.to,
        user: { id: user.userId },
      },
    });

    if (translation) {
      return this.updateTranslation(user, body);
    } else {
      const newTranslation = this.translateRepository.create({
        ...body,
        user: { id: user.userId },
      });

      const result = await this.translateRepository.save(newTranslation);

      return {
        data: result,
        message: 'Translation created successfully',
      };
    }
  }

  async updateTranslation(user: IUserRequest, body: TranslateDTO) {
    const translation = await this.translateRepository.findOne({
      where: {
        fromText: body.fromText,
        from: body.from,
        to: body.to,
        user: { id: user.userId },
      },
    });

    await this.translateRepository.update(
      {
        user: { id: user.userId },
        id: translation.id,
      },
      { ...body },
    );
    const translationUpdated = await this.translateRepository.findOne({
      where: {
        id: translation.id,
      },
    });

    return {
      data: translationUpdated,
      message: 'Translation updated successfully',
    };
  }
}
