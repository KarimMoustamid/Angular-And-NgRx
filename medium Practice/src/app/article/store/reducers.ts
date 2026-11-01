import {createFeature, createReducer} from '@ngrx/store'
import {ArticleStateInterface} from '../types/articleState.interface'

/* ===========================================================================
 * STAGE S11 — the article reducer
 * ---------------------------------------------------------------------------
 * This slice is registered LAZILY (see article.routes.ts), not in app.config.ts.
 * Everything else about it is identical to the feed slice. The lesson: where a
 * slice is registered has nothing to do with how it works.
 *
 * Note `deleteArticle` carries `emptyProps()` — the slug is already the one in
 * the current state. Repeating it in the action is how you get two sources of
 * truth that can disagree.
 *
 * YOU WRITE: the handlers.
 * ======================================================================== */

const initialState: ArticleStateInterface = {
  isLoading: false,
  error: null,
  data: null,
}

export const articleFeature = createFeature({
  name: 'article',
  reducer: createReducer(
    initialState

    // TODO S11.1 — 'Get article'         -> isLoading: true, error: null
    // TODO S11.2 — 'Get article success' -> isLoading: false, data: action.article
    // TODO S11.3 — 'Get article failure' -> isLoading: false, error: '...'
    //
    // TODO S11.4 — 'Delete article success'. Think before typing: what should
    //   `data` be after the article is gone? There are two defensible answers
    //   (null, or leave it and let navigation handle it). Pick one, and write
    //   one line explaining the choice.
  ),
})

export const {
  name: articleFeatureKey,
  reducer: articleReducer,
  selectArticleState,
  selectIsLoading,
  selectError,
  selectData: selectArticleData,
} = articleFeature
