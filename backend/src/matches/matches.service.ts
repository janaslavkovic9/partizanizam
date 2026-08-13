import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class MatchesService {
  private matches: any[] = [
    {
      id: '1',
      homeTeam: 'KK Partizan',
      awayTeam: 'Real Madrid',
      dateTime: new Date('2026-10-15T20:30:00'),
      location: 'Beogradska Arena',
      score: { home: 88, away: 82 },
      status: 'FINISHED',
    },
    {
      id: '2',
      homeTeam: 'Crvena Zvezda',
      awayTeam: 'KK Partizan',
      dateTime: new Date('2026-11-02T19:00:00'),
      location: 'Hala Aleksandar Nikolić',
      score: null,
      status: 'UPCOMING',
    },
  ];

  async findAll(): Promise<any[]> {
    return this.matches;
  }

  async findOne(id: string): Promise<any> {
    const match = this.matches.find((m) => m.id === id);
    if (!match) {
      throw new NotFoundException('Utakmica nije pronađena');
    }
    return match;
  }

  async create(matchData: any): Promise<any> {
    const newMatch = {
      id: Date.now().toString(),
      homeTeam: matchData.homeTeam,
      awayTeam: matchData.awayTeam,
      dateTime: new Date(matchData.dateTime),
      location: matchData.location || 'Glavna Arena',
      score: null,
      status: 'UPCOMING',
    };

    this.matches.unshift(newMatch);
    return newMatch;
  }
}