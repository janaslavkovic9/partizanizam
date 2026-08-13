import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class PostsService {
  private posts: any[] = [
    {
      id: '1',
      content: 'Dobrodošli na mrežu! Ovo je prva zvanična objava.',
      createdAt: new Date(),
      user: { id: '101', username: 'OnyxAdmin' },
      likes: [],
      comments: [
        {
          id: '101',
          content: 'Sjajan dizajn!',
          username: 'Korisnik1',
          createdAt: new Date(),
        },
      ],
    },
    {
      id: '2',
      content: 'Testing Angular + NestJS integracije. Sve radi u realnom vremenu!',
      createdAt: new Date(),
      user: { id: '102', username: 'Developer' },
      likes: [],
      comments: [],
    },
  ];

  async findAll(): Promise<any[]> {
    return this.posts;
  }

  async create(content: string, user: any): Promise<any> {
    const newPost = {
      id: Date.now().toString(),
      content,
      createdAt: new Date(),
      user: {
        id: user?.id || '1',
        username: user?.username || 'Korisnik',
      },
      likes: [],
      comments: [],
    };

    this.posts.unshift(newPost);
    return newPost;
  }

  async toggleLike(postId: string, user: any): Promise<any> {
    const post = this.posts.find((p) => p.id === postId);

    if (!post) {
      throw new NotFoundException('Objava nije pronađena');
    }

    if (!post.likes) {
      post.likes = [];
    }

    const userId = user?.id || user;
    const index = post.likes.findIndex((like: any) =>
      typeof like === 'string' ? like === userId : like?.id === userId
    );

    if (index > -1) {
      post.likes.splice(index, 1);
    } else {
      post.likes.push(user);
    }

    return post;
  }

  async addComment(postId: string, content: string, user: any): Promise<any> {
    const post = this.posts.find((p) => p.id === postId);

    if (!post) {
      throw new NotFoundException('Objava nije pronađena');
    }

    if (!post.comments) {
      post.comments = [];
    }

    const newComment = {
      id: Date.now().toString(),
      content,
      username: user?.username || 'Korisnik',
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    return post;
  }
}