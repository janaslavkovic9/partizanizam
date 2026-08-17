import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Match } from '../../models/match.model';
import { MatchesActions } from './matches.actions';

export interface MatchesState extends EntityState<Match> {
  loading: boolean;
  error: string | null;
}

export const adapter: EntityAdapter<Match> = createEntityAdapter<Match>({
  selectId: (match: Match) => match.id,
});

export const initialMatchesState: MatchesState = adapter.getInitialState({
  loading: false,
  error: null,
});

export const matchesReducer = createReducer(
  initialMatchesState,
  
  on(MatchesActions.loadMatches, (state) => ({ ...state, loading: true, error: null })),
  on(MatchesActions.loadMatchesSuccess, (state, { matches }) => adapter.setAll(matches, { ...state, loading: false })),
  on(MatchesActions.loadMatchesFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(MatchesActions.addMatchSuccess, (state, { match }) => adapter.addOne(match, state)),
  on(MatchesActions.saveQuizAnswersSuccess, (state, { match }) => adapter.updateOne({ id: match.id, changes: match }, state))
);

export const { selectAll: selectAllMatches } = adapter.getSelectors();