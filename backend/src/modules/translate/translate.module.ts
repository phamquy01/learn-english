import { Module } from '@nestjs/common';
import { TranslateController } from './translate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Translation } from 'src/modules/translate/entities/translate.entity';
import { TranslateService } from 'src/modules/translate/translate.service';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Translation, User])],
  controllers: [TranslateController],
  providers: [TranslateService],
})
export class TranslateModule {}
