# S8 — the feed slice

**Files:** `src/app/shared/components/feed/store/reducers.ts` and `effects.ts`.
30 minutes.

Same recipe as S7, with one new idea: the state keeps the **last good answer**
while a new one loads. That single field is what separates a store that feels
fast from one that flashes.

Read the comment block at the top of `reducers.ts` before you start — it explains
the ordering the template depends on.

---

## Step 1 of 5 — "feed requested"

Handler for `feedActions.getFeed`.

`isLoading: true`, `error: null`, and **do not touch `data`** — this is the whole
point. The old articles stay on screen while the new page loads.

Notice `getFeed` carries a `url` payload. The reducer does not use it. That is
fine: reducers take what they need.

---

## Step 2 of 5 — "feed arrived"

Handler for `feedActions.getFeedSuccess`.

`isLoading: false`, `data: action.feed`. Check the payload key in `actions.ts`.

WHY not spread   `data` holds `{articles, articlesCount}` as one unit. If you
spread it into the state you get `state.articles` and `state.articlesCount` that
can disagree — e.g. 20 articles but a count of 0, which breaks the page numbers.
Atomic beats convenient.

---

## Step 3 of 5 — "feed failed"

Handler for `getFeedFailure`. The action carries **no payload** (check
`actions.ts`), so `error` gets a short string you write yourself.

`isLoading: false`, `error: '...'`, `data` **unchanged** — a failed request is not
an empty list. If you set `data: null` here, a dropped connection wipes the
articles the user was reading.

---

## Step 4 of 5 — the effect

`effects.ts`, replace `switchMap(() => EMPTY)`. This one differs from every
effect you have written so far in exactly one way: the action carries the url.

```ts
switchMap(({url}) => ...)
```

Two questions the stub asks, and you should be able to answer both before you
move on:

- **why `switchMap` and not `mergeMap`?** Click page 2, then page 3 quickly. With
  `mergeMap` both responses arrive and whoever is slower wins the display — you
  can end up looking at page 2 while the pager says 3. `switchMap` cancels the
  outdated request.
- **why is `catchError` inside?** Same trap as S3. Outside, your first failed
  request ends the effect for the rest of the session.

---

## Step 5 of 5 — verify

Home page, logged in.

SEE    a list of article previews with author, date, favourite count, tags.
       Actions: `[feed] Get feed` → `[feed] Get feed success`.

       Now the interesting test: click page 2 and watch the DevTools state
       *during* the request — `isLoading` is `true` **and** `data` still holds
       page 1's articles. The screen does not go blank.

WHY    if you had cleared `data` in step 1, you would see a spinner and an empty
       page. Both designs "work"; only one feels like a finished product. Interview
       answer: "keep the previous data, show a loading indicator, swap when the
       new data arrives."

---

## If it doesn't work

- **List renders but every card is empty** — `data` is set to `action.feed` but
  the template reads `data.articles`; check `GetFeedResponseInterface`.
- **Spinner forever** — success handler never fires: `catchError` is swallowing it
  (returning the failure action from the same pipeline), or the payload key is
  wrong so the action never matches `ofType`.
- **`[feed] Get feed` fires twice** — the component dispatches on init and again
  on a route change; that is expected behaviour for now and S10 explains it.
- **"Cannot read properties of null (reading articles)"** — the template reads
  `data.articles` before `data` exists; the given template guards with
  `*ngIf`. If you edited it, restore the guard.

## Done when

Articles appear on the home page, pagination links work, and clicking a page
keeps the old list visible while the new one loads.

Next: `docs/guide/S09-pagination.md` — reading stage.
