import { Injectable, NotFoundException } from '@nestjs/common';

export interface Match {
  id: string;
  opponent: string;
  date: string;
  time: string;
  location: string;
  competition: string;
  isHome: boolean;
  cafeName?: string;
  lat?: number;
  lng?: number;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

@Injectable()
export class MatchesService {
  private matches: Match[] = [
    {
      id: '1',
      opponent: 'Crvena zvezda',
      date: '2026-09-15',
      time: '20:00',
      location: 'Beogradska Arena',
      competition: 'Evroliga',
      isHome: true,
      cafeName: 'Pivnica Partizanizam',
      lat: 44.8155,
      lng: 20.4590,
      status: 'SCHEDULED',
    },
  ];

  async findAll(): Promise<Match[]> {
    return this.matches;
  }

  async create(createMatchDto: any): Promise<Match> {
    const newMatch: Match = {
      id: Date.now().toString(),
      opponent: createMatchDto.opponent,
      date: createMatchDto.date,
      time: createMatchDto.time,
      location: createMatchDto.location || 'Beogradska Arena',
      competition: createMatchDto.competition || 'Evroliga',
      isHome: createMatchDto.isHome ?? true,
      cafeName: createMatchDto.cafeName || undefined,
      lat: createMatchDto.lat || undefined,
      lng: createMatchDto.lng || undefined,
      status: 'SCHEDULED',
    };

    this.matches.unshift(newMatch);
    return newMatch;
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const index = this.matches.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new NotFoundException('Utakmica nije pronađena.');
    }
    this.matches.splice(index, 1);
    return { success: true };
  }
}