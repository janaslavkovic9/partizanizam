import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './match.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
  ) {}

  async findAll(): Promise<Match[]> {
    return this.matchRepository.find({
      order: { matchDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Match> {
    const match = await this.matchRepository.findOne({ where: { id } });
    if (!match) {
      throw new NotFoundException('Utakmica nije pronađena.');
    }
    return match;
  }

  async create(
    opponent: string,
    score: string,
    location: string,
    matchDate: Date,
    isHomeMatch: boolean,
  ): Promise<Match> {
    const match = this.matchRepository.create({
      opponent,
      score,
      location,
      matchDate,
      isHomeMatch,
    });
    return this.matchRepository.save(match);
  }

  async remove(id: string): Promise<void> {
    const match = await this.findOne(id);
    await this.matchRepository.remove(match);
  }
}