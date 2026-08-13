export interface Comment {
  id: string;
  content: string;
  username?: string;
  user?: {
    username: string;
  };
  createdAt: string | Date;
}

export interface Post {
  id: string;
  content: string;
  createdAt: string | Date;
  user?: {
    username: string;
  };
  likes?: string[];
  comments?: Comment[];
}