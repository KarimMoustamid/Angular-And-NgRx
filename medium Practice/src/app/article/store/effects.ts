import {inject} from '@angular/core'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {Action} from '@ngrx/store'
import {EMPTY, Observable, switchMap} from 'rxjs'
import {articleActions} from './actions'
import {ArticleService} from '../services/article.service'

/* ===========================================================================
 * STAGE S11 — the article effects
 * ======================================================================== */

/**
 * TODO S11.5 — load one article.
 *   The slug comes from the action: switchMap(({slug}) => ...)
 */
export const getArticleEffect = createEffect(
  (actions$ = inject(Actions), articleService = inject(ArticleService)): Observable<Action> => {
    return actions$.pipe(
      ofType(articleActions.getArticle),
      // TODO S11.5 — replace this line.
      switchMap(() => EMPTY)
    )
  },
  {functional: true}
)

/**
 * TODO S11.6 — delete, then navigate away.
 *
 * This one has TWO side effects on success, and that is exactly what an effect
 * is for:
 *
 *   ofType(articleActions.deleteArticle)
 *   switchMap(() => articleService.deleteArticle().pipe(
 *     map(() => articleActions.deleteArticleSuccess()),
 *     catchError(() => of(articleActions.deleteArticleFailure()))
 *   ))
 *
 * ...and a SECOND effect that listens for `deleteArticleSuccess` and does
 * router.navigateByUrl('/'). Why a second effect instead of `tap` inside the
 * first? Because `tap` inside switchMap is fine for navigation, but keeping
 * "state changes" and "navigation" in separate effects makes each one readable
 * and testable on its own. Either is acceptable — know why you chose yours.
 */
export const deleteArticleEffect = createEffect(
  (actions$ = inject(Actions), articleService = inject(ArticleService)): Observable<Action> => {
    return actions$.pipe(
      ofType(articleActions.deleteArticle),
      // TODO S11.6 — replace this line.
      switchMap(() => EMPTY)
    )
  },
  {functional: true}
)
