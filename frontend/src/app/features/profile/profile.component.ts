import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface UserProfile {
  username: string;
  email: string;
  bio: string;
  avatarUrl: string;
}

@Component({
  selector: 'app-profile',
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
      max-width: 620px;
    }
    .card-custom {
      background-color: #161920;
      border: 1px solid #2a2e39;
      border-radius: 14px;
      padding: 24px;
      margin-bottom: 20px;
      position: relative;
    }
    .avatar-wrapper {
      position: relative;
      width: 110px;
      height: 110px;
      margin: 0 auto 16px auto;
    }
    .avatar-img {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #00D2FF;
      background-color: #0f1115;
    }
    .avatar-placeholder {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      background-color: #0f1115;
      border: 3px solid #00D2FF;
      color: #00D2FF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3.2rem;
    }
    .upload-btn {
      position: absolute;
      bottom: 0;
      right: 0;
      background-color: #00D2FF;
      color: #0b0c10;
      border-radius: 50%;
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: 2px solid #161920;
      transition: transform 0.2s ease;
    }
    .upload-btn:hover {
      transform: scale(1.1);
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
      padding: 8px 18px;
      transition: background-color 0.2s ease;
    }
    .btn-custom:hover {
      background-color: #33dcfd;
    }
    .btn-outline-custom {
      background: transparent;
      color: #94a3b8;
      border: 1px solid #2a2e39;
      border-radius: 8px;
      padding: 8px 18px;
      font-weight: 600;
      transition: all 0.2s ease;
    }
    .btn-outline-custom:hover {
      color: #f8fafc;
      border-color: #64748b;
    }
    .btn-logout {
      background-color: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 8px;
      padding: 10px 20px;
      font-weight: 700;
      width: 100%;
      transition: all 0.2s ease;
    }
    .btn-logout:hover {
      background-color: rgba(239, 68, 68, 0.25);
    }
    .stat-box {
      background-color: #0f1115;
      border: 1px solid #2a2e39;
      border-radius: 10px;
      padding: 12px;
      text-align: center;
      flex: 1;
    }
  `],
  template: `
    <div class="wrapper">
      <div class="container">
        
        <!-- Glavna kartica profila -->
        <div class="card-custom shadow-lg text-center">
          
          <!-- Avatar sa opcijom za izmenu -->
          <div class="avatar-wrapper">
            <img *ngIf="user.avatarUrl" [src]="user.avatarUrl" alt="Profilna" class="avatar-img" />
            <div *ngIf="!user.avatarUrl" class="avatar-placeholder">
              <i class="bi bi-person-fill"></i>
            </div>
            
            <label class="upload-btn" title="Promeni sliku">
              <i class="bi bi-camera-fill"></i>
              <input type="file" accept="image/*" (change)="onFileSelected($event)" style="display: none;" />
            </label>
          </div>

          <h4 class="fw-bold text-white mb-1">{{ user.username }}</h4>
          <p class="text-muted mb-3" style="font-size: 0.9rem;">{{ user.email }}</p>

          <!-- Biografija (Prikaz ili Edit) -->
          <div *ngIf="!isEditing" class="my-3">
            <p class="text-slate-300" style="color: #cbd5e1; font-style: italic; font-size: 0.95rem;">
              "{{ user.bio || 'Nema dodate biografije...' }}"
            </p>
            <button class="btn-outline-custom mt-2" (click)="toggleEdit()">
              <i class="bi bi-pencil-square me-1"></i> Izmeni Profil
            </button>
          </div>

          <!-- Forma za izmenu biografije i imena -->
          <div *ngIf="isEditing" class="d-flex flex-column gap-3 text-start mt-3 p-3" style="background-color: #0f1115; border-radius: 10px;">
            <div>
              <label class="text-muted mb-1" style="font-size: 0.85rem;">Korisničko Ime</label>
              <input type="text" class="input-custom" [(ngModel)]="editData.username" />
            </div>

            <div>
              <label class="text-muted mb-1" style="font-size: 0.85rem;">Biografija</label>
              <textarea class="input-custom" rows="3" [(ngModel)]="editData.bio" placeholder="Napiši nešto o sebi..."></textarea>
            </div>

            <div>
              <label class="text-muted mb-1" style="font-size: 0.85rem;">URL Profilne Slike (Opciono)</label>
              <input type="text" class="input-custom" [(ngModel)]="editData.avatarUrl" placeholder="https://..." />
            </div>

            <div class="d-flex justify-content-end gap-2 mt-2">
              <button class="btn-outline-custom" (click)="toggleEdit()">Otkaži</button>
              <button class="btn-custom" (click)="saveProfile()">Sačuvaj</button>
            </div>
          </div>
        </div>

        <!-- Statističke kartice -->
        <div class="d-flex gap-3 mb-4">
          <div class="stat-box">
            <div class="fw-bold fs-4" style="color: #00D2FF;">12</div>
            <small class="text-muted">Objavljenih Postova</small>
          </div>
          <div class="stat-box">
            <div class="fw-bold fs-4" style="color: #00D2FF;">5</div>
            <small class="text-muted">Praćenih Utakmica</small>
          </div>
        </div>

        <!-- Dugme za Odjavu -->
        <div class="card-custom shadow-lg text-center p-3">
          <button class="btn-logout d-flex align-items-center justify-content-center gap-2" (click)="onLogout()">
            <i class="bi bi-box-arrow-right fs-5"></i>
            Odjavi se
          </button>
        </div>

      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  user: UserProfile = {
    username: 'Korisnik',
    email: 'korisnik@onyx.app',
    bio: 'Strastveni ljubitelj košarke i član Onyx zajednice!',
    avatarUrl: ''
  };

  editData: UserProfile = { ...this.user };
  isEditing = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const savedUser = localStorage.getItem('onyx_user_profile');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }
    this.editData = { ...this.user };
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.editData = { ...this.user };
    }
  }

  saveProfile(): void {
    this.user = { ...this.editData };
    localStorage.setItem('onyx_user_profile', JSON.stringify(this.user));
    this.isEditing = false;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.avatarUrl = e.target.result;
        this.editData.avatarUrl = e.target.result;
        localStorage.setItem('onyx_user_profile', JSON.stringify(this.user));
      };
      reader.readAsDataURL(file);
    }
  }

  onLogout(): void {
    localStorage.removeItem('onyx_user_profile');
    this.router.navigate(['/posts']);
  }
}