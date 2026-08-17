import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Match } from '../models/match.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MatchesService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:3001/matches';

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }


  getMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(this.apiUrl);
  }

  getMatchById(id: string): Observable<Match> {
    return this.http.get<Match>(`${this.apiUrl}/${id}`);
  }

  addMatch(matchData: Omit<Match, 'id'>): Observable<Match> {
    return this.http.post<Match>(this.apiUrl, matchData, {
      headers: this.getAuthHeaders()
    });
  }

  saveQuizAnswers(matchId: string, answers: { [key: string]: string }): Observable<Match> {
    return this.http.post<Match>(`${this.apiUrl}/${matchId}/quiz`, answers);
  }
}