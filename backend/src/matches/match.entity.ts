import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  opponent: string;

  @Column()
  score: string; 

  @Column()
  location: string; 

  @Column({ type: 'timestamp' })
  matchDate: Date;

  @Column({ default: false })
  isHomeMatch: boolean;

  @CreateDateColumn()
  createdAt: Date;
}