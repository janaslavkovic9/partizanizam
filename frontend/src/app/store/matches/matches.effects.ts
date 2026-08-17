import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MatchesService } from '../../services/matches.service';
import { MatchesActions } from './matches.actions';
import { switchMap, map, catchError, of } from 'rxjs';

@Injectable()
export class MatchesEffects {
  private actions$ = inject(Actions);
  private matchesService = inject(MatchesService);

  loadMatches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MatchesActions.loadMatches),
      switchMap(() =>
        this.matchesService.getMatches().pipe(
          map((matches) => MatchesActions.loadMatchesSuccess({ matches })),
          catchError((err) => of(MatchesActions.loadMatchesFailure({ error: err.message })))
        )
      )
    )
  );

  addMatch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MatchesActions.addMatch),
      switchMap(({ match }) =>
        this.matchesService.addMatch(match).pipe(
          map((newMatch) => MatchesActions.addMatchSuccess({ match: newMatch })),
          catchError((err) => of(MatchesActions.addMatchFailure({ error: err.message })))
        )
      )
    )
  );

  saveQuizAnswers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MatchesActions.saveQuizAnswers),
      switchMap(({ matchId, answers }) =>
        this.matchesService.saveQuizAnswers(matchId, answers).pipe(
          map((updatedMatch) => MatchesActions.saveQuizAnswersSuccess({ match: updatedMatch })),
          catchError((err) => of(MatchesActions.saveQuizAnswersFailure({ error: err.message })))
        )
      )
    )
  );
}