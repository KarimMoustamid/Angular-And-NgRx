# S1 — learn to look at the store

**Nothing to write.** 10 minutes. The skill you are building here is the one
that makes every later stage debuggable: reading state.

Files you may open: `src/app/app.config.ts`.

---

## Step 1 of 3 — see the slices

App running (`npm run api` + `npm start`), open http://localhost:4200, F12,
**Redux** tab, pick **Medium Practice** in the instance dropdown.

SEE    a state tree with `auth`, `feed`, `popularTags`, `router`.

WHY    `app.config.ts` line ~42: `provideStore({router: routerReducer})` creates
       the store and mounts the router slice, `provideState(feedFeature)` mounts
       `feed`, `provideState(popularTagsFeature)` mounts `popularTags`.
       `provideEffects([...])` adds no state — effects never hold state.

If the panel says "No store found": last section of `docs/build-guide.md`.

---

## Step 2 of 3 — read `auth`

Click `auth`.

```json
{ "isSubmitting": false, "currentUser": undefined, "isLoading": false, "validationErrors": null }
```

SEE    the navbar shows only "medium" and "Home" — no user block, no Sign in.

WHY    `undefined` = "we have not asked the API". `null` = "we asked, nobody is
       logged in". `{user}` = "here is the user".

       The navbar's two blocks are `*ngIf="currentUser$ | async as currentUser"`
       and `*ngIf="(currentUser$ | async) === null"`, so `undefined` matches
       neither. That is why you do not get a flash of "Sign in" on every reload
       of a logged-in session. Same value, three meanings, three different UIs.
       This is a design decision you will reuse in every app.

---

## Step 3 of 3 — dispatch something nobody handles

DevTools → **Dispatcher** box at the bottom → paste → Dispatch:

```json
{"type": "[auth] Whatever", "payload": 1}
```

SEE    the action appears in the list. The state does not move at all.

WHY    no reducer has a handler for it, so the state is unchanged — and nothing
       warns you. In NgRx an unhandled action is not an error, it is silence.
       Half of all "my store doesn't update" bugs are exactly this: a typo in the
       action, or a handler that was never added.

       Get in the habit: dispatch → look at the action list → look at the state.
       Three glances, five seconds.

---

## Think about it

1. Why does `router` appear in the store even though you never wrote a router
   reducer?
2. Which of the four slices would you delete if the app had no sidebar? (Look at
   what `popularTags` is used for before answering.)

Next: `docs/guide/S02-auth-reducer.md`.
