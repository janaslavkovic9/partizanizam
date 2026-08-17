import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NavbarComponent],
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
      background-color: #0b0c10;
      box-sizing: border-box;
    }
    
    .navbar-container {
      width: 100%;
      height: 65px;
      background-color: #0f1115;
      border-bottom: 1px solid #2a2e39;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-sizing: border-box;
    }

    .navbar-content {
      max-width: 1200px;
      height: 100%;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
    }

    .brand-title {
      color: #00D2FF;
      font-weight: 800;
      font-size: 1.4rem;
      letter-spacing: 1.5px;
      text-decoration: none;
      display: flex;
      align-items: center;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .nav-link-custom {
      color: #94a3b8;
      font-weight: 600;
      text-decoration: none;
      padding: 8px 18px;
      border-radius: 8px;
      transition: all 0.2s ease;
      font-size: 0.95rem;
      border: 1px solid transparent;
    }

    .nav-link-custom:hover {
      color: #00D2FF;
      background-color: rgba(0, 210, 255, 0.05);
    }

    .nav-link-custom.active {
      color: #00D2FF;
      background-color: rgba(0, 210, 255, 0.12);
      border-color: rgba(0, 210, 255, 0.25);
    }

    .right-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .profile-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #161920;
      border: 1px solid #2a2e39;
      color: #00D2FF;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .profile-btn:hover, .profile-btn.active {
      border-color: #00D2FF;
      background-color: rgba(0, 210, 255, 0.15);
      box-shadow: 0 0 12px rgba(0, 210, 255, 0.25);
    }

    main {
      width: 100%;
      box-sizing: border-box;
    }
  `],
  template: `
    <header class="navbar-container">
      <div class="navbar-content">
        <a routerLink="/posts" class="brand-title">PARTIZANIZAM</a>

        <nav class="nav-links">
          <a routerLink="/posts" routerLinkActive="active" class="nav-link-custom">Objave</a>
          <a routerLink="/matches" routerLinkActive="active" class="nav-link-custom">Utakmice</a>
        </nav>

        <div class="right-actions">
          <app-navbar></app-navbar>

          <a routerLink="/profile" routerLinkActive="active" class="profile-btn" title="Moj Profil">
            <i class="bi bi-person-fill fs-5"></i>
          </a>
        </div>
      </div>
    </header>

    <main>
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {}