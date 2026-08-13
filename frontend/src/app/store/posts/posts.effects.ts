import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { PostsService } from '../../services/posts.service';
import * as PostsActions from './posts.actions';
import { Post } from '../../models/post.model';

@Injectable()
export class PostsEffects {
  private actions$ = inject(Actions);
  private postsService = inject(PostsService);

  loadPosts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostsActions.loadPosts),
      switchMap(() =>
        this.postsService.getPosts().pipe(
          map((posts: Post[]) => PostsActions.loadPostsSuccess({ posts })),
          catchError((error) =>
            of(PostsActions.loadPostsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  createPost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostsActions.createPost),
      switchMap(({ content }) =>
        this.postsService.createPost(content).pipe(
          map((post: Post) => PostsActions.createPostSuccess({ post })),
          catchError((error) =>
            of(PostsActions.createPostFailure({ error: error.message }))
          )
        )
      )
    )
  );

  toggleLike$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostsActions.toggleLike),
      switchMap(({ postId }) =>
        this.postsService.toggleLike(postId).pipe(
          map((post: Post) => PostsActions.toggleLikeSuccess({ post })),
          catchError(() => of({ type: '[Posts] Toggle Like Failure' }))
        )
      )
    )
  );

  addComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostsActions.addComment),
      switchMap(({ postId, content }) =>
        this.postsService.addComment(postId, content).pipe(
          map((post: Post) => PostsActions.addCommentSuccess({ post })),
          catchError(() => of({ type: '[Posts] Add Comment Failure' }))
        )
      )
    )
  );
}