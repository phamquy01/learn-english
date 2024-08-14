import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from 'src/app.controller';
import { AccountModule } from './account/account.module';
import { Account, Session, Translation } from 'src/entities';
import { TranslateModule } from './translate/translate.module';
import { dataSourceOptions } from 'db/data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    AccountModule,
    TranslateModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
