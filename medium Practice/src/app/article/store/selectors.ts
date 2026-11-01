import {createSelector} from '@ngrx/store'
import {selectCurrentUser} from 'src/app/auth/store/reducers'
import {selectArticleData} from './reducers'

/* ===========================================================================
 * STAGE S14 — a selector that needs TWO slices
 * ---------------------------------------------------------------------------
 * "Show the Delete button only if I wrote this article" is not a value the
 * server sends. It is derived: article.author.username === currentUser.username.
 *
 * Why not compute it in the component?
 *   - the component would need two subscriptions and a combineLatest (the
 *     reference app does exactly that — it works, but it is logic in the view)
 *   - a selector is memoized: it recomputes only when article or currentUser
 *     actually change, and it is unit-testable with no TestBed
 *   - every component that needs "am I the author?" gets the same answer
 *
 * compose selectors like this — never read `state.article.data` by hand, or you
 * quietly break memoization and lose type safety at the same time.
 *
 * YOU WRITE: the body. The placeholder below means the Delete button is
 * invisible until you do — that is your signal that S14 is done.
 * ======================================================================== */

export const selectIsAuthor = createSelector(
  selectArticleData,
  selectCurrentUser,
  (article, currentUser) => {
    // TODO S14 — return true only when both exist and the usernames match.
    //   Careful: currentUser can be undefined (we never asked), null (nobody
    //   logged in) or a user. All three must be handled — `?.` helps, but make
    //   sure "undefined === undefined" cannot come out as `true`.
    return false
  }
)
