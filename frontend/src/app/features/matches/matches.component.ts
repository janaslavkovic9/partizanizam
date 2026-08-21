import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import * as L from 'leaflet';

export interface Match {
  id?: string;
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

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.scss'
})
export class MatchesComponent implements OnInit {
  private http = inject(HttpClient);
  public authService = inject(AuthService);

  private apiUrl = 'http://localhost:3001/matches';

  matches: Match[] = [];

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

  private map!: L.Map;
  private marker!: L.Marker;

  errorMessage: string = '';

  ngOnInit(): void {
    this.loadMatches();
  }

  loadMatches(): void {
    this.http.get<Match[]>(this.apiUrl).subscribe({
      next: (data) => (this.matches = data),
      error: (err) => console.error('Greška pri učitavanju utakmica:', err),
    });
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

    this.http.post<Match>(this.apiUrl, payload).subscribe({
      next: (newMatch) => {
        this.matches.unshift(newMatch);
        this.resetForm();
      },
      error: (err) => {
        console.error('Greška pri zakazivanju utakmice:', err);
        this.errorMessage = 'Došlo je do greške pri zakazivanju.';
      },
    });
  }

  deleteMatch(id?: string): void {
    if (!id) return;

    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.matches = this.matches.filter((m) => m.id !== id);
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