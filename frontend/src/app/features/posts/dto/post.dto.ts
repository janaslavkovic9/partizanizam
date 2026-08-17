export interface CreateCommentDto {
  text: string;
}

export interface CommentResponseDto {
  id: string;
  author: string;
  text: string;
  createdAt: Date;
}

export interface PostResponseDto {
  id: string;
  title: string;
  content: string;
  likesCount: number;
  isLiked?: boolean;
  comments: CommentResponseDto[];
}

export interface LikeResponseDto {
  likesCount: number;
  isLiked: boolean;
}