import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Post } from '../../../models/post.model';
import * as PostsActions from '../../../store/posts/posts.actions';
import { selectAllPosts, selectPostsLoading } from '../../../store/posts/posts.reducer';

@Component({
  selector: 'app-post-list',
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
      padding: 20px;
      margin-bottom: 20px;
      width: 100%;
      box-sizing: border-box;
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
    .btn-like {
      background: rgba(0, 210, 255, 0.1);
      color: #00D2FF;
      border: 1px solid rgba(0, 210, 255, 0.3);
      border-radius: 6px;
      padding: 4px 12px;
      font-size: 0.85rem;
      font-weight: 600;
    }
    .btn-like:hover {
      background: rgba(0, 210, 255, 0.25);
    }
    .comment-box {
      background-color: #0f1115;
      border-radius: 8px;
      padding: 10px 12px;
      margin-top: 8px;
      border: 1px solid #2a2e39;
    }
  `],
  template: `
    <div class="wrapper">
      <div class="container">
        <div class="card-custom shadow-lg">
          <h5 class="fw-bold mb-3" style="color: #00D2FF;">Nova Objava</h5>
          <div class="d-flex flex-column gap-3">
            <textarea 
              class="input-custom" 
              rows="3" 
              placeholder="Šta ti je na umu?" 
              [(ngModel)]="newPostContent">
            </textarea>
            <div class="d-flex justify-content-end">
              <button class="btn-custom" (click)="onCreatePost()">Objavi</button>
            </div>
          </div>
        </div>

        <div *ngIf="loading$ | async" class="text-center my-4 py-3">
          <div class="spinner-border" style="color: #00D2FF;" role="status">
            <span class="visually-hidden">Učitavanje...</span>
          </div>
        </div>

        <div *ngFor="let post of posts$ | async" class="card-custom shadow-lg">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="fw-bold text-white">{{ post.user?.username || 'Korisnik' }}</span>
            <small class="text-muted">{{ post.createdAt | date:'dd.MM.yyyy. HH:mm' }}</small>
          </div>
          
          <p class="my-3" style="line-height: 1.5; color: #cbd5e1;">{{ post.content }}</p>

          <div class="d-flex justify-content-between align-items-center pt-2 mb-3" style="border-top: 1px solid #2a2e39;">
            <button class="btn-like" (click)="onLike(post.id)">
              👍 {{ post.likes?.length || 0 }}
            </button>
            <small class="text-muted">{{ post.comments?.length || 0 }} komentara</small>
          </div>

          <!-- Prikaz postojećih komentara -->
          <div *ngIf="post.comments && post.comments.length > 0" class="d-flex flex-column gap-2 mb-3">
            <div *ngFor="let comment of post.comments" class="comment-box">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="fw-bold text-white" style="font-size: 0.85rem;">{{ comment.username || 'Korisnik' }}</span>
                <small class="text-muted" style="font-size: 0.75rem;">{{ comment.createdAt | date:'dd.MM. HH:mm' }}</small>
              </div>
              <p class="mb-0 text-slate-300" style="font-size: 0.9rem; color: #cbd5e1;">{{ comment.content }}</p>
            </div>
          </div>

          <!-- Forma za unos novog komentara -->
          <div class="d-flex gap-2">
            <input 
              type="text" 
              class="input-custom" 
              placeholder="Napiši komentar..." 
              [(ngModel)]="commentInputs[post.id]"
              (keyup.enter)="onAddComment(post.id)"
            />
            <button class="btn-custom" (click)="onAddComment(post.id)">Komentariši</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PostListComponent implements OnInit {
  private store = inject(Store);

  posts$: Observable<Post[]> = this.store.select(selectAllPosts);
  loading$: Observable<boolean> = this.store.select(selectPostsLoading);

  newPostContent = '';
  commentInputs: { [postId: string]: string } = {};

  ngOnInit(): void {
    this.store.dispatch(PostsActions.loadPosts());
  }

  onCreatePost(): void {
    if (!this.newPostContent.trim()) return;
    this.store.dispatch(PostsActions.createPost({ content: this.newPostContent }));
    this.newPostContent = '';
  }

  onLike(postId: string): void {
    this.store.dispatch(PostsActions.toggleLike({ postId }));
  }

  onAddComment(postId: string): void {
    const content = this.commentInputs[postId];
    if (!content || !content.trim()) return;

    this.store.dispatch(PostsActions.addComment({ postId, content }));
    this.commentInputs[postId] = '';
  }
}