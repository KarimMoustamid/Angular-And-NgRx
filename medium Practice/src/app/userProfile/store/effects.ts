import {inject} from '@angular/core'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {Action} from '@ngrx/store'
import {EMPTY, Observable, switchMap} from 'rxjs'
import {userProfileActions} from './actions'
import {UserProfileService} from '../services/userProfile.service'

/* ===========================================================================
 * STAGE S12 — the effect. Same recipe, fourth time.
 *
 * switchMap is the right operator here for the same reason as the article
 * effect: click ana, then sam, quickly. The slow ana response must not win.
 * ======================================================================== */

/** TODO S12.4 — ofType -> switchMap(({slug})) -> map / catchError. */
export const getUserProfileEffect = createEffect(
  (actions$ = inject(Actions), userProfileService = inject(UserProfileService)): Observable<Action> => {
    return actions$.pipe(
      ofType(userProfileActions.getUserProfile),
      // TODO S12.4 — replace this line.
      switchMap(() => EMPTY)
    )
  },
  {functional: true}
)
