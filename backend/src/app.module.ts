import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from 'src/app.controller';
import { AccountModule } from './account/account.module';
import { Account, Session } from 'src/entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3309,
      username: 'quypham',
      password: 'Abc123456',
      database: 'backend-db',
      entities: [Account, Session],
      synchronize: true,
    }),
    AuthModule,
    AccountModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
