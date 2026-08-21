import { Component, OnInit, AfterViewInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchMapService } from '../../services/match-map.service';
import { AuthService } from '../../services/auth.service';
import { WatchLocation } from '../../models/post.model';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mapService = inject(MatchMapService);
  public authService = inject(AuthService);

  matchId: string = '1';
  locations: WatchLocation[] = [];
  selectedLocation: WatchLocation | null = null;
  
  private map: any;
  private markersMap: Map<string, any> = new Map();

  showAddModal: boolean = false;
  newTitle: string = '';
  newAddress: string = '';
  newDescription: string = '';
  newLat: number = 44.8100;
  newLng: number = 20.4600;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['matchId']) {
        this.matchId = params['matchId'];
      }
      this.loadLocations();
    });

    this.mapService.locations$.subscribe(() => {
      this.loadLocations();
      this.refreshMarkers();
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadLeaflet();
    }
  }

  loadLocations(): void {
    this.locations = this.mapService.getLocationsForMatch(this.matchId);
  }

  private loadLeaflet(): void {
    if ((window as any).L) {
      this.initMap();
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => this.initMap();
    document.body.appendChild(script);
  }

  private initMap(): void {
    const L = (window as any).L;
    if (!L || this.map) return;

    this.map = L.map('match-map').setView([44.8100, 20.4600], 12);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap &copy; CARTO'
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      if (this.showAddModal) {
        this.newLat = Number(e.latlng.lat.toFixed(5));
        this.newLng = Number(e.latlng.lng.toFixed(5));
      }
    });

    this.refreshMarkers();
  }

  private refreshMarkers(): void {
    const L = (window as any).L;
    if (!L || !this.map) return;

    this.markersMap.forEach(marker => this.map.removeLayer(marker));
    this.markersMap.clear();

    this.locations.forEach(loc => {
      const marker = L.marker([loc.lat, loc.lng]).addTo(this.map);
      marker.bindPopup(`<b>${loc.title}</b><br>${loc.address}<br><small>Dolazi: ${loc.attendees.length}</small>`);
      marker.on('click', () => this.selectLocation(loc));
      this.markersMap.set(loc.id, marker);
    });

    if (this.locations.length > 0 && !this.selectedLocation) {
      this.selectLocation(this.locations[0]);
    }
  }

  selectLocation(loc: WatchLocation): void {
    this.selectedLocation = loc;
    if (this.map && (window as any).L) {
      this.map.flyTo([loc.lat, loc.lng], 14);
    }
  }

  toggleAttend(locationId: string): void {
    this.mapService.toggleAttendance(locationId);
  }

  isAttending(loc: WatchLocation): boolean {
    const user = this.authService.getCurrentUser();
    return user ? loc.attendees.includes(user.username) : false;
  }

  openAddModal(): void {
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  saveLocation(): void {
    if (!this.newTitle.trim() || !this.newAddress.trim()) return;

    const created = this.mapService.addLocation({
      matchId: this.matchId,
      title: this.newTitle.trim(),
      address: this.newAddress.trim(),
      description: this.newDescription.trim(),
      lat: this.newLat,
      lng: this.newLng
    });

    this.newTitle = '';
    this.newAddress = '';
    this.newDescription = '';
    this.showAddModal = false;

    this.selectLocation(created);
  }

  goBackToMatches(): void {
    this.router.navigate(['/matches']);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}