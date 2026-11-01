# S11 — the article feature

**Files:** `src/app/article/store/reducers.ts`, `effects.ts` (and read
`selectors.ts`). 40 minutes.

First feature with **two** effects: one to load an article, one to delete it. The
reducers now have to distinguish "this article is loading" from "no article here"
— the same `undefined` vs `null` idea as S5, applied to a page.

Read the comment block at the top of `reducers.ts` first. It tells you what
`ArticleStateInterface` holds, and the stub comments tell you what each handler
must do. This stage is deliberately less spelled out than auth: you have all the
pieces.

---

## Step 1 of 7 — "article requested"

Handler for `articleActions.getArticle`.

`isLoading: true`, `error: null`, `data` untouched.

**Careful:** the state may currently hold a *different* article (you navigated from
one article to another). Deciding whether to clear `data` here is a real choice:
clear it → a flash of empty page between articles; keep it → you might render the
wrong article's body for a moment. The stub tells you which one this app expects.
Read it, then decide knowingly.

---

## Step 2 of 7 — "article arrived"

Handler for `getArticleSuccess`. `isLoading: false`, `data: action.article`.

WHY    one atomic object: title, body, author, favourites, tags. Half-updated
       article state is a rendering bug waiting to happen.

---

## Step 3 of 7 — "article failed"

Handler for `getArticleFailure`. `isLoading: false`, `error: '...'`, and
`data: undefined` — here you *do* clear it, unlike the feed.

WHY the difference    a feed with no data still has a pager and a title; the page
is still meaningful. An article that failed to load has no body at all — showing
the previous article's text under the new slug is worse than showing an error.

---

## Step 4 of 7 — "article deleted"

Handler for `deleteArticleSuccess`. What should the state be once the article no
longer exists?

Hint: the component navigates away after deleting (an effect does it). But state
is not navigation — decide what a store that says "here is an article that was
deleted" would do to a component that renders it for one frame too long.

---

## Step 5 of 7 — the load effect

`effects.ts`: `getArticleEffect`. The action carries a `slug`.

Same recipe (`ofType` → `switchMap` → `map` / `catchError` inside). One trap
specific to this one: **the slug**. `getArticle` carries `{slug}`, and the service
is `articleService.getArticle(slug)`.

---

## Step 6 of 7 — the delete effect

`deleteArticleEffect`, and then `redirectAfterDeleteEffect` if the stub has one.

The delete effect dispatches `deleteArticleSuccess`. The redirect effect listens
for that and navigates home — with `{dispatch: false}` (S4 step 4). If you forget
the flag, NgRx throws "@ngrx/effects: Effect dispatched an invalid action" the
moment you delete something.

---

## Step 7 of 7 — verify

Open an article from the feed.

SEE    title, body, author block, tag list, favourite button — real content.
       Actions: `[article] Get article` → `[article] Get article success`.

       Then: click the delete button (you must be the author — the seeded
       `karim` articles are yours). You land on the home page, the article is
       gone from the list, and the log shows
       `[article] Delete article` → `[article] Delete article success`.

       Then reload `http://localhost:4200/article/<deleted-slug>` directly.

WHY    that last check is the one people skip. A page reached by clicking has
       button state already resolved; a page reached by url has to work from
       nothing. If the second one breaks, your reducer assumes data that only
       existed because you navigated.

---

## If it doesn't work

- **Page renders the previous article** — you kept `data` on `getArticle` and
  never cleared it, or the component subscribes to a selector that ignores the
  slug.
- **Delete works but you stay on the deleted page** — the redirect effect is
  missing or lacks `dispatch: false`.
- **"Effect dispatched an invalid action" after delete** — `tap(() => router...)`
  returned `undefined`; add `{dispatch: false}`.
- **404 in the Network tab** — the slug is `undefined`; check
  `switchMap(({slug}) => ...)` destructuring, not `switchMap((slug) => ...)`.

## Done when

An article loads by click **and** by pasting its url, delete sends you home and
the article is gone from the list.

Next: `docs/guide/S12-profile-feature.md`.
