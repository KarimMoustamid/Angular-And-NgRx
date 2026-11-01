# S17 — entity adapter (optional)

**Files:** `src/app/shared/components/feed/store/reducers.ts`,
`types/feedState.interface.ts`, plus the selectors at the bottom of the reducer.
40 minutes. **Do this last, and do it on a git branch.**

Everything you have built works. This stage is not about a feature — it is about
a shape. Once a list lives in the store, "find the one with this slug and replace
it" (S13) is `map` over an array every time, O(n) and noisy. An entity adapter
stores the same data as `{ids: [], entities: {}}` and gives you `updateOne`,
`upsertMany`, `selectAll` — same behaviour, less code, fewer bugs.

You are allowed to skip it. If you do it, the rule is: **the template must not
change.** The adapter goes in, the components stay exactly as they are.

---

## Step 1 of 5 — branch

```
git checkout -b s17-entity
```

WHY    this refactor touches the state shape. If it goes sideways at step 4, you
       want `git checkout main` to be a real option.

---

## Step 2 of 5 — change the state shape

In `types/feedState.interface.ts`, `data` is currently
`{articles: ArticleInterface[]; articlesCount: number} | null`. Replace it with
the adapter's state:

```ts
import {EntityState} from '@ngrx/entity'
import {ArticleInterface} from 'src/app/shared/types/article.interface'

export interface FeedDataInterface extends EntityState<ArticleInterface> {
  articlesCount: number
}

export interface FeedStateInterface {
  isLoading: boolean
  error: string | null
  data: FeedDataInterface | null
}
```

Note what stayed: `isLoading`, `error`, and `data` being nullable. The *outer*
shape of your slice is untouched — this is why the refactor is survivable.

---

## Step 3 of 5 — build the adapter

At the top of `feed/store/reducers.ts`:

```ts
import {createEntityAdapter} from '@ngrx/entity'

export const feedAdapter = createEntityAdapter<ArticleInterface>({
  selectId: (article) => article.slug,
})

const initialState: FeedStateInterface = {
  isLoading: false,
  error: null,
  data: null,
}
```

WHY `selectId: article.slug`   articles have no `id` field. The default adapter
assumes one; overriding `selectId` is the first thing to check when an adapter
"does nothing".

---

## Step 4 of 5 — rewrite the two handlers

`getFeedSuccess` becomes:

```ts
on(feedActions.getFeedSuccess, (state, action) => ({
  ...state,
  isLoading: false,
  data: feedAdapter.setAll(action.feed.articles, {
    articlesCount: action.feed.articlesCount,
  }),
})),
```

`updateArticleInList` (the S13 handler, the 12-line `map`) becomes:

```ts
on(feedActions.updateArticleInList, (state, action) => {
  if (!state.data) return state
  return {
    ...state,
    data: feedAdapter.updateOne(
      {id: action.article.slug, changes: action.article},
      state.data
    ),
  }
}),
```

Three lines where you had twelve. That is the entire argument for adapters, and
you earned the right to see it by writing the twelve first.

---

## Step 5 of 5 — keep the template working

`selectFeedData` must still return `{articles, articlesCount} | null`, because the
template and `feed.component.ts` read `data.articles`. Never break the template to
fit the store:

```ts
const {selectAll} = feedAdapter.getSelectors()

export const selectFeedData = createSelector(selectFeedState, (state) => {
  if (!state.data) return null
  return {
    articles: selectAll(state.data),
    articlesCount: state.data.articlesCount,
  }
})
```

WHY this line matters   it is the seam. The store's internal representation
changed completely; the component saw nothing. Being able to move that seam
without touching the UI is the difference between a store you can refactor and one
you are afraid of.

Then `selectIsLoading` / `selectError` from `createFeature` still work untouched,
because they read the outer fields.

---

## Verify

Do the whole app once: home feed, page 2, click a tag, favourite an article, open
an article, go back, delete nothing.

SEE    identical behaviour to before the branch — and in DevTools, the `feed.data`
       node now has `ids` and `entities` instead of `articles`, while the page looks
       exactly the same.

       Favourite the same article twice from the list and confirm the count does not
       drift: `updateOne` with the same slug cannot create a duplicate, whereas a
       buggy `map` + `unshift` can.

WHY    that duplicate check is the practical payoff: entity state cannot hold two
       copies of one slug. Array state can, and eventually will.

---

## If it doesn't work

- **Every article disappears** — `selectId` missing, so the adapter keyed by
  `undefined` and collapsed all rows into one.
- **Template error reading `.articles`** — step 5 skipped; `selectFeedData` is
  returning the raw entity state.
- **Pagination shows NaN pages** — `articlesCount` was dropped from the adapter
  state's extra fields (`setAll(articles, {articlesCount})`).
- **`updateOne` appears to do nothing** — the changes object must not be the full
  article *with* a different slug; you pass
  `{id: action.article.slug, changes: action.article}`.

## Done when

The app behaves exactly as before the branch, the template is unchanged, and
`git diff` on the components is empty.

That is the end of the guide. What is left is the interview version: explain, in
your own words, why `switchMap` in the feed effect, why the token is not in the
store, and why `selectIsAuthor` is a selector and not a component getter.
