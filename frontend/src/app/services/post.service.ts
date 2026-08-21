import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:3001/posts';

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  createPost(postData: { title?: string; content: string; imageUrl?: string }): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, postData, { headers: this.getAuthHeaders() });
  }

  deletePost(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  likePost(id: string): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/${id}/like`, {}, { headers: this.getAuthHeaders() });
  }

  addComment(postId: string, content: string): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/${postId}/comments`, { content }, { headers: this.getAuthHeaders() });
  }
}