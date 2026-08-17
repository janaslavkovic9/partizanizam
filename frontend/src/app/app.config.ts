import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { routes } from './app.routes';
import { matchesReducer } from './store/matches/matches.reducer';
import { MatchesEffects } from './store/matches/matches.effects';
import { postsReducer } from './store/posts/posts.reducer';
import { PostsEffects } from './store/posts/posts.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideStore({
      matches: matchesReducer,
      posts: postsReducer
    }),
    provideEffects([
      MatchesEffects,
      PostsEffects
    ])
  ]
};