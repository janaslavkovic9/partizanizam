import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: Date;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  likesCount: number;
  isLiked?: boolean;
  comments: Comment[];
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3001/api/posts'; 
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  likePost(postId: string): Observable<{ likesCount: number; isLiked: boolean }> {
    return this.http.post<{ likesCount: number; isLiked: boolean }>(`${this.apiUrl}/${postId}/like`, {});
  }

  addComment(postId: string, text: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/${postId}/comments`, { text });
  }
}