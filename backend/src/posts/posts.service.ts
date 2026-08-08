import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async findAll(): Promise<Post[]> {
    return this.postsRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(createPostDto: { content: string }, user: any): Promise<Post> {
    const newPost = this.postsRepository.create({
      content: createPostDto.content,
      user: user,
    });
    return this.postsRepository.save(newPost);
  }

  async remove(postId: string, userId: string): Promise<{ message: string }> {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException('Objava nije pronađena');
    }

    if (post.user.id !== userId) {
      throw new UnauthorizedException('Možete brisati samo sopstvene objave');
    }

    await this.postsRepository.remove(post);
    return { message: 'Objava uspešno obrisana' };
  }
}