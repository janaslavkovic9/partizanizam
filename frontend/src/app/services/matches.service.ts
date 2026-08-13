import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Match, QuizQuestion } from '../models/match.model';

@Injectable({
  providedIn: 'root'
})
export class MatchesService {
  private matches: Match[] = [];

  constructor() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const defaultQuiz = (home: string, away: string): QuizQuestion[] => [
      {
        id: 'q1',
        questionText: 'Ko će postići najviše poena na utakmici?',
        options: [
          { id: 'o1', text: `${home} igrač` },
          { id: 'o2', text: `${away} igrač` }
        ]
      },
      {
        id: 'q2',
        questionText: 'Ko će izvesti prvo slobodno bacanje?',
        options: [
          { id: 'o1', text: home },
          { id: 'o2', text: away }
        ]
      },
      {
        id: 'q3',
        questionText: 'Ukupan broj trojki na meču:',
        options: [
          { id: 'o1', text: 'Manje od 15' },
          { id: 'o2', text: '15 ili više' }
        ]
      }
    ];

    this.matches = [
      {
        id: '1',
        homeTeam: 'Partizan',
        awayTeam: 'Real Madrid',
        dateTime: new Date(year, month, 5, 20, 30),
        location: 'Štark Arena, Beograd',
        status: 'FINISHED',
        score: { home: 88, away: 82 },
        quiz: defaultQuiz('Partizan', 'Real Madrid')
      },
      {
        id: '2',
        homeTeam: 'Olympiacos',
        awayTeam: 'Partizan',
        dateTime: new Date(year, month, 10, 20, 15),
        location: 'Peace and Friendship Stadium, Atina',
        status: 'FINISHED',
        score: { home: 74, away: 79 },
        quiz: defaultQuiz('Olympiacos', 'Partizan')
      },
      {
        id: '3',
        homeTeam: 'Partizan',
        awayTeam: 'Barcelona',
        dateTime: new Date(year, month, 15, 20, 30),
        location: 'Štark Arena, Beograd',
        status: 'UPCOMING',
        quiz: defaultQuiz('Partizan', 'Barcelona')
      },
      {
        id: '4',
        homeTeam: 'Crvena Zvezda',
        awayTeam: 'Partizan',
        dateTime: new Date(year, month, 20, 21, 0),
        location: 'Hala Aleksandar Nikolić, Beograd',
        status: 'UPCOMING',
        quiz: defaultQuiz('Crvena Zvezda', 'Partizan')
      },
      {
        id: '5',
        homeTeam: 'Partizan',
        awayTeam: 'AX Armani Exchange Milan',
        dateTime: new Date(year, month, 25, 20, 30),
        location: 'Štark Arena, Beograd',
        status: 'UPCOMING',
        quiz: defaultQuiz('Partizan', 'AX Armani Exchange Milan')
      }
    ];
  }

  getMatches(): Observable<Match[]> {
    return of(this.matches);
  }

  addMatch(newMatchData: Omit<Match, 'id'>): Observable<Match> {
    const newMatch: Match = {
      ...newMatchData,
      id: Date.now().toString(),
      quiz: [
        {
          id: 'q1',
          questionText: 'Ko će postići najviše poena na utakmici?',
          options: [
            { id: 'o1', text: `${newMatchData.homeTeam} igrač` },
            { id: 'o2', text: `${newMatchData.awayTeam} igrač` }
          ]
        },
        {
          id: 'q2',
          questionText: 'Ko će izvesti prvo slobodno bacanje?',
          options: [
            { id: 'o1', text: newMatchData.homeTeam },
            { id: 'o2', text: newMatchData.awayTeam }
          ]
        }
      ]
    };
    this.matches.push(newMatch);
    return of(newMatch);
  }

  saveQuizAnswers(matchId: string, answers: { [questionId: string]: string }): Observable<boolean> {
    const match = this.matches.find(m => m.id === matchId);
    if (match && match.quiz) {
      match.quiz.forEach(q => {
        if (answers[q.id]) {
          q.userAnswerId = answers[q.id];
        }
      });
      return of(true);
    }
    return of(false);
  }
}