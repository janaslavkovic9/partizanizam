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
  async create(@Body() body: any, @Request() req: any) {
    const user = req.user || body.user;
    return this.postsService.create(body, user);
  }

  @HttpPost(':id/like')
  async toggleLike(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    const user = req.user || body?.user;
    return this.postsService.toggleLike(id, user);
  }

  @HttpPost(':id/comments')
  async addComment(
    @Param('id') id: string,
    @Body() body: any,
    @Request() req: any,
  ) {
    const user = req.user || body?.user;
    return this.postsService.addComment(id, body, user);
  }
}