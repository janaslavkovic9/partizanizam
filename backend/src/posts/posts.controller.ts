import { Controller, Get, Post as HttpPost, Body, Param, Request } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll() {
    return this.postsService.findAll();
  }

  @HttpPost()
  async create(@Body('content') content: string, @Request() req: any) {
    const user = req.user || { id: '1', username: 'Korisnik' };
    return this.postsService.create(content, user);
  }

  @HttpPost(':id/like')
  async toggleLike(@Param('id') id: string, @Request() req: any) {
    const user = req.user || { id: '1', username: 'Korisnik' };
    return this.postsService.toggleLike(id, user);
  }

  @HttpPost(':id/comments')
  async addComment(
    @Param('id') id: string,
    @Body('content') content: string,
    @Request() req: any,
  ) {
    const user = req.user || { id: '1', username: 'Korisnik' };
    return this.postsService.addComment(id, content, user);
  }
}