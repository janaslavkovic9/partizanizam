export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: QuizOption[];
  userAnswerId?: string;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  dateTime: Date;
  location: string;
  status: 'UPCOMING' | 'FINISHED';
  score?: {
    home: number;
    away: number;
  };
  quiz?: QuizQuestion[];
}