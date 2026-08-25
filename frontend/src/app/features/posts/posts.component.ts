import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, zip, merge } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { Post, User } from '../../models/post.model';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit, OnDestroy {
  private postService = inject(PostService);
  public authService = inject(AuthService);

  private destroy$ = new Subject<void>();

  posts: Post[] = [];
  currentUser: User | null = null;

  newTitle: string = '';
  newContent: string = '';
  newImageUrl: string = '';

  commentTextMap: { [key: string]: string } = {};

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });

    this.loadPosts();
    this.setupStreamListeners();
  }

  loadPosts(): void {
    zip(
      this.postService.getPosts(),
      this.authService.currentUser$.pipe(take(1))
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([postsData, userData]) => {
          this.posts = postsData;
          if (userData && !this.currentUser) {
            this.currentUser = userData;
          }
        },
        error: (err) => console.error('Greška pri učitavanju objava:', err)
      });
  }

  setupStreamListeners(): void {
    const posts$ = this.postService.getPosts();
    const user$ = this.authService.currentUser$;

    merge(posts$, user$)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {}
      });
  }

  createPost(): void {
    if (!this.newContent.trim()) return;

    const payload = {
      title: this.newTitle.trim() || undefined,
      content: this.newContent.trim(),
      imageUrl: this.newImageUrl.trim() || undefined,
      user: this.currentUser || undefined
    };

    this.postService.createPost(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (post) => {
          const createdPost: Post = {
            ...post,
            user: post.user?.username ? post.user : (this.currentUser ? this.currentUser : undefined)
          };

          this.posts.unshift(createdPost);
          this.newTitle = '';
          this.newContent = '';
          this.newImageUrl = '';
        },
        error: (err) => console.error('Greška pri kreiranju objave:', err)
      });
  }

  isAuthor(post: Post): boolean {
    if (!this.currentUser) return false;
    const authorUsername = post.user?.username || (typeof post.user === 'string' ? post.user : null);
    return authorUsername === this.currentUser.username;
  }

  deletePost(postId: string, post?: Post): void {
    if (confirm('Da li ste sigurni da želite da obrišete ovu objavu?')) {
      this.postService.deletePost(postId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.posts = this.posts.filter(p => p.id !== postId);
          },
          error: (err) => console.error('Greška pri brisanju objave:', err)
        });
    }
  }

  likePost(postId: string): void {
    this.postService.likePost(postId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedPost) => {
          const index = this.posts.findIndex(p => p.id === postId);
          if (index !== -1) {
            this.posts[index] = updatedPost;
          }
        },
        error: (err) => console.error('Greška pri lajkovanju:', err)
      });
  }

  addComment(postIdOrEvent: string | { postId: string; text: string }): void {
    let postId: string;
    let text: string;

    if (typeof postIdOrEvent === 'object') {
      postId = postIdOrEvent.postId;
      text = postIdOrEvent.text;
    } else {
      postId = postIdOrEvent;
      text = this.commentTextMap[postId]?.trim() || '';
    }

    if (!text) return;

    this.postService.addComment(postId, text)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedPost) => {
          const index = this.posts.findIndex(p => p.id === postId);
          if (index !== -1) {
            this.posts[index] = updatedPost;
          }
          this.commentTextMap[postId] = '';
        },
        error: (err) => console.error('Greška pri dodavanju komentara:', err)
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}