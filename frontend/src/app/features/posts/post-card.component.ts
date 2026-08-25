import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post, User } from '../../models/post.model';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-card.component.html'
})
export class PostCardComponent {
  @Input() post!: Post;
  @Input() currentUser: User | null = null;

  @Output() delete = new EventEmitter<string>();
  @Output() like = new EventEmitter<string>();
  @Output() addComment = new EventEmitter<{ postId: string; text: string }>();

  commentText: string = '';

  isAuthor(): boolean {
    if (!this.currentUser) return false;
    const authorUsername = this.post.user?.username || (typeof this.post.user === 'string' ? this.post.user : null);
    return authorUsername === this.currentUser.username;
  }

  onDelete(): void {
    this.delete.emit(this.post.id);
  }

  onLike(): void {
    this.like.emit(this.post.id);
  }

  onAddComment(): void {
    if (!this.commentText.trim()) return;
    this.addComment.emit({ postId: this.post.id, text: this.commentText.trim() });
    this.commentText = '';
  }
}