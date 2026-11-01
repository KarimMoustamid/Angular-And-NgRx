# S3 — the login effect

**File:** `src/app/auth/store/effects.ts` — the `loginEffect` (line ~78).

20 minutes. This is your first effect, so the file gives you the whole body.
Read the diagram at the top of `effects.ts` first — it is the point of the stage.

**What an effect is.** A reducer cannot call an API (impure). So something has to
sit between "the user clicked Login" and "state says we have a user", do the HTTP
call, and put the answer back into the store as another action. That something is
an effect: a function from action stream to action stream.

```
[auth] Login ──► reducer: isSubmitting = true
      │
      └──► effect: authService.login() ──► [auth] Login success ──► reducer: currentUser = user
                                       └──► [auth] Login failure ──► reducer: validationErrors = …
```

The component never touches `AuthService`. It dispatches and forgets.

---

## Step 1 of 5 — the shape, and why `switchMap`

The stub currently ends with:

```ts
ofType(authActions.login),
switchMap(() => EMPTY)
```

`EMPTY` = "an observable that emits nothing". Replace that line with:

```ts
switchMap(({request}) =>
  authService.login(request).pipe(
    map((currentUser) => {
      persistanceService.set('accessToken', currentUser.token)
      return authActions.loginSuccess({currentUser})
    })
  )
)
```

Save — the file must still compile. It does not work yet (no error handling), but
it type-checks.

WHY    three ideas, and only three:
       1. `switchMap` — the incoming action carries `{request}`; the function
          gets that payload and returns a *new* observable (the HTTP call).
          `switchMap` unwraps it: actions in, action results out.
       2. `map` — turns the API's `CurrentUser` into an `Action`. This is the
          "translate the answer" step. An effect's job is to emit actions; a raw
          user object would be an invalid action and NgRx would throw.
       3. `persistanceService.set(...)` — the impure side effect that a reducer
          is not allowed to do. Note it happens *inside* `map`, right before we
          return the action.

---

## Step 2 of 5 — catch the failure, in the right place

Add `catchError` **inside** the `.pipe(...)` of the HTTP call, after `map`:

```ts
switchMap(({request}) =>
  authService.login(request).pipe(
    map((currentUser) => {
      persistanceService.set('accessToken', currentUser.token)
      return authActions.loginSuccess({currentUser})
    }),
    catchError((errorResponse) =>
      of(authActions.loginFailure({errors: errorResponse.error.errors}))
    )
  )
)
```

WHY    the placement is the entire lesson. `catchError` replaces a failed stream
       with a good one — and if you put it *after* `switchMap` instead of inside,
       it replaces the outer stream too: one wrong password and the effect is
       dead until you reload the page. You would then "fix" it by reloading and
       never learn why.

       `of(...)` wraps the action back into an observable, because `catchError`
       must return an observable, not a plain object.

---

## Step 3 of 5 — try the happy path

`npm start` running. Go to http://localhost:4200/login and sign in with:

```
karim@example.com / password123
```

SEE    the navbar flips to `karim` + avatar, without a reload.
       DevTools action list shows, in this order:
       `[auth] Login` → `[auth] Login success`.

WHY    if the navbar flips but no action appears, you are looking at a stale
       DevTools instance. If `[auth] Login success` appears but the navbar does
       not flip, your S2.3 reducer handler is missing.

---

## Step 4 of 5 — try the failure path

Log out (or clear the token), then try `karim@example.com / wrongpass`.

SEE    the form shows the API's message ("email or password is invalid"), the
       spinner stops, and the action list shows `[auth] Login failure`.
       Critically: **you can try again immediately** — the effect is still alive.

WHY    that "can try again" is what the `catchError` placement buys you. Watch it
       work: submit a bad password twice in a row. Both attempts produce a
       `Login failure`.

---

## Step 5 of 5 — prove it to yourself

Temporarily delete the `catchError` block (keep a copy), save, and submit a bad
password, then a good one.

SEE    the second attempt does nothing at all. No action, no request in the
       Network tab.

WHY    that is the dead-effect failure mode, reproduced deliberately. Put the
       `catchError` back. Having *seen* it fail once, you will recognise it in
       three seconds next time.

---

## If it doesn't work

- **"Effect dispatched an invalid action"** — you returned the raw user object
  instead of `authActions.loginSuccess({currentUser})`.
- **Nothing happens on submit** — the component's `onSubmit` should dispatch
  `authActions.login({request: ...})`. Read `login.component.ts`; it is given.
  If the request never appears in the Network tab, the action never fired.
- **401 with a correct password** — check `api/server.js` is running on :3100
  and that `environment.ts` points at it.
- **Login works but a reload logs you out** — expected. There is no
  "remember me" until S5.

## Done when

Correct password logs you in with a navbar change and no reload; wrong password
shows the API's message and lets you retry immediately.

Next: `docs/guide/S04-register-effect.md`.
