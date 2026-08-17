import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MatchesState, selectAllMatches } from './matches.reducer';

export const selectMatchesState = createFeatureSelector<MatchesState>('matches');

export const selectAllMatchesData = createSelector(
  selectMatchesState,
  selectAllMatches
);

export const selectMatchesLoading = createSelector(
  selectMatchesState,
  (state) => state.loading
);