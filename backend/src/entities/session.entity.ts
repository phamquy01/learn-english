import { Account } from 'src/entities/account.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  refreshToken: string;

  @Column()
  expiresAt: Date;

  @ManyToOne(() => Account, (account) => account.sessions)
  account: Account;
}
