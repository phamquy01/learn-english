import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name?: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({
    default: 'USER',
  })
  role: string;

  @Column({
    default: 'LOCAL',
  })
  accountType: string;

  @Column({
    default: false,
  })
  isActive: boolean;

  @Column({ nullable: true })
  codeId?: string;

  @Column()
  codeExpired?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // @OneToMany(() => Session, (session) => session.user)
  // sessions: Session[];

  // @OneToMany(() => Translation, (translate) => translate.user)
  // translations: Translation[];
}