import { User } from './user.model';

export interface Comment {
  id: string;
  content: string;
  user: User;
  createdAt: Date;
}

export interface Like {
  id: string;
  user: User;
}

export interface Post {
  id: string;
  content: string;
  user: User;
  comments?: Comment[];
  likes?: Like[];
  createdAt: Date;
}