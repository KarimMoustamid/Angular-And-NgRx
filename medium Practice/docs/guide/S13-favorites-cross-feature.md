# S13 — favourites across two features

**Files:** `src/app/shared/components/addToFavorites/store/effects.ts`, plus the
feed and article reducers. 25 minutes.

The heart button exists in three places (feed card, article page, profile list)
and all three share one action. Saving a favourite changes a slice that belongs to
a *different* feature. This is the stage where "one feature, one slice" stops being
enough.

---

## Step 1 of 5 — one action, three buttons

Open `addToFavorites/store/actions.ts` and the component.

SEE    `addToFavorites` carries `{isFavorited, slug}`. One action, dispatched by
       the feed card, the article page and the profile list alike.

WHY    `isFavorited` is a boolean in the *action* because a heart is a toggle: the
       button already knows the current state, so it tells you what it wants.
       No "toggle" action that would need to read the store to decide. Counters
       and toggles are the two places where this matters most.

---

## Step 2 of 5 — the effect

`effects.ts`, replace `switchMap(() => EMPTY)`.

Shape: `ofType(addToFavoritesActions.addToFavorites)` →
`switchMap(({isFavorited, slug}) => ...)` → pick the service method by the boolean
(`addToFavorites(slug)` or `removeFromFavorites(slug)`) → `map` to success,
`catchError` to failure.

You will need a ternary or an `if` inside `switchMap`. Both fine. Note the service
returns `ArticleInterface` either way — the API answers with the whole updated
article, including the new `favoritesCount`. That is generous of it and you should
use it.

---

## Step 3 of 5 — the feed reducer learns a new trick

In `feed/store/reducers.ts`, the handler `updateArticleInList` already exists in
`actions.ts` and the handler slot in the reducer. Your job: make
`feedActions.updateArticleInList` replace **one article inside `data.articles`**
and leave everything else untouched.

Shape:

```ts
on(feedActions.updateArticleInList, (state, action) => {
  if (!state.data) return state
  return {
    ...state,
    data: {
      ...state.data,
      articles: state.data.articles.map((article) =>
        article.slug === action.article.slug ? action.article : article
      ),
    },
  }
})
```

Fill in the action name and the payload key from `actions.ts`; the `if (!state.data)
return state` guard is the interesting line — a reducer must never explode because
it ran before the first load.

---

## Step 4 of 5 — wire the effect to the other slices

An effect can dispatch any action, including actions from another feature.
That is the whole point of this stage: after the API answers, the favourites
effect dispatches `updateArticleInList` so the list you are looking at updates
without a refetch.

Implement it in one of these two ways and write down why you chose it:

- **A** — `switchMap` to the API, then `map` to `addToFavoritesSuccess`, and a
  *second* effect listening for that success action to dispatch
  `updateArticleInList`.
- **B** — `switchMap` to the API, then `map` to `updateArticleInList({article})`
  directly, and dispatch both actions with `concatMap`/`mergeMap` on `of(...)`.

A keeps effects small and one-action-in/one-action-out; B is fewer moving parts
but the effect now knows about another feature. Both exist in real codebases; A is
easier to test. Pick one, note it, move on.

---

## Step 5 of 5 — verify

Click a heart on a feed card.

SEE    the heart fills, the count increments, and — this is the check — the number
       changes **without the feed refetching**. Check the Network tab: one
       `POST /api/articles/<slug>/favorite`, no `GET /api/articles`.

WHY    two sources of truth for the same article exist while you look at it: the
       feed's copy and the article page's copy. If you only update one, navigating
       between them shows a stale count. Open the same article's page after
       favouriting from the list and check the button there — if it is stale, you
       have found exactly the bug this stage exists to prevent, and you will fix it
       by also updating `article.data` (a second handler, five lines).

---

## If it doesn't work

- **Both buttons dispatch the same service call** — your ternary reads the wrong
  variable or you destructured `{slug}` and forgot `isFavorited`.
- **Count changes but the card does not re-render** — you mutated
  `data.articles` in place (`article.isFavorited = …`) instead of returning a new
  array with `map`. NgRx will not detect an in-place change.
- **Everything breaks the moment you click a heart before the feed loads** —
  missing `if (!state.data) return state`.
- **Works on the list, stale on the article page** — see step 5's last paragraph.

## Done when

Favouriting from any list updates that list with no refetch, and the article page
agrees with the list when you navigate between them.

Next: `docs/guide/S14-selector-two-slices.md`.
