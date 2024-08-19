// import { ForbiddenException, Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { TranslateDTO } from 'src/modules/translate/dto/translate.dto';
// import { Translation } from 'src/modules/translate/entities/translate.entity';
// import { Repository } from 'typeorm';

// @Injectable()
// export class TranslateService {
//   constructor(
//     @InjectRepository(Translation)
//     private readonly translateRepository: Repository<Translation>,
//   ) {}
//   async createTranslate(userId: number, body: TranslateDTO) {
//     const existingTranslate = await this.translateRepository.findOne({
//       where: {
//         ...body,
//         user: { id: userId },
//       },
//       relations: ['user'],
//     });

//     if (existingTranslate) {
//       throw new ForbiddenException('Bản dịch này đã tồn tại');
//     }

//     const newTranslate = this.translateRepository.create({
//       ...body,
//       user: { id: userId },
//     });

//     return this.translateRepository.save(newTranslate);
//   }
// }
