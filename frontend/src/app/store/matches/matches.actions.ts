import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Match } from '../../models/match.model';

export const MatchesActions = createActionGroup({
  source: 'Matches API',
  events: {
    'Load Matches': emptyProps(),
    'Load Matches Success': props<{ matches: Match[] }>(),
    'Load Matches Failure': props<{ error: string }>(),

    'Add Match': props<{ match: Omit<Match, 'id'> }>(),
    'Add Match Success': props<{ match: Match }>(),
    'Add Match Failure': props<{ error: string }>(),

    'Save Quiz Answers': props<{ matchId: string; answers: { [key: string]: string } }>(),
    'Save Quiz Answers Success': props<{ match: Match }>(),
    'Save Quiz Answers Failure': props<{ error: string }>(),
  }
});