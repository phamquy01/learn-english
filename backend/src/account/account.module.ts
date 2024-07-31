import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, Session } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Session])],
  providers: [AccountService],
  controllers: [AccountController],
})
export class AccountModule {}
