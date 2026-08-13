import { createFeatureSelector, createSelector, createReducer, on } from '@ngrx/store';
import { Post } from '../../models/post.model';
import * as PostsActions from './posts.actions';

export interface PostsState {
  posts: Post[];
  loading: boolean;
  error: any;
}

export const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
};

export const postsReducer = createReducer(
  initialState,

  on(PostsActions.loadPosts, (state): PostsState => ({
    ...state,
    loading: true,
  })),

  on(PostsActions.loadPostsSuccess, (state, { posts }): PostsState => ({
    ...state,
    loading: false,
    posts,
  })),

  on(PostsActions.loadPostsFailure, (state, { error }): PostsState => ({
    ...state,
    loading: false,
    error,
  })),

  on(PostsActions.createPostSuccess, (state, { post }): PostsState => ({
    ...state,
    posts: [post, ...state.posts],
  })),

  on(PostsActions.toggleLikeSuccess, (state, { post }): PostsState => ({
    ...state,
    posts: state.posts.map((p) => (p.id === post.id ? post : p)),
  })),

  on(PostsActions.addCommentSuccess, (state, { post }): PostsState => ({
    ...state,
    posts: state.posts.map((p) => (p.id === post.id ? post : p)),
  }))
);

export const selectPostsState = createFeatureSelector<PostsState>('posts');

export const selectAllPosts = createSelector(
  selectPostsState,
  (state: PostsState) => state?.posts || []
);

export const selectPostsLoading = createSelector(
  selectPostsState,
  (state: PostsState) => state?.loading || false
);