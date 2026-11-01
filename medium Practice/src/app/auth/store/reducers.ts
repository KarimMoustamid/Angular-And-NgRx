import {createFeature, createReducer, on} from '@ngrx/store'
import {AuthStateInterface} from '../types/authState.interface'
import {authActions} from './actions'

/* ===========================================================================
 * STAGE S2 — the auth reducer
 * ---------------------------------------------------------------------------
 * A reducer is a PURE function:  (state, action) => newState
 *
 *   - it never mutates `state`, it returns a new object
 *   - it never calls an API, a router, a clock, Math.random() — nothing impure
 *   - same input => same output, always. That is why it is trivially testable,
 *     and why effects exist: the impure stuff has to live somewhere else.
 *
 * `createFeature` does three jobs at once:
 *   1. mounts this reducer under the store key 'auth'  (=> state.auth)
 *   2. gives you `authFeature.reducer`, `authFeature.name`
 *   3. generates a selector for EVERY key of the state, for free:
 *        isSubmitting      -> selectIsSubmitting
 *        currentUser       -> selectCurrentUser
 *        isLoading         -> selectIsLoading
 *        validationErrors  -> selectValidationErrors
 *      plus selectAuthState (the whole slice).
 *
 * YOU WRITE: every `on(...)` handler marked TODO. Nothing else.
 * UNTIL YOU DO: the state never changes, so the navbar never updates. That is
 * the exact symptom you are looking for in the browser.
 * ======================================================================== */

const initialState: AuthStateInterface = {
  isSubmitting: false,
  // undefined = "we have not asked the API yet"
  // null      = "we asked, and nobody is logged in"
  // object    = "we asked, here is the user"
  // Keeping those three apart matters — it is why the navbar does not flash
  // "Sign in" for a logged-in user on every page reload.
  currentUser: undefined,
  isLoading: false,
  validationErrors: null,
}

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,

    /* ---------------------------------------------------------------------
     * WORKED EXAMPLE — read this one carefully, it is the pattern for all of
     * them. "When login is dispatched, we are now submitting, and last attempt's
     * validation errors are stale, so clear them."
     * ------------------------------------------------------------------ */
    on(authActions.login, (state) => ({
      ...state,
      isSubmitting: true,
      validationErrors: null,
    })),

    // TODO S2.1 — register starts.
    //   Same shape as the login handler above: isSubmitting = true,
    //   validationErrors = null.
    // on(authActions.register, (state) => ...),

    // TODO S2.2 — register succeeded.
    //   The API answered with the new user. Store it in `currentUser`,
    //   and stop the spinner (isSubmitting = false).
    // on(authActions.registerSuccess, (state, action) => ...),

    // TODO S2.3 — login succeeded. Same as S2.2, different action.
    // on(authActions.loginSuccess, (state, action) => ...),

    // TODO S2.4 — login OR register failed.
    //   `action.errors` is the API's 422 payload: {email: ["has already been taken"]}
    //   Put it in `validationErrors` so the form can render it, and stop
    //   the spinner. Two actions, one handler each — or use the spread trick
    //   `on(authActions.loginFailure, authActions.registerFailure, ...)`.
    //   (Note: createActionGroup camelCases the keys. The event is written
    //   'Login failure' in actions.ts, but you call it as
    //   `authActions.loginFailure` — no brackets, no spaces.)

    // TODO S2.5 — "Get current user" was dispatched, we are now loading.
    //   isLoading = true.
    // TODO S2.6 — "Get current user success".
    //   isLoading = false and currentUser = action.currentUser
    //   (which may be null: that means "logged out", not "unknown").
    // TODO S2.7 — "Get current user failure". isLoading = false.
    //   Leave currentUser as undefined; we hit a network error, we did not
    //   learn that the user is logged out.
    // TODO S2.8 — Logout.
    //   currentUser = null (logged out, and we know it).
    //   Should isSubmitting / validationErrors be reset too? Decide, and write
    //   down why in one line. (Hint: what happens if you log out mid-form?)
  ),
})

/* ---------------------------------------------------------------------------
 * Destructuring the generated selectors into plain names.
 * Everything below this line is what components import.
 * ------------------------------------------------------------------------ */
export const {
  name: authFeatureKey,
  reducer: authReducer,
  selectAuthState,
  selectCurrentUser,
  selectIsSubmitting,
  selectIsLoading,
  selectValidationErrors,
} = authFeature
