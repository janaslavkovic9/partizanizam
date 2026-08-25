import { Routes } from '@angular/router';
import { MatchesComponent } from './features/matches/matches.component';
import { PostsComponent } from './features/posts/posts.component';
import { ProfileComponent } from './features/profile/profile.component';
import { MapComponent } from './features/map/map.component';

export const routes: Routes = [
  { path: '', redirectTo: 'posts', pathMatch: 'full' },
  { path: 'posts', component: PostsComponent },
  { path: 'matches', component: MatchesComponent },
  { path: 'map', component: MapComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'login', redirectTo: 'profile', pathMatch: 'full' },
  { path: 'register', redirectTo: 'profile', pathMatch: 'full' },
  { path: '**', redirectTo: 'posts' }
];