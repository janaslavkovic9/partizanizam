import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  isLoginMode = true;
  username = '';
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }

  onSubmit(): void {
    console.log('>>> Kliknuto je na dugme! Mod:', this.isLoginMode ? 'LOGIN' : 'REGISTER');
    
    if (!this.email || !this.password) {
      this.errorMessage = 'Molimo unesite email i lozinku.';
      return;
    }

    this.errorMessage = '';

    if (this.isLoginMode) {
      this.authService.login({ email: this.email, password: this.password }).subscribe({
        next: (res) => {
          console.log('Uspešna prijava:', res);
          this.router.navigate(['/profile']);
        },
        error: (err: any) => {
          console.error('Greška pri prijavi:', err);
          this.errorMessage = err.error?.message || 'Pogrešan email ili lozinka.';
        }
      });
    } else {
      this.authService.register({ username: this.username, email: this.email, password: this.password }).subscribe({
        next: (res) => {
          console.log('Uspešna registracija:', res);
          this.router.navigate(['/profile']);
        },
        error: (err: any) => {
          console.error('Greška pri registraciji:', err);
          this.errorMessage = err.error?.message || 'Greška pri registraciji.';
        }
      });
    }
  }
}