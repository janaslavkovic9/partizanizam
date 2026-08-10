import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';
import { User } from '../users/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
    @InjectRepository(Like) private likesRepository: Repository<Like>,
  ) {}

  async findAll() {
    return this.postsRepository.find({
      relations: {
        user: true,
        comments: { user: true },
        likes: { user: true },
      },
      order: { createdAt: 'DESC' },
    });
  }

  async create(content: string, user: User) {
    const post = this.postsRepository.create({ content, user });
    return this.postsRepository.save(post);
  }

  async remove(id: string, user: User) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!post) throw new NotFoundException('Objava nije pronađena.');
    if (post.user.id !== user.id) throw new UnauthorizedException('Nemate dozvolu za brisanje ove objave.');

    return this.postsRepository.remove(post);
  }

  async toggleLike(postId: string, user: User) {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Objava nije pronađena.');

    const existingLike = await this.likesRepository.findOne({
      where: { post: { id: postId }, user: { id: user.id } },
    });

    if (existingLike) {
      await this.likesRepository.remove(existingLike);
      return { liked: false };
    } else {
      const newLike = this.likesRepository.create({ post, user });
      await this.likesRepository.save(newLike);
      return { liked: true };
    }
  }

  async addComment(postId: string, content: string, user: User) {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Objava nije pronađena.');

    const comment = this.commentsRepository.create({ content, post, user });
    return this.commentsRepository.save(comment);
  }
}