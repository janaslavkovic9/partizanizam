import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatchesService, Match } from '../../core/services/matches.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {
  matches: Match[] = [];
  opponent = '';
  score = '';
  location = '';

  constructor(
    public matchesService: MatchesService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadMatches();
  }

  loadMatches(): void {
    this.matchesService.getAll().subscribe((data) => {
      this.matches = data;
    });
  }

  createMatch(): void {
    if (!this.opponent || !this.score) return;

    this.matchesService.create({
      opponent: this.opponent,
      score: this.score,
      location: this.location || 'Beogradska Arena',
      matchDate: new Date().toISOString(),
      isHomeMatch: true
    }).subscribe(() => {
      this.opponent = '';
      this.score = '';
      this.location = '';
      this.loadMatches();
    });
  }
}