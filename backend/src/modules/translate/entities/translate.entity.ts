import { User } from 'src/modules/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Translation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fromText: string;

  @Column()
  from: string;

  @Column()
  toText: string;

  @Column()
  to: string;

  @UpdateDateColumn()
  timestamp: Date;

  @ManyToOne(() => User, (user) => user.translations)
  user: User;
}
