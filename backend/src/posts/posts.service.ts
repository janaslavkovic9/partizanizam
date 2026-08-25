import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class PostsService {
  private posts: any[] = [
    {
      id: '1',
      title: 'Dobrodošlica',
      content: 'Dobrodošli na mrežu! ',
      createdAt: new Date(),
      user: { id: '101', username: 'Admin' },
      likes: [],
      comments: [
        {
          id: '101',
          content: 'Sjajan dizajn!',
          username: 'Gost',
          user: { id: '102', username: 'Gost' },
          createdAt: new Date(),
        },
      ],
    }
  ];

  async findAll(): Promise<any[]> {
    return this.posts;
  }

  async create(createPostDto: any, user: any): Promise<any> {
    const content = typeof createPostDto === 'string' ? createPostDto : createPostDto?.content;
    const title = createPostDto?.title || undefined;
    const imageUrl = createPostDto?.imageUrl || undefined;

    const author = user || createPostDto?.user;

    const newPost = {
      id: Date.now().toString(),
      title,
      content,
      imageUrl,
      createdAt: new Date(),
      user: {
        id: author?.id || author?.sub || Date.now().toString(),
        username: author?.username || author?.name || author?.email || 'Korisnik',
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
      post.likes.push(user || { id: userId });
    }

    return post;
  }

  async addComment(postId: string, commentData: any, user: any): Promise<any> {
    const post = this.posts.find((p) => p.id === postId);

    if (!post) {
      throw new NotFoundException('Objava nije pronađena');
    }

    if (!post.comments) {
      post.comments = [];
    }

    const content = typeof commentData === 'string' ? commentData : commentData?.content;
    const author = user || commentData?.user;

    const newComment = {
      id: Date.now().toString(),
      content,
      username: author?.username || 'Korisnik',
      user: {
        id: author?.id || author?.sub || Date.now().toString(),
        username: author?.username || 'Korisnik',
      },
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    return post;
  }
}