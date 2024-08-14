import { Module } from '@nestjs/common';
import { TranslateController } from './translate.controller';
import { TranslateService } from './translate.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, Translation } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Translation, Account])],
  controllers: [TranslateController],
  providers: [TranslateService],
})
export class TranslateModule {}
