import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { zip, merge, interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as L from 'leaflet';

export interface Match {
  id?: string;
  _id?: string;
  opponent: string;
  date: string;
  time: string;
  location: string;
  competition: string;
  isHome: boolean;
  cafeName?: string;
  lat?: number;
  lng?: number;
  status?: string;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  matches: Match[];
}

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.scss'
})
export class MatchesComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  public authService = inject(AuthService);

  private apiUrl = 'http://localhost:3001/matches';

  matches: Match[] = [];
  calendarDays: CalendarDay[] = [];
  currentDisplayDate = new Date();
  selectedDay: CalendarDay | null = null;
  weekDays = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'];

  opponent: string = '';
  date: string = '';
  time: string = '';
  location: string = 'Beogradska Arena';
  competition: string = 'Evroliga';
  isHome: boolean = true;
  cafeName: string = '';

  selectedLat: number | null = null;
  selectedLng: number | null = null;
  showMapModal: boolean = false;
  showAddForm: boolean = false;

  private map!: L.Map;
  private marker!: L.Marker;

  errorMessage: string = '';

  private manualRefresh$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadInitialDataZip();

    merge(interval(60000), this.manualRefresh$)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadMatches();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  triggerRefresh(): void {
    this.manualRefresh$.next();
  }

  loadInitialDataZip(): void {
    const matches$ = this.http.get<any>(this.apiUrl);
    const user$ = this.http.get<any>('http://localhost:3001/auth/me', { headers: this.getAuthHeaders() });

    zip(matches$, user$)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([data, user]) => {
          this.matches = Array.isArray(data) ? data : (data?.data || []);
          this.generateCalendar();
        },
        error: (err) => {
          this.loadMatches();
        }
      });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  loadMatches(): void {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (data) => {
        this.matches = Array.isArray(data) ? data : (data?.data || []);
        this.generateCalendar();
      },
      error: (err) => {
        console.error('Greška pri učitavanju utakmica:', err);
        this.errorMessage = 'Neuspešno učitavanje utakmica sa servera.';
      },
    });
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
      if (!m.date) return false;

      const dateStr = typeof m.date === 'string' ? m.date.split('T')[0] : '';
      const parts = dateStr.split('-');
      
      if (parts.length === 3) {
        const mYear = parseInt(parts[0], 10);
        const mMonth = parseInt(parts[1], 10) - 1;
        const mDay = parseInt(parts[2], 10);

        return mDay === date.getDate() &&
               mMonth === date.getMonth() &&
               mYear === date.getFullYear();
      }

      const mDate = new Date(m.date);
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

  openMapModal(): void {
    this.showMapModal = true;
    setTimeout(() => this.initMap(), 100);
  }

  closeMapModal(): void {
    this.showMapModal = false;
  }

  private initMap(): void {
    const defaultLat = 44.8176;
    const defaultLng = 20.4569;

    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('picker-map').setView([defaultLat, defaultLng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      this.selectedLat = lat;
      this.selectedLng = lng;

      if (this.marker) {
        this.marker.setLatLng([lat, lng]);
      } else {
        this.marker = L.marker([lat, lng]).addTo(this.map);
      }
    });
  }

  confirmLocation(): void {
    this.closeMapModal();
  }

  scheduleMatch(): void {
    if (!this.opponent.trim() || !this.date || !this.time) {
      this.errorMessage = 'Molimo vas popunite protivnika, datum i vreme.';
      return;
    }

    this.errorMessage = '';

    const payload: Match = {
      opponent: this.opponent.trim(),
      date: this.date,
      time: this.time,
      location: this.location.trim() || 'Beogradska Arena',
      competition: this.competition.trim() || 'Evroliga',
      isHome: this.isHome,
      cafeName: this.cafeName.trim() || undefined,
      lat: this.selectedLat || undefined,
      lng: this.selectedLng || undefined,
    };

    this.http.post<Match>(this.apiUrl, payload, { headers: this.getAuthHeaders() }).subscribe({
      next: (newMatch) => {
        this.matches.unshift(newMatch);
        this.generateCalendar();
        this.resetForm();
        this.showAddForm = false;
      },
      error: (err) => {
        console.error('Greška pri zakazivanju utakmice:', err);
        this.errorMessage = err.error?.message || 'Došlo je do greške pri zakazivanju.';
      },
    });
  }

  deleteMatch(id?: string): void {
    const targetId = id;
    if (!targetId) return;

    this.http.delete(`${this.apiUrl}/${targetId}`, { headers: this.getAuthHeaders() }).subscribe({
      next: () => {
        this.matches = this.matches.filter((m) => m.id !== targetId && m._id !== targetId);
        this.generateCalendar();
        if (this.selectedDay) {
          this.selectedDay.matches = this.selectedDay.matches.filter(m => m.id !== targetId && m._id !== targetId);
        }
      },
      error: (err) => console.error('Greška pri brisanju utakmice:', err),
    });
  }

  private resetForm(): void {
    this.opponent = '';
    this.date = '';
    this.time = '';
    this.location = 'Beogradska Arena';
    this.competition = 'Evroliga';
    this.isHome = true;
    this.cafeName = '';
    this.selectedLat = null;
    this.selectedLng = null;
  }
}