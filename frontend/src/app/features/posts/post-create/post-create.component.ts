import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { createPost } from '../../../store/posts/posts.actions';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    :host {
      display: block;
      width: 100%;
      margin-bottom: 24px;
    }
    .create-card {
      background-color: #161920;
      border: 1px solid #2a2e39;
      border-radius: 14px;
      padding: 20px;
      width: 100%;
      box-sizing: border-box;
    }
    .custom-textarea {
      width: 100%;
      background-color: #0f1115 !important;
      color: #ffffff !important;
      border: 1px solid #2a2e39 !important;
      border-radius: 10px;
      box-sizing: border-box;
      display: block;
    }
    .custom-textarea::placeholder {
      color: #64748b;
    }
    .custom-textarea:focus {
      border-color: #00D2FF !important;
      box-shadow: 0 0 0 2px rgba(0, 210, 255, 0.2);
      outline: none;
    }
    .btn-candy {
      background: linear-gradient(135deg, #00D2FF 0%, #0080FF 100%);
      color: #0f1115;
      font-weight: 700;
      border: none;
      transition: all 0.2s ease;
    }
    .btn-candy:hover:not(:disabled) {
      box-shadow: 0 0 12px rgba(0, 210, 255, 0.5);
      transform: translateY(-1px);
    }
    .btn-candy:disabled {
      opacity: 0.4;
      background: #334155;
      color: #94a3b8;
    }
  `],
  template: `
    <div class="create-card shadow-lg">
      <textarea
        [(ngModel)]="content"
        class="form-control custom-textarea p-3"
        rows="3"
        placeholder="O čemu razmišljaš?"
        style="resize: none; font-size: 0.95rem;"
      ></textarea>
      
      <div class="d-flex justify-content-end align-items-center mt-3 pt-3" style="border-top: 1px solid #2a2e39;">
        <button 
          class="btn btn-candy px-4 py-2 rounded-pill" 
          [disabled]="!content.trim()"
          (click)="onSubmit()"
        >
          Objavi
        </button>
      </div>
    </div>
  `
})
export class PostCreateComponent {
  private store = inject(Store);
  content = '';

  onSubmit() {
    if (this.content.trim()) {
      this.store.dispatch(createPost({ content: this.content }));
      this.content = '';
    }
  }
}