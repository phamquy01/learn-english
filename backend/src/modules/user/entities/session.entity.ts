import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

  // @ManyToOne(() => User, (user) => user.sessions)
  // user: User;
}
