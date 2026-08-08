import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Post {
  id: string;
  title?: string;
  content: string;
  imageUrl?: string;
  createdAt?: string;
  user?: {
    id: string;
    username: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private apiUrl = 'http://localhost:3001/posts';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }


  getAll(): Observable<Post[]> {
    return this.getPosts();
  }

  createPost(postData: { title?: string; content: string; imageUrl?: string }): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, postData);
  }


  create(postData: { title?: string; content: string; imageUrl?: string }): Observable<Post> {
    return this.createPost(postData);
  }

  deletePost(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }


  delete(id: string): Observable<any> {
    return this.deletePost(id);
  }
}