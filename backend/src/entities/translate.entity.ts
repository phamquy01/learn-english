import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard';
import { Account } from 'src/entities/account.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
@UseGuards(JwtAuthGuard)
export class Translation {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  fromText: string;

  @Column()
  from: string;

  @Column()
  toText: string;

  @Column()
  to: string;

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => Account, (account) => account.translations)
  account: Account;
}
