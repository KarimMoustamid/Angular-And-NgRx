import {inject} from '@angular/core'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {Action} from '@ngrx/store'
import {EMPTY, Observable, switchMap} from 'rxjs'
import {addToFavoritesActions} from './actions'
import {AddToFavoritesService} from '../services/addToFavorites.service'

/* ===========================================================================
 * STAGE S13 — a CROSS-FEATURE effect. This is the one interviewers like.
 * ---------------------------------------------------------------------------
 * Favouriting an article changes THREE things at once:
 *
 *   1. the server (POST /articles/:slug/favorite)
 *   2. the feed list item   (that row's heart turns blue)
 *   3. the article page     (if you are standing on it)
 *
 * The favourite action is dispatched by whichever component the click came
 * from, but the STATE that has to update does not live in this feature. There
 * is no `favorites` slice in this app on purpose.
 *
 * So the effect fires N actions on success — one per slice that might care —
 * and each slice decides whether it is interested. That is the alternative to
 * "one mega-reducer that knows about everything".
 *
 * YOU WRITE:
 *
 *   ofType(addToFavoritesActions.addToFavorites)
 *   switchMap(({isFavorited, slug}) =>
 *     isFavorited
 *       ? service.removeFromFavorites(slug)   // already favourited -> undo
 *       : service.addToFavorites(slug)
 *   )
 *   -> on success: feedActions.updateArticleInList({article})
 *      and if the article page is open: articleActions... (your call)
 *   -> on failure: addToFavoritesActions.addToFavoritesFailure()
 *
 * ORDER MATTERS for the UI: the component already flipped its own heart
 * optimistically, so if this effect fails you must flip it back somewhere.
 * Decide where, and write one line about it.
 * ======================================================================== */

export const addToFavoritesEffect = createEffect(
  (actions$ = inject(Actions), service = inject(AddToFavoritesService)): Observable<Action> => {
    return actions$.pipe(
      ofType(addToFavoritesActions.addToFavorites),
      // TODO S13.1 — replace this line.
      switchMap(() => EMPTY)
    )
  },
  {functional: true}
)
