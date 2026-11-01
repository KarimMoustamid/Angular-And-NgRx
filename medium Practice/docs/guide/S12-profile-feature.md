# S12 — the profile feature

**Files:** `src/app/userProfile/store/reducers.ts`, `effects.ts`. 25 minutes.

This is S11 with the serial numbers filed off: load one thing by a `username`
instead of a `slug`. It should take you half the time. If it takes the same time,
re-read S11 before moving on — the goal is not to finish, it is to stop needing
the recipe.

---

## Step 1 of 5 — "profile requested"

Handler for `userProfileActions.getUserProfile`: `isLoading: true`, `error: null`.
Same choice as S11 step 1 about `data` — read the stub's comment and be consistent
with what you decided there.

---

## Step 2 of 5 — "profile arrived"

Handler for `getUserProfileSuccess`: `isLoading: false`, `data: action.userProfile`.

The payload key is `userProfile` (check `actions.ts`). `UserProfileInterface` is not
`CurrentUserInterface`: it has no token — a profile is public data, a user is you.

---

## Step 3 of 5 — "profile failed"

Handler for `getUserProfileFailure`. `isLoading: false`, `error: '...'`, and treat
`data` the way you did in S11 step 3.

---

## Step 4 of 5 — the effect

`getUserProfileEffect`: `ofType` → `switchMap(({slug}) => ...)` →
`userProfileService.getUserProfile(slug)` → `map` success / `catchError`
failure inside.

Why `switchMap` here too: click one author, then another, before the first
request finishes. `switchMap` cancels the stale request; you always render the
profile you last asked for.

---

## Step 5 of 5 — verify

From the home feed, click an author's name.

SEE    `/profile/<username>` shows the banner with the username, the article list
       of that author, the follower count, and a Follow button.
       Actions: `[userProfile] Get user profile` → success.

       Click a different author from the list underneath: the banner changes and
       the log shows a second request — the slice is reused, not duplicated.

WHY    compare the DevTools state tree now: `auth`, `popularTags`, `feed`,
       `article`, `userProfile`. Five slices, each owned by one feature, each
       registered where it lives. That tree is the map of the app.

---

## If it doesn't work

- **Profile page shows someone else's articles** — same slug/username bug: you
  destructured the wrong payload key in `switchMap`.
- **Follow button does nothing** — expected. Following lives in the profile
  feature in the reference app, but it is not part of this exercise; the button is
  rendered, wired to a stub. Note it and move on.
- **`GET /api/profiles/undefined`** — `switchMap(({username}) => ...)`.

## Done when

Any author's profile loads by clicking, loads by pasting the url, and switching
between authors shows the right banner each time.

Next: `docs/guide/S13-favorites-cross-feature.md` — the first effect that touches
two slices.
