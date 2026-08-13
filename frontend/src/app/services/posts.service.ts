import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3001/posts';

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  createPost(content: string): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, { content });
  }

  toggleLike(postId: string): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/${postId}/like`, {});
  }

  addComment(postId: string, content: string): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/${postId}/comments`, { content });
  }
}