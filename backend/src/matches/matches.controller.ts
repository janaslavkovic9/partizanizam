import { Controller, Get, Post as HttpPost, Body, Param, Request } from '@nestjs/common';
import { MatchesService } from './matches.service';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  async findAll() {
    return this.matchesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.matchesService.findOne(id);
  }

  @HttpPost()
  async create(@Body() matchData: any) {
    return this.matchesService.create(matchData);
  }
}