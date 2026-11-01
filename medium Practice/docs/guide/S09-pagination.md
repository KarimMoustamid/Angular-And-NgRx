# S9 — pagination

**No code.** 10 minutes. Read two files, answer one question.

The feed works; this stage is about the fact that it works *without* the store
knowing anything about pagination.

---

## Step 1 of 3 — find the url

Open `src/app/shared/components/feed/feed.component.ts` and find where
`feedActions.getFeed(...)` is dispatched. Look at what it passes.

SEE    it passes a **whole url** — something like `/articles?limit=20&offset=0`.
       Not `{page: 2, limit: 20}`. A string that is already a complete API call.

WHY    the effect is a dumb pipe (S8 step 4). It fetches `action.url` and nothing
       else. All the decisions — which list, which page, which tag — were made by
       the component before the action existed.

---

## Step 2 of 3 — find the page count

Open `src/app/shared/components/pagination/`. It receives `total` (from
`data.articlesCount` in the store) and computes how many page links to show. It
emits a page number; the feed component turns that into a new url and dispatches
again.

SEE    the store never sees a page number. It stores `articlesCount`, and the
       component uses it for arithmetic.

WHY    this is the classic NgRx argument: *derived* values do not belong in the
       store. `articlesCount / limit = pages` is arithmetic, not state — put it in
       the store and you have two things to keep in sync. Put it in a component
       (or, from S14, in a selector) and it can never drift.

---

## Step 3 of 3 — answer this

Open DevTools and click page 2, then look at the action log.

**Question:** what is in `data` at the moment `Get feed` is dispatched, and what
is in it 200ms later?

Write the answer down. If the answer is "page 1 data, then page 2 data" you have
understood S8 steps 1–2, and you will immediately see why `switchMap` matters if
you click page 3 before page 2 has finished.

**Bonus, no code:** if a user reloads on page 3, where does "3" come from? Look at
the url bar and at `feed.component.ts`. Does the store need to remember it? What
would happen if it did?

---

## Done when

You can say why the store holds `articlesCount` but not `currentPage`, and why
`getFeed` carries a url instead of parameters.

Next: `docs/guide/S10-one-slice-three-routes.md` — reading stage.
