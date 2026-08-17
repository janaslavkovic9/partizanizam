import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService, Post, Comment } from '../../services/post.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    .posts-container {
      max-width: 680px;
      margin: 0 auto;
    }
    .post-card {
      background-color: #161920;
      border: 1px solid #2a2e39;
      border-radius: 14px;
      padding: 20px;
      margin-bottom: 20px;
    }
    .btn-action {
      background: transparent;
      border: 1px solid #2a2e39;
      color: #94a3b8;
      border-radius: 8px;
      padding: 6px 14px;
      font-size: 0.85rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
    }
    .btn-action.liked {
      color: #ff3e3e;
      border-color: #ff3e3e;
      background: rgba(255, 62, 62, 0.1);
    }
    .comment-box {
      background-color: #0f1115;
      border: 1px solid #2a2e39;
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 0.85rem;
      color: #e2e8f0;
    }
    .input-custom {
      background-color: #0f1115;
      border: 1px solid #2a2e39;
      color: #f8fafc;
      border-radius: 8px;
      padding: 8px 12px;
      width: 100%;
      font-size: 0.85rem;
    }
    .btn-submit {
      background-color: #00D2FF;
      color: #0b0c10;
      font-weight: 700;
      border: none;
      border-radius: 8px;
      padding: 8px 14px;
      font-size: 0.85rem;
    }
  `],
  template: `
    <div class="posts-container">
      <h4 class="fw-bold mb-4" style="color: #00D2FF;">Najnovije Objave</h4>

      <div *ngFor="let post of posts" class="post-card">
        <h5 class="fw-bold text-white mb-2">{{ post.title }}</h5>
        <p class="text-muted mb-3" style="font-size: 0.95rem;">{{ post.content }}</p>

        <div class="d-flex align-items-center gap-3 mb-3 border-top border-bottom border-secondary py-2">
          <button 
            class="btn-action" 
            [ngClass]="{ 'liked': post.isLiked }"
            (click)="onLike(post)"
          >
            <i class="bi" [ngClass]="post.isLiked ? 'bi-heart-fill' : 'bi-heart'"></i>
            {{ post.likesCount }} Lajkova
          </button>
        </div>

        <div class="d-flex flex-column gap-2 mb-3">
          <div *ngFor="let c of post.comments" class="comment-box">
            <span class="fw-bold" style="color: #00D2FF;">{{ c.author }}: </span>
            <span>{{ c.text }}</span>
          </div>
        </div>

        <div class="d-flex gap-2">
          <input 
            type="text" 
            class="input-custom" 
            placeholder="Napiši komentar..." 
            [(ngModel)]="newCommentText[post.id]"
            (keyup.enter)="onAddComment(post)"
          />
          <button class="btn-submit" (click)="onAddComment(post)">Pošalji</button>
        </div>
      </div>
    </div>
  `
})
export class PostsComponent implements OnInit {
  private postService = inject(PostService);
  private notifService = inject(NotificationService);

  posts: Post[] = [];
  newCommentText: { [postId: string]: string } = {};

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getPosts().subscribe({
      next: (data) => this.posts = data,
      error: (err) => console.error('Greška pri učitavanju objava:', err)
    });
  }

  onLike(post: Post): void {
    this.postService.likePost(post.id).subscribe({
      next: (res) => {
        post.likesCount = res.likesCount;
        post.isLiked = res.isLiked;
        if (res.isLiked) {
          this.notifService.notifyLike(post.title);
        }
      },
      error: (err) => console.error('Greška pri lajkovanju:', err)
    });
  }

  onAddComment(post: Post): void {
    const text = this.newCommentText[post.id];
    if (!text || !text.trim()) return;

    this.postService.addComment(post.id, text.trim()).subscribe({
      next: (createdComment) => {
        post.comments.push(createdComment);
        this.notifService.notifyComment(post.title, text.trim());
        this.newCommentText[post.id] = '';
      },
      error: (err) => console.error('Greška pri slanju komentara:', err)
    });
  }
}