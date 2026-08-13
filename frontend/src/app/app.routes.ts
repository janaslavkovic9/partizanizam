import { Routes } from '@angular/router';
import { PostListComponent } from './features/posts/post-list/post-list.component';
import { MatchListComponent } from './features/matches/match-list/match-list.component';
import { ProfileComponent } from './features/profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'posts', pathMatch: 'full' },
  { path: 'posts', component: PostListComponent },
  { path: 'matches', component: MatchListComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', redirectTo: 'posts' }
];