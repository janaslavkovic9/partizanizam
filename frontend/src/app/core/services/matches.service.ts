import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Match {
  id: string;
  opponent: string;
  score: string;
  location: string;
  matchDate: string;
  isHomeMatch: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MatchesService {
  private apiUrl = 'http://localhost:3001/matches';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Match[]> {
    return this.http.get<Match[]>(this.apiUrl);
  }

  create(matchData: any): Observable<Match> {
    return this.http.post<Match>(this.apiUrl, matchData);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}