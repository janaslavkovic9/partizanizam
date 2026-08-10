import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable:true})
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user: User) => user.posts, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Comment, (comment: Comment) => comment.post, { cascade: true })
  comments: Comment[];

  @OneToMany(() => Like, (like: Like) => like.post, { cascade: true })
  likes: Like[];
}