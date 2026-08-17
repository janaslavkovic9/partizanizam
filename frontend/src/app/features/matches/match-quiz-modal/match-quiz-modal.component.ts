import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Match } from '../../../models/match.model';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-match-quiz-modal',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background-color: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      z-index: 2000; padding: 16px; box-sizing: border-box;
    }
    .modal-card {
      background-color: #161920; border: 1px solid #2a2e39;
      border-radius: 16px; width: 100%; max-width: 520px;
      max-height: 90vh; overflow-y: auto; padding: 24px;
      box-shadow: 0 20px 30px rgba(0, 0, 0, 0.6); position: relative;
    }
    .btn-close-modal {
      position: absolute; top: 16px; right: 16px;
      background: transparent; border: none; color: #94a3b8;
      font-size: 1.2rem; cursor: pointer;
    }
    .btn-sub {
      background: #0f1115; border: 1px solid #2a2e39;
      color: #94a3b8; border-radius: 8px; padding: 6px 12px;
      font-size: 0.8rem; cursor: pointer; transition: all 0.2s ease;
    }
    .btn-sub.active {
      border-color: #00D2FF; color: #00D2FF; background: rgba(0, 210, 255, 0.1);
    }
    .score-box {
      background-color: #0f1115; border: 1px solid #2a2e39;
      padding: 8px 16px; border-radius: 8px; font-size: 1.3rem;
      font-weight: 800; color: #00D2FF;
    }
    .quiz-container {
      background-color: #0f1115; border: 1px solid #2a2e39;
      border-radius: 12px; padding: 16px; margin-top: 16px;
    }
    .quiz-question { font-size: 0.9rem; font-weight: 600; color: #e2e8f0; margin-bottom: 8px; }
    .quiz-option {
      background-color: #161920; border: 1px solid #2a2e39;
      border-radius: 8px; padding: 8px 12px; font-size: 0.85rem;
      cursor: pointer; display: flex; align-items: center; gap: 8px;
    }
    .quiz-option.selected {
      background-color: rgba(0, 210, 255, 0.15); border-color: #00D2FF; color: #00D2FF; font-weight: 700;
    }
    .btn-custom {
      background-color: #00D2FF; color: #0b0c10; font-weight: 700;
      border: none; border-radius: 8px; padding: 10px 18px;
    }
  `],
  template: `
    <div class="modal-backdrop" (click)="close.emit()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <button class="btn-close-modal" (click)="close.emit()">
          <i class="bi bi-x-lg"></i>
        </button>

        <h5 class="fw-bold mb-3" style="color: #00D2FF;">Detalji Utakmice</h5>

        <div *ngFor="let match of matches" class="d-flex flex-column gap-3 mb-4">
          <div class="d-flex justify-content-between align-items-center">
            <span class="text-muted" style="font-size: 0.85rem;">📍 {{ match.location }}</span>
            
            <!-- DUGME ZA UKLJUČIVANJE OBAVEŠTENJA -->
            <button 
              class="btn-sub" 
              [ngClass]="{ 'active': isSubscribed(match.id) }"
              (click)="toggleNotification(match)"
            >
              <i class="bi" [ngClass]="isSubscribed(match.id) ? 'bi-bell-fill' : 'bi-bell'"></i>
              {{ isSubscribed(match.id) ? 'Obaveštenja uključen' : 'Prati utakmicu' }}
            </button>
          </div>

          <div class="d-flex justify-content-between align-items-center my-2 text-center">
            <div class="fw-bold text-white text-start" style="flex: 1; font-size: 1.1rem;">
              {{ match.homeTeam }}
            </div>
            <div class="px-3">
              <div *ngIf="match.score" class="score-box">{{ match.score.home }} : {{ match.score.away }}</div>
              <div *ngIf="!match.score" class="fw-bold text-muted" style="font-size: 1.1rem;">VS</div>
            </div>
            <div class="fw-bold text-white text-end" style="flex: 1; font-size: 1.1rem;">
              {{ match.awayTeam }}
            </div>
          </div>

          <div *ngIf="match.quiz && match.quiz.length > 0" class="quiz-container">
            <h6 class="fw-bold mb-3 text-white">🎯 Navijački Kviz Predviđanja</h6>
            <div *ngFor="let q of match.quiz" class="mb-3">
              <div class="quiz-question">{{ q.questionText }}</div>
              <div class="d-flex flex-column gap-2">
                <div 
                  *ngFor="let opt of q.options" 
                  class="quiz-option" 
                  [ngClass]="{ 'selected': isOptionSelected(q.id, opt.id, match) }"
                  (click)="match.status === 'UPCOMING' && onSelect(q.id, opt.id)"
                >
                  <i class="bi" [ngClass]="isOptionSelected(q.id, opt.id, match) ? 'bi-check-circle-fill' : 'bi-circle'"></i>
                  {{ opt.text }}
                </div>
              </div>
            </div>

            <div *ngIf="match.status === 'UPCOMING'" class="d-flex justify-content-end mt-3">
              <button class="btn-custom" [disabled]="!hasSelectedAnswers()" (click)="onSubmit(match.id)">
                Sačuvaj Odgovore
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MatchQuizModalComponent {
  private notifService = inject(NotificationService);

  @Input({ required: true }) matches: Match[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() saveAnswers = new EventEmitter<{ matchId: string; answers: { [key: string]: string } }>();

  localAnswers: { [questionId: string]: string } = {};

  toggleNotification(match: Match): void {
    const title = `${match.homeTeam} vs ${match.awayTeam}`;
    this.notifService.toggleMatchSubscription(match.id, title);
  }

  isSubscribed(matchId: string): boolean {
    return this.notifService.isSubscribed(matchId);
  }

  onSelect(questionId: string, optionId: string): void {
    this.localAnswers[questionId] = optionId;
  }

  isOptionSelected(questionId: string, optionId: string, match: Match): boolean {
    if (this.localAnswers[questionId]) {
      return this.localAnswers[questionId] === optionId;
    }
    const question = match.quiz?.find(q => q.id === questionId);
    return question?.userAnswerId === optionId;
  }

  hasSelectedAnswers(): boolean {
    return Object.keys(this.localAnswers).length > 0;
  }

  onSubmit(matchId: string): void {
    this.saveAnswers.emit({ matchId, answers: this.localAnswers });
  }
}