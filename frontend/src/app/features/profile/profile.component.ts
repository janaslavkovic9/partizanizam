import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/post.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  public authService = inject(AuthService);
  private router = inject(Router);

  currentUser: User | null = null;
  isEditing: boolean = false;
  isLoginTab: boolean = true;

  username: string = '';
  bio: string = '';
  avatarUrl: string = '';

  loginEmail: string = '';
  loginPassword: string = '';
  regUsername: string = '';
  regEmail: string = '';
  regPassword: string = '';

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      if (user) {
        this.username = user.username || '';
        this.bio = user.bio || '';
        this.avatarUrl = user.avatarUrl || '';
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing && this.currentUser) {
      this.username = this.currentUser.username || '';
      this.bio = this.currentUser.bio || '';
      this.avatarUrl = this.currentUser.avatarUrl || '';
    }
  }

  saveProfile(): void {
    if (this.currentUser) {
      this.currentUser.username = this.username;
      this.currentUser.bio = this.bio;
      this.currentUser.avatarUrl = this.avatarUrl;
    }
    this.isEditing = false;
  }

  logout(): void {
    this.authService.logout();
    this.currentUser = null;
  }

  onLogin(): void {
    if (!this.loginEmail || !this.loginPassword) return;
    this.authService.login({ email: this.loginEmail.trim(), password: this.loginPassword }).subscribe({
      next: () => this.router.navigate(['/posts']),
      error: (err) => console.error('Greška pri prijavi:', err)
    });
  }

  onRegister(): void {
    if (!this.regUsername || !this.regEmail || !this.regPassword) return;
    this.authService.register({ 
      username: this.regUsername.trim(), 
      email: this.regEmail.trim(), 
      password: this.regPassword 
    }).subscribe({
      next: () => this.router.navigate(['/posts']),
      error: (err) => console.error('Greška pri registraciji:', err)
    });
  }
}