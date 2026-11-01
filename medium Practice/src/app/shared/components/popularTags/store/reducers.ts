import {createFeature, createReducer} from '@ngrx/store'
import {PopularTagsStateInterface} from '../types/popularTagsState.interface'

/* ===========================================================================
 * STAGE S7 — your first COMPLETE feature, on your own.
 * ---------------------------------------------------------------------------
 * Auth was guided step by step. This one is the same pattern, three handlers,
 * no hand-holding. It is deliberately the smallest feature in the app, so that
 * "can I write a slice without help?" has a cheap answer.
 *
 * State (already given):
 *   isLoading : a request is in flight
 *   error     : last failure, or null
 *   data      : the tags, or null if we have never loaded them
 *
 * YOU WRITE: the handlers.
 * ======================================================================== */

const initialState: PopularTagsStateInterface = {
  isLoading: false,
  error: null,
  data: null,
}

export const popularTagsFeature = createFeature({
  name: 'popularTags',
  reducer: createReducer(
    initialState

    // TODO S7.1 — 'Get popular tags'    -> isLoading: true, error: null
    // TODO S7.2 — 'Get popular tags success' -> isLoading: false,
    //             data: action.popularTags
    // TODO S7.3 — 'Get popular tags failure' -> isLoading: false, error: '...'
    //
    // Reminder: the actions live in ./actions.ts and the keys are camelCased
    // from the group:  'Get popular tags' -> popularTagsActions.getPopularTags
    //                  'Get popular tags success' -> .getPopularTagsSuccess
  ),
})

export const {
  name: popularTagsFeatureKey,
  reducer: popularTagsReducer,
  selectPopularTagsState,
  selectIsLoading,
  selectError,
  selectData: selectPopularTagsData,
} = popularTagsFeature
