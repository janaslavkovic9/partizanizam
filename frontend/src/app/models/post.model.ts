export interface User {
  id?: string;
  username: string;
  email?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface Comment {
  id: string;
  content: string;
  text?: string;
  createdAt: Date | string;
  username?: string;
  user?: User;
  author?: User;
}

export interface Post {
  id: string;
  title?: string;
  content: string;
  imageUrl?: string;
  createdAt: Date | string;
  likesCount?: number;
  likes?: any[];
  comments?: Comment[];
  user?: User;
  author?: User;
  username?: string;
}

export interface WatchLocation {
  id: string;
  matchId: string;
  title: string;
  address: string;
  lat: number;
  lng: number;
  description?: string;
  attendees: string[];
  createdBy: string;
}