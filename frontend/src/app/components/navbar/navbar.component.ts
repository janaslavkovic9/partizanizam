import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { AppNotification } from '../../models/notification.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    .notif-wrapper {
      position: relative;
    }
    .btn-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #161920;
      border: 1px solid #2a2e39;
      color: #00D2FF;
      display: flex;
      align-items: center;
      justify-content: justify;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      transition: all 0.2s ease;
    }
    .btn-icon:hover {
      border-color: #00D2FF;
      background-color: rgba(0, 210, 255, 0.15);
      box-shadow: 0 0 12px rgba(0, 210, 255, 0.25);
    }
    .badge-count {
      position: absolute;
      top: -2px;
      right: -2px;
      background-color: #ff3e3e;
      color: white;
      font-size: 0.65rem;
      font-weight: 800;
      border-radius: 50%;
      padding: 2px 5px;
      line-height: 1;
    }
    .dropdown-menu-custom {
      position: absolute;
      right: 0;
      top: 50px;
      width: 320px;
      background-color: #161920;
      border: 1px solid #2a2e39;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.7);
      padding: 12px;
      max-height: 380px;
      overflow-y: auto;
      z-index: 2000;
    }
    .notif-item {
      background-color: #0f1115;
      border: 1px solid #2a2e39;
      border-radius: 8px;
      padding: 10px;
      margin-bottom: 8px;
    }
    .notif-item.unread {
      border-left: 3px solid #00D2FF;
    }
  `],
  template: `
    <div class="notif-wrapper">
      <button class="btn-icon" (click)="toggleDropdown()" title="Obaveštenja">
        <i class="bi bi-bell-fill fs-5"></i>
        <span *ngIf="unreadCount > 0" class="badge-count">{{ unreadCount }}</span>
      </button>

      <div *ngIf="showDropdown" class="dropdown-menu-custom">
        <div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom border-secondary">
          <span class="fw-bold text-white" style="font-size: 0.9rem;">Obaveštenja</span>
          <button class="btn btn-sm btn-link text-info p-0" style="font-size: 0.75rem; text-decoration: none;" (click)="markRead()">Označi sve pročitano</button>
        </div>

        <div *ngIf="notifications.length === 0" class="text-muted text-center py-3" style="font-size: 0.85rem;">
          Nemate novih obaveštenja.
        </div>

        <div *ngFor="let n of notifications" class="notif-item" [ngClass]="{ 'unread': !n.read }">
          <div class="fw-bold text-white" style="font-size: 0.85rem;">{{ n.title }}</div>
          <div class="text-muted" style="font-size: 0.8rem;">{{ n.message }}</div>
          <div class="text-end text-secondary mt-1" style="font-size: 0.65rem;">
            {{ n.timestamp | date:'HH:mm' }}
          </div>
        </div>
      </div>
    </div>
  `
})
export class NavbarComponent {
  private notifService = inject(NotificationService);

  notifications: AppNotification[] = [];
  unreadCount = 0;
  showDropdown = false;

  constructor() {
    this.notifService.notifications.subscribe(data => {
      this.notifications = data;
      this.unreadCount = this.notifService.getUnreadCount();
    });
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
    if (this.showDropdown) {
      this.markRead();
    }
  }

  markRead(): void {
    this.notifService.markAllAsRead();
    this.unreadCount = 0;
  }
}