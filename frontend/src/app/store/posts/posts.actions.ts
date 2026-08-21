import { createAction, props } from '@ngrx/store';
import { Post } from '../../models/post.model';

export const loadPosts = createAction('[Posts] Load Posts');
export const loadPostsSuccess = createAction('[Posts] Load Posts Success', props<{ posts: Post[] }>());
export const loadPostsFailure = createAction('[Posts] Load Posts Failure', props<{ error: any }>());

export const createPost = createAction(
  '[Posts] Create Post',
  props<{ title?: string; content: string; imageUrl?: string }>()
);
export const createPostSuccess = createAction('[Posts] Create Post Success', props<{ post: Post }>());
export const createPostFailure = createAction('[Posts] Create Post Failure', props<{ error: any }>());

export const deletePost = createAction('[Posts] Delete Post', props<{ id: string }>());
export const deletePostSuccess = createAction('[Posts] Delete Post Success', props<{ id: string }>());
export const deletePostFailure = createAction('[Posts] Delete Post Failure', props<{ error: any }>());

export const toggleLike = createAction('[Posts] Toggle Like', props<{ postId: string }>());
export const toggleLikeSuccess = createAction('[Posts] Toggle Like Success', props<{ post: Post }>());

export const addComment = createAction('[Posts] Add Comment', props<{ postId: string; content: string }>());
export const addCommentSuccess = createAction('[Posts] Add Comment Success', props<{ post: Post }>());