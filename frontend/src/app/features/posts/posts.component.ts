import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostsService, Post } from '../../core/services/posts.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit {
  posts: Post[] = [];
  title: string = '';
  content: string = '';
  imageUrl: string = '';

  constructor(
    public authService: AuthService,
    private postsService: PostsService
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postsService.getPosts().subscribe({
      next: (data: Post[]) => (this.posts = data),
      error: (err) => console.error('Greška pri učitavanju objava:', err)
    });
  }

  createPost(): void {
    if (!this.content.trim()) return;

    const newPostData = {
      title: this.title.trim() ? this.title : undefined,
      content: this.content,
      imageUrl: this.imageUrl.trim() ? this.imageUrl : undefined
    };

    this.postsService.createPost(newPostData).subscribe({
      next: (createdPost) => {
        this.posts.unshift(createdPost);
        this.title = '';
        this.content = '';
        this.imageUrl = '';
      },
      error: (err) => console.error('Greška pri objavljivanju:', err)
    });
  }

  deletePost(postId: string): void {
    if (confirm('Da li ste sigurni da želite da obrišete ovu objavu?')) {
      this.postsService.deletePost(postId).subscribe({
        next: () => {
          this.posts = this.posts.filter((p) => p.id !== postId);
        },
        error: (err) => console.error('Greška pri brisanju objave:', err)
      });
    }
  }
}