# S4 — the register effect

**File:** `src/app/auth/store/effects.ts` — `registerEffect` (~line 49) and
`redirectAfterRegisterEffect` (~line 107). 25 minutes.

You have already written this shape once (S3). This one is a copy with three
differences: no `tap`, a token to store, and a navigation afterwards.

---

## Step 1 of 5 — the request

Replace `switchMap(() => EMPTY)` in `registerEffect` with:

```ts
switchMap(({request}) =>
  authService.register(request).pipe(
    map((currentUser) => {
      persistanceService.set('accessToken', currentUser.token)
      return authActions.registerSuccess({currentUser})
    })
  )
)
```

WHY    the API answers registration with a full user object **including a
       token** — you are logged in the moment you register. So the token has to
       be saved here too, not only in the login effect.

SEE    it compiles; registration still does nothing useful (no `catchError` yet).

---

## Step 2 of 5 — the failure

Add, inside the same `.pipe(...)`, after `map`:

```ts
    catchError((errorResponse) =>
      of(authActions.registerFailure({errors: errorResponse.error.errors}))
    )
```

WHY    same placement rule as S3: inside `switchMap`, never after it. Register's
       errors are field-level (`{"email": ["has already been taken"]}`), which is
       exactly what the form's error list is designed to render.

---

## Step 3 of 5 — register a real user

http://localhost:4200/register — use something you have not used yet:

```
newuser@example.com / password123 / newuser
```

SEE    the action list shows `[auth] Register` → `[auth] Register success`,
       the navbar shows `newuser`.

       You stay on the register page — that is the next step, not a bug.

WHY    the store knows who you are. The router does not. Two separate concerns,
       two separate pieces of code. If this surprises you, that is the lesson:
       state and navigation are not the same thing.

---

## Step 4 of 5 — the redirect

`redirectAfterRegisterEffect` ends with `tap(() => undefined)`. Replace it:

```ts
tap(() => router.navigateByUrl('/'))
```

SEE    register again with another new email; this time the app lands on the
       home page by itself.

WHY    this is a *listener* effect: it dispatches nothing, it just does a side
       effect. That is why the effect has `{functional: true, dispatch: false}`.
       Remove `dispatch: false` and NgRx receives `undefined` from `tap` and
       throws "@ngrx/effects: Effect dispatched an invalid action".

Do not skip understanding this: `dispatch: false` is not a detail, it is the
declaration "my return value is not an action". Every effect that navigates or
uses `tap` as its last operator needs it.

---

## Step 5 of 5 — the duplicate-email path

Register `karim@example.com` again (it already exists in the API).

SEE    you stay on the form, and the form shows "email has already been taken"
       above the email field. Action list: `[auth] Register` then
       `[auth] Register failure`, and no navigation.

WHY    the 422 never becomes an exception the component has to catch: the effect
       turns it into `registerFailure`, S2 step 6 puts `errors` on state, and the
       given form component renders `validationErrors`. Trace that chain once,
       slowly — every feature in this app works the same way.

---

## If it doesn't work

- **Redirect fires but you land on a blank page** — check the route `/` exists in
  `app.routes.ts`. (It does. If it doesn't, you edited the wrong file.)
- **Registered but immediately logged out on reload** — the token was not saved,
  or S5 is not written yet. Both are expected until S5.
- **"Effect dispatched an invalid action"** — you returned the service response
  itself; wrap it in `authActions.registerSuccess({currentUser})`.
- **Same email registers twice** — the API is the source of truth; only
  `karim@example.com` and accounts you created exist. If duplicates succeed, check
  `api/server.js` is the one running on :3100.

## Done when

New user → navbar updates → app navigates home. Duplicate email → form shows the
API's message and you stay put.

Next: `docs/guide/S05-who-am-i-and-logout.md`.
