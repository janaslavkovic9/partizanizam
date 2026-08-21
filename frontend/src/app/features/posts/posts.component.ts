import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
export class PostsComponent implements OnInit {
  private postService = inject(PostService);
  public authService = inject(AuthService);

  posts: Post[] = [];
  currentUser: User | null = null;

  newTitle: string = '';
  newContent: string = '';
  newImageUrl: string = '';

  commentTextMap: { [postId: string]: string } = {};

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
      },
      error: (err) => console.error('Greška pri učitavanju objava:', err)
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

    this.postService.createPost(payload).subscribe({
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

  deletePost(postId: string, post: Post): void {
    if (!this.isAuthor(post)) return;

    if (confirm('Da li ste sigurni da želite da obrišete ovu objavu?')) {
      this.postService.deletePost(postId).subscribe({
        next: () => {
          this.posts = this.posts.filter(p => p.id !== postId);
        },
        error: (err) => console.error('Greška pri brisanju objave:', err)
      });
    }
  }

  likePost(postId: string): void {
    this.postService.likePost(postId).subscribe({
      next: (updatedPost) => {
        const index = this.posts.findIndex(p => p.id === postId);
        if (index !== -1) {
          this.posts[index] = updatedPost;
        }
      },
      error: (err) => console.error('Greška pri lajkovanju:', err)
    });
  }

  addComment(postId: string): void {
    const text = this.commentTextMap[postId];
    if (!text || !text.trim()) return;

    this.postService.addComment(postId, text.trim()).subscribe({
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
}