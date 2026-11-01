import {Injectable, inject} from '@angular/core'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {Action} from '@ngrx/store'
import {EMPTY, Observable, catchError, map, of, switchMap, tap} from 'rxjs'
import {Router} from '@angular/router'
import {PersistanceService} from 'src/app/core/persistance.service'
import {authActions} from './actions'
import {AuthService} from '../services/auth.service'

/* ===========================================================================
 * STAGE S3 / S4 / S5 — the auth effects
 * ---------------------------------------------------------------------------
 * An effect is the answer to "a reducer cannot do that". It listens to the
 * action stream, does something impure (HTTP, navigation, localStorage), and
 * returns MORE actions — which go back through the same reducer.
 *
 *   component --dispatch--> Login --reducer--> isSubmitting: true
 *                                      |
 *                                      +--effect--> AuthService.login()
 *                                                     |
 *                                          Login success / Login failure
 *                                                     |
 *                                                    reducer
 *
 * The `functional: true` form below is the modern one: an arrow function whose
 * arguments are injected. It needs no @Injectable class and no constructor.
 *
 * Every TODO in this file has the same recipe:
 *   1. ofType(someAction)          — which action am I answering?
 *   2. switchMap/map/catchError    — do the work, translate the result
 *   3. return an action            — never return nothing; use EMPTY if you must
 * ======================================================================== */

/**
 * TODO S4 — after register: log in the new user.
 *
 * Recipe:
 *   ofType(authActions.register)
 *   switchMap(({request}) => authService.register(request).pipe(...))
 *   inside the pipe:
 *     map((currentUser) => authActions.registerSuccess({currentUser}))
 *     catchError((errorResponse) => of(authActions.registerFailure({
 *       errors: errorResponse.error.errors,
 *     })))
 *
 * Gotcha: `catchError` must be INSIDE the switchMap, not after it. After it,
 * one failed request would kill the whole effect for the rest of the session.
 */
export const registerEffect = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)): Observable<Action> => {
    return actions$.pipe(
      ofType(authActions.register),
      // TODO S4 — replace this line with the recipe above.
      switchMap(() => EMPTY)
    )
  },
  {functional: true}
)

/**
 * TODO S3 — the smallest useful effect in the whole app. Start here.
 *
 * Same recipe as register, plus one extra thing on success: store the token.
 *
 *   switchMap(({request}) => authService.login(request).pipe(
 *     map((currentUser) => {
 *       persistanceService.set('accessToken', currentUser.token)
 *       return authActions.loginSuccess({currentUser})
 *     }),
 *     catchError((errorResponse) => of(authActions.loginFailure({
 *       errors: errorResponse.error.errors,
 *     })))
 *   ))
 *
 * Question for you: why is `tap` the wrong tool here?
 * (Because tap cannot return an action — the store would never hear about it.)
 */
export const loginEffect = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService),
    persistanceService = inject(PersistanceService)
  ): Observable<Action> => {
    return actions$.pipe(
      ofType(authActions.login),
      // TODO S3 — replace this line.
      switchMap(() => EMPTY)
    )
  },
  {functional: true}
)

/**
 * TODO S4.2 — after register, send the user to the home page.
 *
 * This is a "listener" effect: it dispatches nothing that the store cares about,
 * it just navigates. Easiest way to write it is to reuse the login effect's
 * success action:
 *
 *   ofType(authActions.registerSuccess)
 *   tap(() => router.navigateByUrl('/'))
 *
 * `dispatch: false` is the flag that says "this effect returns no action".
 * If you forget it, NgRx dispatches whatever `tap` returns (undefined) and you
 * get a confusing "@ngrx/effects: Effect dispatched an invalid action" error.
 */
export const redirectAfterRegisterEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(authActions.registerSuccess),
      // TODO S4.2 — tap(() => router.navigateByUrl('/'))
      tap(() => undefined)
    )
  },
  {functional: true, dispatch: false}
)

/**
 * TODO S5 — "who am I?" on app start, and after every reload.
 *
 * Three cases, and the difference between them is the point:
 *
 *   1. no token in localStorage  -> currentUser = null. Do NOT call the API.
 *      of(null) is a legitimate observable value; don't filter it away.
 *   2. token, API says 200       -> currentUser = the user.
 *   3. token, API says 401       -> currentUser = null. The token is dead;
 *      remove it from localStorage so we stop sending it.
 *
 * Shape hint:
 *   ofType(authActions.getCurrentUser)
 *   switchMap(() => {
 *     const token = persistanceService.get('accessToken')
 *     if (!token) return of(authActions.getCurrentUserSuccess({currentUser: null}))
 *     return authService.getCurrentUser().pipe(...)
 *   })
 */
export const getCurrentUserEffect = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService),
    persistanceService = inject(PersistanceService)
  ): Observable<Action> => {
    return actions$.pipe(
      ofType(authActions.getCurrentUser),
      // TODO S5 — replace this line.
      switchMap(() => EMPTY)
    )
  },
  {functional: true}
)

/**
 * TODO S5.2 — logout.
 *
 * `Logout` is dispatched by the navbar? No — look around: nothing dispatches it
 * yet. Your job in S5 is also to add the button and the dispatch, then make this
 * effect delete the token from localStorage and navigate to '/'.
 *
 * Careful: if you only clear the store and leave the token on disk, a reload
 * logs the user straight back in and it looks like your Logout "didn't work".
 */
export const logoutEffect = createEffect(
  (
    actions$ = inject(Actions),
    router = inject(Router),
    persistanceService = inject(PersistanceService)
  ) => {
    return actions$.pipe(
      ofType(authActions.logout),
      // TODO S5.2 — tap(() => { persistanceService.set('accessToken', null); router.navigateByUrl('/') })
      tap(() => undefined)
    )
  },
  {functional: true, dispatch: false}
)
