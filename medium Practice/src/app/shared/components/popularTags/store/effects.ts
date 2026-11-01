import {inject} from '@angular/core'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {Action} from '@ngrx/store'
import {EMPTY, Observable, catchError, map, of, switchMap} from 'rxjs'
import {popularTagsActions} from './actions'
import {PopularTagService} from '../services/popularTag.service'

/* ===========================================================================
 * STAGE S7 — the effect. Same recipe as auth and feed. Write it without
 * scrolling up, then compare with what you wrote. If you can do this one
 * from memory, you can write any feature effect in this app.
 * ======================================================================== */

/** TODO S7.4 — ofType -> switchMap -> map(success) / catchError(failure). */
export const getPopularTagsEffect = createEffect(
  (actions$ = inject(Actions), popularTagService = inject(PopularTagService)): Observable<Action> => {
    return actions$.pipe(
      ofType(popularTagsActions.getPopularTags),
      // TODO S7.4 — replace this line.
      switchMap(() => EMPTY)
    )
  },
  {functional: true}
)
