# S10 — one slice, three routes

**No code.** 10 minutes. Three small files to compare.

There are three article lists in this app — All, Your feed, and #tag — and they
share **one** store slice. This stage is where that stops being a coincidence
and becomes a design you can defend.

---

## Step 1 of 3 — put them side by side

Open and compare:

```
src/app/globalFeed/globalFeed.routes.ts
src/app/yourFeed/yourFeed.routes.ts
src/app/tagFeed/tagFeed.routes.ts
```

SEE    all three render the same `<mc-feed>` component. The difference is the url
       they hand it (`/articles`, `/articles/feed`, `/articles?tag=x`).

WHY    the *component* is the parameter. Same slice, same reducers, same effect,
       same selectors — a different input string. If you had written three
       slices, you would have written the same 60 lines three times and then had
       three places to fix every bug.

---

## Step 2 of 3 — watch it in the log

Navigate: home → "Your feed" tab → click a tag.

SEE    `[feed] Get feed` fires each time with a different `url` in the payload,
       and `data` is replaced wholesale. The state key never changes — there is
       only one `feed` slice in the store.

WHY    notice what this *costs*: switching tabs throws away the previous list, so
       going back to "All" refetches it. That is a deliberate trade — one list,
       always correct, a bit more network. The alternative (a cache per url) is
       real work; if an interviewer asks "how would you cache per tab?", the
       answer is a dictionary keyed by url, and it is the same shape as S17's
       entity adapter but keyed by route.

---

## Step 3 of 3 — answer this

**Question:** `Get feed` and `Get feed success` are shared by three routes. Which
component re-renders when the state changes, and how does the "Your feed" tab
know it is showing your feed rather than All?

Write it down. Then look at `feed.component.ts`: the url it dispatches comes from
an `@Input()`. The store knows nothing about which tab you are on — and that is
correct, because the tab is in the url bar, which is already the source of truth.

**Rule you can take to work:** if the router already knows it, do not copy it
into the store.

---

## Done when

You can explain why three routes did not need three slices, and can name the one
thing the store does *not* know (which tab is active).

Next: `docs/guide/S11-article-feature.md`.
