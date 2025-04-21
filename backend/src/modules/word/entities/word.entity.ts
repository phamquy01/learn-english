import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Word {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  word: string;

  @Column()
  type: string;

  @Column()
  pronounce: string;

  @Column()
  meaning: string;
}
