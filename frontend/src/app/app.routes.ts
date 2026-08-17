import { Routes } from '@angular/router';
import { MatchListComponent } from './features/matches/match-list/match-list.component';
import { PostsComponent } from './features/posts/posts.component';
import { ProfileComponent } from './features/profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'posts', pathMatch: 'full' },
  { path: 'posts', component: PostsComponent },
  { path: 'matches', component: MatchListComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', redirectTo: 'posts' }
];