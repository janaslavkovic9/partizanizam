import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
      background-color: #0b0c10;
      color: #e2e8f0;
      padding: 30px 16px;
      box-sizing: border-box;
    }
    .profile-container {
      max-width: 680px;
      margin: 0 auto;
    }
    .profile-card {
      background-color: #161920;
      border: 1px solid #2a2e39;
      border-radius: 14px;
      padding: 24px;
      text-align: center;
      margin-bottom: 20px;
    }
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background-color: #0f1115;
      border: 2px solid #00D2FF;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px auto;
      color: #00D2FF;
      font-size: 2.5rem;
    }
    .stat-card {
      background-color: #0f1115;
      border: 1px solid #2a2e39;
      border-radius: 10px;
      padding: 12px;
      text-align: center;
    }
  `],
  template: `
    <div class="profile-container">
      <div class="profile-card">
        <div class="avatar">
          <i class="bi bi-person-fill"></i>
        </div>
        <h4 class="fw-bold text-white mb-1">Korisničko Ime</h4>
        <p class="text-muted mb-3" style="font-size: 0.9rem;">navijac&#64;partizanizam.rs</p>

        <div class="row g-2 mt-2">
          <div class="col-4">
            <div class="stat-card">
              <div class="fw-bold text-white fs-5">12</div>
              <div class="text-muted" style="font-size: 0.75rem;">Objava</div>
            </div>
          </div>
          <div class="col-4">
            <div class="stat-card">
              <div class="fw-bold text-white fs-5">48</div>
              <div class="text-muted" style="font-size: 0.75rem;">Lajkova</div>
            </div>
          </div>
          <div class="col-4">
            <div class="stat-card">
              <div class="fw-bold text-white fs-5">5</div>
              <div class="text-muted" style="font-size: 0.75rem;">Utakmica</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent {}