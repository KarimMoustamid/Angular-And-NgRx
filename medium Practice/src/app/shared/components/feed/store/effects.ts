import {inject} from '@angular/core'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {Action} from '@ngrx/store'
import {EMPTY, Observable, catchError, map, of, switchMap} from 'rxjs'
import {feedActions} from './actions'
import {FeedService} from '../services/feed.service'

/* ===========================================================================
 * STAGE S8 — the feed effect
 * ---------------------------------------------------------------------------
 * Same recipe as auth, one difference worth staring at: the action CARRIES the
 * url (`action.url`). The effect is not allowed to decide what to fetch — the
 * component decided. That keeps the effect a dumb pipe and the component in
 * charge of "which list am I showing?".
 * ======================================================================== */

/**
 * TODO S8.4 — fetch the list.
 *
 *   ofType(feedActions.getFeed)
 *   switchMap(({url}) => feedService.getFeed(url).pipe(
 *     map((feed) => feedActions.getFeedSuccess({feed})),
 *     catchError(() => of(feedActions.getFeedFailure()))
 *   ))
 *
 * Two questions to answer for yourself:
 *   - why `switchMap` and not `mergeMap`?  (pagination: click page 2 while
 *     page 1 is still loading — which answer do you want on screen?)
 *   - why is `catchError` inside the `switchMap`? (same trap as auth: a
 *     `catchError` at the outer level completes the effect forever)
 */
export const getFeedEffect = createEffect(
  (actions$ = inject(Actions), feedService = inject(FeedService)): Observable<Action> => {
    return actions$.pipe(
      ofType(feedActions.getFeed),
      // TODO S8.4 — replace this line.
      switchMap(() => EMPTY)
    )
  },
  {functional: true}
)
