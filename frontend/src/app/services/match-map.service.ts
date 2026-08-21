import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { WatchLocation } from '../models/post.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MatchMapService {
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  private STORAGE_KEY = 'partizanizam_watch_locations';

  private initialLocations: WatchLocation[] = [
    {
      id: 'loc-1',
      matchId: '1',
      title: 'Pivnica Partizan - Centar',
      address: 'Knez Mihailova 12, Beograd',
      lat: 44.8167,
      lng: 20.4583,
      description: 'Zajedničko gledanje uz pivo i organizovano navijanje!',
      attendees: ['GrobariBG', 'PFC_Fan'],
      createdBy: 'GrobariBG'
    },
    {
      id: 'loc-2',
      matchId: '1',
      title: 'Caffe Bar Hram',
      address: 'Bulevar Oslobođenja 45, Beograd',
      lat: 44.7950,
      lng: 20.4650,
      description: 'Miran kafić blizu stadiona, projekcija na velikom platnu.',
      attendees: ['MilošPFC'],
      createdBy: 'MilošPFC'
    }
  ];

  private locationsSubject = new BehaviorSubject<WatchLocation[]>(this.loadFromStorage());
  locations$ = this.locationsSubject.asObservable();

  private loadFromStorage(): WatchLocation[] {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Greška pri učitavanju lokacija iz localStorage', e);
        }
      }
    }
    return this.initialLocations;
  }

  private saveToStorage(locations: WatchLocation[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(locations));
    }
  }

  getLocationsForMatch(matchId: string): WatchLocation[] {
    return this.locationsSubject.value.filter(l => l.matchId === matchId);
  }

  addLocation(location: Omit<WatchLocation, 'id' | 'attendees' | 'createdBy'>): WatchLocation {
    const currentUser = this.authService.getCurrentUser();
    const username = currentUser ? currentUser.username : 'Gost';

    const newLoc: WatchLocation = {
      ...location,
      id: 'loc-' + Date.now(),
      attendees: [username],
      createdBy: username
    };

    const updated = [...this.locationsSubject.value, newLoc];
    this.locationsSubject.next(updated);
    this.saveToStorage(updated);
    return newLoc;
  }

  toggleAttendance(locationId: string): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    const username = currentUser.username;
    const updated = this.locationsSubject.value.map(loc => {
      if (loc.id === locationId) {
        const hasJoined = loc.attendees.includes(username);
        const attendees = hasJoined
          ? loc.attendees.filter(u => u !== username)
          : [...loc.attendees, username];

        return { ...loc, attendees };
      }
      return loc;
    });

    this.locationsSubject.next(updated);
    this.saveToStorage(updated);
  }
}