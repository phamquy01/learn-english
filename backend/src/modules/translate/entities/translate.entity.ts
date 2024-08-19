import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
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

  // @ManyToOne(() => User, (user) => user.translations)
  // user: User;
}
