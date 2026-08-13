import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatchesService } from '../../../services/matches.service';
import { Match, QuizQuestion } from '../../../models/match.model';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  matches: Match[];
}

@Component({
  selector: 'app-match-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
      background-color: #0b0c10;
      color: #e2e8f0;
    }
    .wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
      padding: 30px 16px;
      box-sizing: border-box;
    }
    .container {
      width: 100%;
      max-width: 720px;
    }
    .card-custom {
      background-color: #161920;
      border: 1px solid #2a2e39;
      border-radius: 14px;
      padding: 24px;
      margin-bottom: 20px;
      width: 100%;
      box-sizing: border-box;
    }
    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .btn-nav {
      background-color: #0f1115;
      border: 1px solid #2a2e39;
      color: #00D2FF;
      border-radius: 8px;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    .btn-nav:hover {
      background-color: rgba(0, 210, 255, 0.15);
      border-color: #00D2FF;
    }
    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 8px;
    }
    .weekday-header {
      text-align: center;
      font-weight: 700;
      color: #64748b;
      font-size: 0.85rem;
      padding-bottom: 8px;
    }
    .calendar-day {
      background-color: #0f1115;
      border: 1px solid #2a2e39;
      border-radius: 10px;
      min-height: 75px;
      padding: 6px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }
    .calendar-day:hover {
      border-color: #00D2FF;
      background-color: rgba(0, 210, 255, 0.05);
    }
    .calendar-day.other-month {
      opacity: 0.35;
    }
    .calendar-day.today {
      border-color: #00D2FF;
    }
    .calendar-day.has-match {
      background-color: rgba(0, 210, 255, 0.08);
      border-color: rgba(0, 210, 255, 0.4);
    }
    .day-number {
      font-size: 0.85rem;
      font-weight: 700;
      color: #cbd5e1;
    }
    .match-badge {
      background-color: #00D2FF;
      color: #0b0c10;
      font-size: 0.65rem;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 4px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      margin-top: 4px;
    }
    .input-custom {
      background-color: #0f1115;
      border: 1px solid #2a2e39;
      color: #f8fafc;
      border-radius: 8px;
      padding: 10px 14px;
      width: 100%;
      box-sizing: border-box;
    }
    .input-custom:focus {
      outline: none;
      border-color: #00D2FF;
      box-shadow: 0 0 0 2px rgba(0, 210, 255, 0.2);
    }
    .btn-custom {
      background-color: #00D2FF;
      color: #0b0c10;
      font-weight: 700;
      border: none;
      border-radius: 8px;
      padding: 10px 18px;
      transition: background-color 0.2s ease;
    }
    .btn-custom:hover {
      background-color: #33dcfd;
    }
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      padding: 16px;
      box-sizing: border-box;
    }
    .modal-card {
      background-color: #161920;
      border: 1px solid #2a2e39;
      border-radius: 16px;
      width: 100%;
      max-width: 520px;
      max-height: 90vh;
      overflow-y: auto;
      padding: 24px;
      box-shadow: 0 20px 30px rgba(0, 0, 0, 0.6);
      position: relative;
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    .btn-close-modal {
      position: absolute;
      top: 16px;
      right: 16px;
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 1.2rem;
      cursor: pointer;
    }
    .btn-close-modal:hover {
      color: #00D2FF;
    }
    .score-box {
      background-color: #0f1115;
      border: 1px solid #2a2e39;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 1.3rem;
      font-weight: 800;
      color: #00D2FF;
    }
    .badge-status {
      font-size: 0.75rem;
      padding: 4px 10px;
      border-radius: 20px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .badge-finished {
      background: rgba(148, 163, 184, 0.1);
      color: #94a3b8;
      border: 1px solid #2a2e39;
    }
    .badge-upcoming {
      background: rgba(0, 210, 255, 0.1);
      color: #00D2FF;
      border: 1px solid #00D2FF;
    }
    .quiz-container {
      background-color: #0f1115;
      border: 1px solid #2a2e39;
      border-radius: 12px;
      padding: 16px;
      margin-top: 16px;
    }
    .quiz-question {
      font-size: 0.9rem;
      font-weight: 600;
      color: #e2e8f0;
      margin-bottom: 8px;
    }
    .quiz-option {
      background-color: #161920;
      border: 1px solid #2a2e39;
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .quiz-option:hover {
      border-color: #00D2FF;
    }
    .quiz-option.selected {
      background-color: rgba(0, 210, 255, 0.15);
      border-color: #00D2FF;
      color: #00D2FF;
      font-weight: 700;
    }
  `],
  template: `
    <div class="wrapper">
      <div class="container">

        <!-- Forma za dodavanje utakmice -->
        <div class="card-custom shadow-lg">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="fw-bold mb-0" style="color: #00D2FF;">Dodaj Novu Utakmicu</h5>
            <button class="btn-nav" (click)="showAddForm = !showAddForm">
              <i class="bi" [ngClass]="showAddForm ? 'bi-dash-lg' : 'bi-plus-lg'"></i>
            </button>
          </div>

          <div *ngIf="showAddForm" class="d-flex flex-column gap-3 mt-3">
            <div class="d-flex gap-2">
              <input type="text" class="input-custom" placeholder="Domaći Tim" [(ngModel)]="newMatch.homeTeam" />
              <input type="text" class="input-custom" placeholder="Gostujući Tim" [(ngModel)]="newMatch.awayTeam" />
            </div>

            <div class="d-flex gap-2">
              <input type="datetime-local" class="input-custom" [(ngModel)]="newMatchDateTime" />
              <input type="text" class="input-custom" placeholder="Lokacija" [(ngModel)]="newMatch.location" />
            </div>

            <div class="d-flex justify-content-end mt-2">
              <button class="btn-custom" (click)="onAddMatch()">Zakaži Utakmicu</button>
            </div>
          </div>
        </div>

        <!-- Kalendar -->
        <div class="card-custom shadow-lg">
          <div class="calendar-header">
            <button class="btn-nav" (click)="changeMonth(-1)">
              <i class="bi bi-chevron-left"></i>
            </button>
            <h4 class="fw-bold mb-0 text-white">
              {{ currentDisplayDate | date:'LLLL yyyy.' }}
            </h4>
            <button class="btn-nav" (click)="changeMonth(1)">
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>

          <div class="calendar-grid mb-2">
            <div *ngFor="let dayName of weekDays" class="weekday-header">
              {{ dayName }}
            </div>
          </div>

          <div class="calendar-grid">
            <div 
              *ngFor="let day of calendarDays" 
              class="calendar-day"
              [ngClass]="{
                'other-month': !day.isCurrentMonth,
                'today': day.isToday,
                'has-match': day.matches.length > 0
              }"
              (click)="selectDay(day)"
            >
              <div class="day-number">{{ day.date.getDate() }}</div>
              
              <div *ngIf="day.matches.length > 0" class="d-flex flex-column gap-1">
                <div *ngFor="let m of day.matches" class="match-badge">
                  🏀 {{ m.homeTeam }}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Pop-up Modal za Prikaz Utakmice i Kviz -->
    <div *ngIf="selectedDay && selectedDay.matches.length > 0" class="modal-backdrop" (click)="closeModal()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <button class="btn-close-modal" (click)="closeModal()">
          <i class="bi bi-x-lg"></i>
        </button>

        <h5 class="fw-bold mb-3" style="color: #00D2FF;">Detalji Utakmice</h5>

        <div *ngFor="let match of selectedDay.matches" class="d-flex flex-column gap-3">
          <div class="d-flex justify-content-between align-items-center">
            <span class="text-muted" style="font-size: 0.85rem;">📍 {{ match.location }}</span>
            <span 
              class="badge-status" 
              [ngClass]="match.status === 'FINISHED' ? 'badge-finished' : 'badge-upcoming'"
            >
              {{ match.status === 'FINISHED' ? 'Završeno' : 'Predstojeći' }}
            </span>
          </div>

          <div class="d-flex justify-content-between align-items-center my-2 text-center">
            <div class="fw-bold text-white text-start" style="flex: 1; font-size: 1.1rem;">
              {{ match.homeTeam }}
            </div>

            <div class="px-3">
              <div *ngIf="match.score" class="score-box">
                {{ match.score.home }} : {{ match.score.away }}
              </div>
              <div *ngIf="!match.score" class="fw-bold text-muted" style="font-size: 1.1rem;">
                VS
              </div>
            </div>

            <div class="fw-bold text-white text-end" style="flex: 1; font-size: 1.1rem;">
              {{ match.awayTeam }}
            </div>
          </div>

          <div class="text-center text-muted pt-2" style="border-top: 1px solid #2a2e39; font-size: 0.9rem;">
            🕒 {{ match.dateTime | date:'EEEE, dd.MM.yyyy. u HH:mm' }}
          </div>

          <!-- KVIZ SEKCIJA -->
          <div *ngIf="match.quiz && match.quiz.length > 0" class="quiz-container">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <h6 class="fw-bold mb-0 text-white">🎯 Navijački Kviz Predviđanja</h6>
              <small *ngIf="match.status === 'FINISHED'" class="text-muted">
                (Zatvoreno)
              </small>
            </div>

            <div *ngFor="let q of match.quiz" class="mb-3">
              <div class="quiz-question">{{ q.questionText }}</div>
              
              <div class="d-flex flex-column gap-2">
                <div 
                  *ngFor="let opt of q.options"
                  class="quiz-option"
                  [ngClass]="{
                    'selected': isOptionSelected(q.id, opt.id, match)
                  }"
                  (click)="match.status === 'UPCOMING' && selectOption(q.id, opt.id)"
                >
                  <i class="bi" [ngClass]="isOptionSelected(q.id, opt.id, match) ? 'bi-check-circle-fill' : 'bi-circle'"></i>
                  {{ opt.text }}
                </div>
              </div>
            </div>

            <div *ngIf="match.status === 'UPCOMING'" class="d-flex justify-content-end mt-3">
              <button 
                class="btn-custom" 
                [disabled]="!hasUserSelectedAnswers()" 
                (click)="submitQuiz(match.id)"
              >
                Sačuvaj
              </button>
            </div>
            
            <div *ngIf="match.status === 'FINISHED'" class="text-center text-muted mt-2" style="font-size: 0.8rem;">
              Kviz je zatvoren jer je utakmica završena.
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class MatchListComponent implements OnInit {
  private matchesService = inject(MatchesService);

  matches: Match[] = [];
  calendarDays: CalendarDay[] = [];
  currentDisplayDate = new Date();
  selectedDay: CalendarDay | null = null;
  showAddForm = false;

  newMatchDateTime = '';
  newMatch: Partial<Match> = {
    homeTeam: '',
    awayTeam: '',
    location: '',
    status: 'UPCOMING'
  };

  quizAnswers: { [questionId: string]: string } = {};

  weekDays = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'];

  ngOnInit(): void {
    this.loadMatches();
  }

  loadMatches(): void {
    this.matchesService.getMatches().subscribe({
      next: (data) => {
        this.matches = data;
        this.generateCalendar();
      },
      error: (err) => console.error(err)
    });
  }

  generateCalendar(): void {
    const year = this.currentDisplayDate.getFullYear();
    const month = this.currentDisplayDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startingDayOfWeek === -1) startingDayOfWeek = 6;

    const days: CalendarDay[] = [];
    const today = new Date();

    for (let i = startingDayOfWeek; i > 0; i--) {
      const prevDate = new Date(year, month, 1 - i);
      days.push(this.createCalendarDay(prevDate, false, today));
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const currentDate = new Date(year, month, i);
      days.push(this.createCalendarDay(currentDate, true, today));
    }

    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        const nextDate = new Date(year, month + 1, i);
        days.push(this.createCalendarDay(nextDate, false, today));
      }
    }

    this.calendarDays = days;
  }

  createCalendarDay(date: Date, isCurrentMonth: boolean, today: Date): CalendarDay {
    const dayMatches = this.matches.filter(m => {
      const mDate = new Date(m.dateTime);
      return mDate.getDate() === date.getDate() &&
             mDate.getMonth() === date.getMonth() &&
             mDate.getFullYear() === date.getFullYear();
    });

    const isToday = date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear();

    return {
      date,
      isCurrentMonth,
      isToday,
      matches: dayMatches
    };
  }

  changeMonth(direction: number): void {
    this.currentDisplayDate = new Date(
      this.currentDisplayDate.getFullYear(),
      this.currentDisplayDate.getMonth() + direction,
      1
    );
    this.generateCalendar();
  }

  selectDay(day: CalendarDay): void {
    if (day.matches.length > 0) {
      this.selectedDay = day;
      this.quizAnswers = {};
    }
  }

  closeModal(): void {
    this.selectedDay = null;
    this.quizAnswers = {};
  }

  onAddMatch(): void {
    if (!this.newMatch.homeTeam || !this.newMatch.awayTeam || !this.newMatchDateTime) return;

    const matchToCreate: Omit<Match, 'id'> = {
      homeTeam: this.newMatch.homeTeam,
      awayTeam: this.newMatch.awayTeam,
      location: this.newMatch.location || 'Glavna Arena',
      dateTime: new Date(this.newMatchDateTime),
      status: 'UPCOMING'
    };

    this.matchesService.addMatch(matchToCreate).subscribe({
      next: () => {
        this.loadMatches();
        this.newMatch = { homeTeam: '', awayTeam: '', location: '', status: 'UPCOMING' };
        this.newMatchDateTime = '';
        this.showAddForm = false;
      }
    });
  }

  selectOption(questionId: string, optionId: string): void {
    this.quizAnswers[questionId] = optionId;
  }

  isOptionSelected(questionId: string, optionId: string, match: Match): boolean {
    if (this.quizAnswers[questionId]) {
      return this.quizAnswers[questionId] === optionId;
    }
    const question = match.quiz?.find(q => q.id === questionId);
    return question?.userAnswerId === optionId;
  }

  hasUserSelectedAnswers(): boolean {
    return Object.keys(this.quizAnswers).length > 0;
  }

  submitQuiz(matchId: string): void {
    this.matchesService.saveQuizAnswers(matchId, this.quizAnswers).subscribe({
      next: () => {
        this.loadMatches();
      }
    });
  }
}