import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Post } from '../../../models/post.model';
import * as PostsActions from '../../../store/posts/posts.actions';

@Component({
  selector: 'app-post-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    :host {
      display: block;
      width: 100%;
      margin-bottom: 20px;
    }
    .post-card {
      background-color: #161920;
      border: 1px solid #2a2e39;
      border-radius: 14px;
      padding: 20px;
      width: 100%;
      box-sizing: border-box;
    }
    .avatar {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #00D2FF 0%, #0066FF 100%);
      color: #0f1115;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.1rem;
    }
    .username {
      color: #f8fafc;
      font-weight: 700;
      font-size: 1rem;
    }
    .post-time {
      color: #64748b;
      font-size: 0.78rem;
    }
    .post-text {
      color: #cbd5e1;
      font-size: 0.98rem;
      line-height: 1.6;
      white-space: pre-line;
    }
    .action-btn {
      background: #0f1115;
      color: #00D2FF;
      border: 1px solid #2a2e39;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .action-btn:hover {
      background: rgba(0, 210, 255, 0.1);
      border-color: #00D2FF;
      color: #ffffff;
    }
    .action-btn.liked {
      background: #00D2FF;
      color: #0f1115;
      border-color: #00D2FF;
      font-weight: 700;
    }
    .comments-section {
      background-color: #0f1115;
      border-radius: 10px;
      padding: 14px;
      border: 1px solid #2a2e39;
    }
    .comment-bubble {
      background-color: #161920;
      border: 1px solid #2a2e39;
      border-radius: 8px;
      padding: 10px 12px;
    }
    .comment-input {
      background-color: #161920 !important;
      color: #ffffff !important;
      border: 1px solid #2a2e39 !important;
      border-radius: 20px;
      font-size: 0.88rem;
    }
    .comment-input:focus {
      border-color: #00D2FF !important;
      box-shadow: none;
      outline: none;
    }
    .send-btn {
      background: linear-gradient(135deg, #00D2FF 0%, #0080FF 100%);
      color: #0f1115;
      border: none;
      font-weight: 700;
    }
    .send-btn:disabled {
      opacity: 0.4;
    }
  `],
  template: `
    <div class="post-card shadow-lg" *ngIf="post">
      <!-- Zaglavlje objave -->
      <div class="d-flex align-items-center mb-3">
        <div class="avatar me-3 flex-shrink-0">
          {{ getAvatarLetter() }}
        </div>
        <div>
          <div class="username">
            {{ post.user?.username || 'Korisnik' }}
          </div>
          <div class="post-time">
            {{ post.createdAt | date:'dd.MM.yyyy. HH:mm' }}
          </div>
        </div>
      </div>

      <!-- Tekst objave -->
      <p class="post-text mb-3">
        {{ post.content }}
      </p>

      <!-- Akcije (Lajk & Komentari) -->
      <div class="d-flex gap-2 pt-3" style="border-top: 1px solid #2a2e39;">
        <button 
          class="btn action-btn btn-sm rounded-pill px-3 py-1 fw-semibold"
          [class.liked]="isLikedLocally"
          (click)="onLike()"
        >
          🩵 {{ getLikesCount() }} Sviđa mi se
        </button>
        
        <button 
          class="btn action-btn btn-sm rounded-pill px-3 py-1 fw-semibold"
          (click)="toggleComments()"
        >
          💬 {{ (post.comments || []).length }} Komentari
        </button>
      </div>

      <!-- Sekcija komentara -->
      <div *ngIf="showComments" class="comments-section mt-3">
        <div *ngIf="!post.comments || post.comments.length === 0" class="text-muted text-center py-2 style-subtext">
          Nema komentara. Budi prvi!
        </div>

        <div *ngFor="let comment of post.comments" class="comment-bubble mb-2">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="fw-bold text-light" style="font-size: 0.85rem;">
              {{ comment.username || comment.user?.username || 'Korisnik' }}
            </span>
            <span class="text-muted" style="font-size: 0.72rem;">
              {{ comment.createdAt | date:'HH:mm' }}
            </span>
          </div>
          <div style="color: #cbd5e1; font-size: 0.88rem;">
            {{ comment.content }}
          </div>
        </div>

        <!-- Unos komentara -->
        <div class="d-flex gap-2 mt-3 pt-2" style="border-top: 1px solid #2a2e39;">
          <input 
            type="text" 
            [(ngModel)]="newCommentText"
            (keyup.enter)="onAddComment()"
            class="form-control comment-input px-3" 
            placeholder="Napiši komentar..."
          >
          <button 
            class="btn send-btn btn-sm rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center" 
            style="width: 36px; height: 36px;"
            [disabled]="!newCommentText.trim()"
            (click)="onAddComment()"
          >
            ➔
          </button>
        </div>
      </div>
    </div>
  `
})
export class PostItemComponent {
  @Input({ required: true }) post!: Post;
  private store = inject(Store);

  showComments = false;
  newCommentText = '';
  isLikedLocally = false;
  localLikesOffset = 0;

  getAvatarLetter(): string {
    const name = this.post?.user?.username || 'Korisnik';
    return name.charAt(0).toUpperCase();
  }

  getLikesCount(): number {
    const baseLikes = this.post?.likes?.length || 0;
    return baseLikes + this.localLikesOffset;
  }

  onLike(): void {
    this.isLikedLocally = !this.isLikedLocally;
    this.localLikesOffset += this.isLikedLocally ? 1 : -1;

    this.store.dispatch(PostsActions.toggleLike({ postId: this.post.id }));
  }

  toggleComments(): void {
    this.showComments = !this.showComments;
  }

  onAddComment(): void {
    if (!this.newCommentText.trim()) return;

    const commentText = this.newCommentText.trim();

    if (!this.post.comments) {
      this.post.comments = [];
    }
    this.post.comments.push({
      id: Date.now().toString(),
      content: commentText,
      username: 'Ti',
      createdAt: new Date()
    });

    this.store.dispatch(
      PostsActions.addComment({
        postId: this.post.id,
        content: commentText
      })
    );

    this.newCommentText = '';
  }
}