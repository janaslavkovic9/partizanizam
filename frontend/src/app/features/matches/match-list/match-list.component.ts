import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { Match } from '../../../models/match.model';
import { MatchQuizModalComponent } from '../match-quiz-modal/match-quiz-modal.component';
import { MatchesActions } from '../../../store/matches/matches.actions';
import { selectAllMatchesData } from '../../../store/matches/matches.selectors';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  matches: Match[];
}

@Component({
  selector: 'app-match-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatchQuizModalComponent],
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
    }
    .calendar-day:hover {
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
    }
    .btn-map-link {
      background-color: rgba(0, 210, 255, 0.15);
      color: #00D2FF;
      border: 1px solid #00D2FF;
      border-radius: 4px;
      font-size: 0.6rem;
      font-weight: 700;
      padding: 2px 4px;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2px;
      transition: all 0.2s ease;
    }
    .btn-map-link:hover {
      background-color: #00D2FF;
      color: #0b0c10;
    }
    .input-custom {
      background-color: #0f1115;
      border: 1px solid #2a2e39;
      color: #f8fafc;
      border-radius: 8px;
      padding: 10px 14px;
      width: 100%;
    }
    .btn-custom {
      background-color: #00D2FF;
      color: #0b0c10;
      font-weight: 700;
      border: none;
      border-radius: 8px;
      padding: 10px 18px;
    }
  `],
  template: `
    <div class="wrapper">
      <div class="container">

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

        <div class="card-custom shadow-lg">
          <div class="calendar-header">
            <button class="btn-nav" (click)="changeMonth(-1)"><i class="bi bi-chevron-left"></i></button>
            <h4 class="fw-bold mb-0 text-white">{{ currentDisplayDate | date:'LLLL yyyy.' }}</h4>
            <button class="btn-nav" (click)="changeMonth(1)"><i class="bi bi-chevron-right"></i></button>
          </div>

          <div class="calendar-grid mb-2">
            <div *ngFor="let dayName of weekDays" class="weekday-header">{{ dayName }}</div>
          </div>

          <div class="calendar-grid">
            <div 
              *ngFor="let day of calendarDays" 
              class="calendar-day"
              [ngClass]="{ 'has-match': day.matches.length > 0 }"
              (click)="selectDay(day)"
            >
              <div class="day-number">{{ day.date.getDate() }}</div>
              
              <div *ngIf="day.matches.length > 0" class="d-flex flex-column gap-1">
                <div *ngFor="let m of day.matches" class="d-flex flex-column gap-1">
                  <div class="match-badge">
                    🏀 {{ m.homeTeam }}
                  </div>
                  <a 
                    [routerLink]="['/map']" 
                    [queryParams]="{ matchId: m.id }" 
                    class="btn-map-link"
                    (click)="$event.stopPropagation()"
                  >
                    <i class="bi bi-geo-alt-fill"></i> Gde gledati?
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <app-match-quiz-modal
      *ngIf="selectedDay && selectedDay.matches.length > 0"
      [matches]="selectedDay.matches"
      (close)="selectedDay = null"
      (saveAnswers)="onSaveQuizAnswers($event)"
    ></app-match-quiz-modal>
  `
})
export class MatchListComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private destroy$ = new Subject<void>();

  matches: Match[] = [];
  calendarDays: CalendarDay[] = [];
  currentDisplayDate = new Date();
  selectedDay: CalendarDay | null = null;
  showAddForm = false;

  newMatchDateTime = '';
  newMatch: Partial<Match> = { homeTeam: '', awayTeam: '', location: '', status: 'UPCOMING' };
  weekDays = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'];

  ngOnInit(): void {
    this.store.dispatch(MatchesActions.loadMatches());

    this.store.select(selectAllMatchesData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.matches = data;
        this.generateCalendar();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  generateCalendar(): void {
    const year = this.currentDisplayDate.getFullYear();
    const month = this.currentDisplayDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let startingDay = firstDay.getDay() - 1;
    if (startingDay === -1) startingDay = 6;

    const days: CalendarDay[] = [];
    const today = new Date();

    for (let i = startingDay; i > 0; i--) {
      days.push(this.createCalendarDay(new Date(year, month, 1 - i), false, today));
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(this.createCalendarDay(new Date(year, month, i), true, today));
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

    return {
      date,
      isCurrentMonth,
      isToday: date.toDateString() === today.toDateString(),
      matches: dayMatches
    };
  }

  changeMonth(direction: number): void {
    this.currentDisplayDate = new Date(this.currentDisplayDate.getFullYear(), this.currentDisplayDate.getMonth() + direction, 1);
    this.generateCalendar();
  }

  selectDay(day: CalendarDay): void {
    if (day.matches.length > 0) {
      this.selectedDay = day;
    }
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

    this.store.dispatch(MatchesActions.addMatch({ match: matchToCreate }));
    this.showAddForm = false;
  }

  onSaveQuizAnswers(event: { matchId: string; answers: { [key: string]: string } }): void {
    this.store.dispatch(MatchesActions.saveQuizAnswers({ matchId: event.matchId, answers: event.answers }));
    this.selectedDay = null;
  }
}