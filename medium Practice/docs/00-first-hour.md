# Your first hour

Goal: by the end of this file you have dispatched an action by hand, watched it
change state, and watched the navbar react to that state. No HTTP, no effects,
no API. Just the loop everything else is built on.

If you only do one thing today, do this file.

---

## Step 1 of 9 — start the app

Two terminals in this folder:

```bash
npm run api     # :3100
npm start       # :4200
```

Node 26 needed. If `npm start` complains about v22:

```bash
PATH="$HOME/.nvm/versions/node/v26.13.0/bin:$PATH" npm start
```

SEE    http://localhost:4200 loads: a green banner, an empty article list,
       a "Popular Tags" box on the right with nothing in it, and a navbar with
       only "medium" and "Home".

WHY    nothing is broken. Every list on screen comes from a slice that has no
       reducer logic yet, so it is empty by design.

---

## Step 2 of 9 — open Redux DevTools

Open the browser's DevTools (F12), find the **Redux** tab, and pick
**Medium Practice** in the instance dropdown at the top-left.

SEE    a state tree with four slices: `auth`, `feed`, `popularTags`, `router`.

WHY    `app.config.ts` registers them: `provideStore({router: routerReducer})`
       creates the store, `provideState(feedFeature)` mounts the `feed` slice,
       `provideState(popularTagsFeature)` mounts `popularTags`. The `router`
       slice is a copy of the current URL.

If you see "No store found", it is the extension, not the app — see the last
section of `docs/build-guide.md`.

---

## Step 3 of 9 — read the state of `auth`

Click `auth` in the state tree. You should see:

```json
{
  "isSubmitting": false,
  "currentUser": undefined,
  "isLoading": false,
  "validationErrors": null
}
```

WHY    `currentUser: undefined` means "we never asked the API". `null` will mean
       "we asked, nobody is logged in". Those are different answers, and keeping
       them apart is why the navbar does not flash "Sign in" on every reload.

SEE    the navbar shows neither the user block nor the "Sign in / Sign up"
       links. `undefined` renders nothing. Correct, for now.

---

## Step 4 of 9 — dispatch an action by hand

In the DevTools **Dispatcher** box at the bottom, paste this and press Dispatch:

```json
{"type": "[auth] Login success", "currentUser": {"id": 1, "email": "a@b.c", "username": "someone", "token": "t"}}
```

SEE    the action appears in the action list on the left, and `auth` still reads
       exactly the same as before. `currentUser` is still `undefined`.

WHY    this is the single most important thing in NgRx: **the reducer had no
       handler for that action, so the state did not change, and nothing
       complained.** NgRx never tells you "nobody handled this". DevTools does.

The action type is `[auth] Login success` because `createActionGroup` turns
`source: 'auth'` + `'Login success'` into that string. Note the camelCase in
code (`authActions.loginSuccess`) versus the readable type on the wire — same
action, two spellings.

---

## Step 5 of 9 — your first handler (write it)

FILE  src/app/auth/store/reducers.ts

Scroll to the comment `TODO S2.3 — login succeeded` (around line 68). Replace
that comment line with:

```ts
on(authActions.loginSuccess, (state, action) => ({
  ...state,
  isSubmitting: false,
  currentUser: action.currentUser,
})),
```

WHY   `...state` copies the fields you are not touching. `on(...)` returns a new
      object — never mutate `state`. `action.currentUser` is the payload the
      action carried.

Save. The dev server rebuilds by itself; the browser reloads.

---

## Step 6 of 9 — dispatch it again

Same JSON as step 4, Dispatch again.

SEE    `auth.currentUser` fills in with `someone`, and the navbar switches from
       nothing to an avatar and the name `someone`.

WHY    that is the whole loop: action → reducer → new state → selector emits →
       component re-renders. You did it with no service, no event, no @Output.

---

## Step 7 of 9 — break it on purpose

Change the JSON's `type` to `"[auth] Login"` and dispatch again.

SEE    `isSubmitting` becomes `true` — because `login` already has a handler in
       that file (the worked example sitting above your TODO). Nothing else
       moves. A spinner on the login button reads exactly that flag.

WHY    two different actions, two different handlers, two different effects on
       the same state. That is all a reducer is: a switch statement with a
       better memory.

---

## Step 8 of 9 — time travel

Hover the action list and click the ⏪ arrow on an earlier entry.

SEE    the state goes back to what it was, and the navbar goes back to `someone`
       or to nothing.

WHY    this only works because reducers are pure functions of (state, action).
       Mutating state breaks time travel — that is the practical reason for the
       rule, not dogma.

---

## Step 9 of 9 — reload and notice what you lost

Refresh the page.

SEE    `auth.currentUser` is `undefined` again, the navbar shows nothing. The
       name you faked is gone.

WHY    the store lives in memory. Surviving a reload is a separate problem —
       that is what the token, S5 and S16 are about.

**You are done with the first hour.** You now know: what a slice is, what an
action is, what a reducer does, how to read state, and how to debug a handler
that isn't there.

Next: `docs/guide/S02-auth-reducer.md` — the other seven handlers of that same
file, with the code for each one.
