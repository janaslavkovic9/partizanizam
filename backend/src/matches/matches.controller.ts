import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  async getAll() {
    return this.matchesService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.matchesService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body('opponent') opponent: string,
    @Body('score') score: string,
    @Body('location') location: string,
    @Body('matchDate') matchDate: Date,
    @Body('isHomeMatch') isHomeMatch: boolean,
  ) {
    return this.matchesService.create(opponent, score, location, matchDate, isHomeMatch);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.matchesService.remove(id);
  }
}