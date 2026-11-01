# S7 — popular tags (first feature on your own)

**Files:** `src/app/shared/components/popularTags/store/reducers.ts` and
`effects.ts`. 25 minutes.

From here on, the guide gives you the *shape* and the checks, not the finished
code. That is not laziness — it is the difference between reading NgRx and being
able to write it. This feature is the smallest in the app on purpose: three
handlers and one effect, the exact same shape you wrote twice for auth.

Everything you need is in the two files you already wrote:
`auth/store/reducers.ts` (for the handlers) and `auth/store/effects.ts` (for the
effect). Scroll up before you scroll down.

---

## Step 1 of 5 — "tags requested"

In `reducers.ts`, replace `// TODO S7.1` with a handler for
`popularTagsActions.getPopularTags`.

Shape: `on(...)` → returns `{...state, isLoading: ?, error: ?}`.

Two things to get right, and both are decisions you already made in auth:
- what should `isLoading` be?
- should `error` be left alone, or cleared?

Note the file currently ends `createReducer(initialState` with **no comma**. Your
first handler needs a comma *before* it or after `initialState` — pick a style and
keep it for all three.

---

## Step 2 of 5 — "tags arrived"

Handler for `getPopularTagsSuccess`.

Shape: `on(..., (state, action) => ({...state, isLoading: ?, data: ?}))`

The payload key is `popularTags` — check `actions.ts`, do not guess. It goes into
`state.data`, not onto the state directly (`PopularTagsStateInterface` has exactly
three fields: `isLoading`, `error`, `data`).

WHY `data` and not spread   one atomic value: either you have the whole list or
you have `null`. Never a half-updated list.

---

## Step 3 of 5 — "tags failed"

Handler for `getPopularTagsFailure`.

This action carries **no payload** (look at `actions.ts`: `emptyProps()`). So
`error` gets a string you invent. Options: a generic
`'Popular tags could not be loaded'`, or change the action to carry the HTTP
error and use it.

If you change the action, do it in `actions.ts` and say in one comment line why.
Both are defensible; what is not defensible is `error: action.error` when the
action has no `error`.

---

## Step 4 of 5 — the effect

`effects.ts`, replace `switchMap(() => EMPTY)`. The service method is
`popularTagService.getPopularTags()` — no arguments.

You need three operators and you have used all three already:
`switchMap` (unwrap the call), `map` (service result → success action),
`catchError` (→ failure action, **inside** the `switchMap`, wrapped in `of(...)`).

If you write it from memory and compare afterwards, you are doing this right.
Reference: S3 step 1 and step 2.

---

## Step 5 of 5 — verify in the browser

The home page's right column shows Popular Tags. Reload the home page.

SEE    a list of tag pills (angular, ngrx, signals, …) instead of the empty
       state, and the action list shows `[popularTags] Get popular tags` →
       `[popularTags] Get popular tags success`.

       Click a tag: you go to `/tags/<tag>` and the article list filters.

WHY    the tags component did not change and the API did not change — only the
       slice went from "always empty" to "actually filled". That is a good habit
       to notice: the payoff of a store is that adding behaviour does not mean
       editing components.

---

## If it doesn't work

- **Empty state forever, no actions in DevTools** — the component dispatches
  `getPopularTags` on init; if nothing appears, the feature's reducer/effect is
  not registered in `app.config.ts`. Check `provideState(popularTagsFeature)` and
  `provideEffects({getPopularTagsEffect})`.
- **Action appears, state does not change** — handler written for the wrong
  action name (bracket syntax vs camelCase, S2's gotcha) or missing comma in
  `createReducer`.
- **State fills, pills still empty** — the selector is fine; check the template
  isn't reading a different field.
- **Network 401** — you are not logged in and the endpoint needs auth. Log in
  first (S3).

## Done when

Reload the home page: real tag pills, three actions in the log (request,
success), and clicking a pill filters the feed.

Next: `docs/guide/S08-feed-slice.md`.
