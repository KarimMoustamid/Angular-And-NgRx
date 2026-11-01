import {createFeature, createReducer} from '@ngrx/store'
import {FeedStateInterface} from '../types/feedState.interface'

/* ===========================================================================
 * STAGE S8 — the feed reducer
 * ---------------------------------------------------------------------------
 * Same shape as the auth reducer, but notice the state has a `data` field that
 * holds the LAST GOOD ANSWER. That `data` field is what makes the UI feel fast:
 * while a new page loads, `isLoading` is true but `data` still has the old list,
 * so the page does not collapse to a blank screen.
 *
 * This is why the template renders in this order:
 *     <mc-loading *ngIf="data.isLoading">
 *     <div *ngIf="data.feed">        <- old data still there
 *
 * YOU WRITE: the three `on(...)` handlers. Until then the list never appears.
 * ======================================================================== */

const initialState: FeedStateInterface = {
  isLoading: false,
  error: null,
  data: null,
}

export const feedFeature = createFeature({
  name: 'feed',
  reducer: createReducer(
    initialState

    // TODO S8.1 — 'Get feed' was dispatched: a request is in flight.
    //   isLoading = true, error = null   (clear the stale error!)
    //   Do NOT touch `data`.

    // TODO S8.2 — 'Get feed success': the articles arrived.
    //   isLoading = false, data = action.feed.
    //   The action payload key is `feed` — check actions.ts.
    //   Why not spread `action.feed` into the state? Because `data` groups
    //   {articles, articlesCount} as one atomic unit that is either fully
    //   valid or null — never half-updated.

    // TODO S8.3 — 'Get feed failure': the request blew up.
    //   isLoading = false, error = a message for the user.
    //   The action carries no payload (that is a design choice in actions.ts).
    //   Either write a generic string here, or change the action to carry the
    //   error and use it. If you change it, say why in one line.
  ),
})

export const {
  name: feedFeatureKey,
  reducer: feedReducer,
  selectFeedState,
  selectIsLoading,
  selectError,
  // The state key is `data`; export it under a name that says what data it is.
  selectData: selectFeedData,
} = feedFeature
