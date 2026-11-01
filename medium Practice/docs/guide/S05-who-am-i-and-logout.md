# S5 — "who am I?" and logout

**Files:** `src/app/auth/store/effects.ts` (`getCurrentUserEffect` ~137,
`logoutEffect` ~162) and `src/app/shared/components/topBar/`. 30 minutes.

This is the stage that makes the app stop forgetting you on reload. It is also
the first place where you have to *decide* something rather than copy a pattern.

---

## Step 1 of 7 — three cases, three answers

`app.ts` dispatches `authActions.getCurrentUser()` in its constructor, so this
runs on every app start and every reload. There are exactly three situations:

```
no token in localStorage   ->  nobody is logged in. Do NOT call the API.
token, API answers 200     ->  here is the user.
token, API answers 401     ->  the token is dead. Drop it, nobody is logged in.
```

The store distinguishes "not asked yet" (`undefined`) from "asked, nobody"
(`null`). Which of the three cases is a *failure*? Only the third and fourth if
the network dies — keep that thought for step 3.

---

## Step 2 of 7 — the no-token case

Replace `switchMap(() => EMPTY)` in `getCurrentUserEffect` with:

```ts
switchMap(() => {
  const token = persistanceService.get('accessToken')

  if (!token) {
    return of(authActions.getCurrentUserSuccess({currentUser: null}))
  }

  return authService.getCurrentUser().pipe()
})
```

SEE    reload the page (you are logged out at this point — nothing in storage).
       The navbar now shows **Sign in** and **Sign up** instead of nothing.

WHY    `of(action)` is an observable that emits exactly one action — the smallest
       possible effect result. The important part is the choice:
       `getCurrentUserSuccess({currentUser: null})`, **not**
       `getCurrentUserFailure()`. Nothing failed; we simply have no token. Using
       `failure` here leaves `currentUser: undefined` (S2 step 9), the navbar
       shows neither block, and the Sign in links never appear.

       Rule of thumb: an action name should describe what happened, and "we
       looked, nobody is here" is a success.

---

## Step 3 of 7 — the API case

Inside the `.pipe()` that is currently empty, add:

```ts
    map((currentUser) => authActions.getCurrentUserSuccess({currentUser})),
    catchError((errorResponse) => {
      if (errorResponse.status === 401) {
        persistanceService.set('accessToken', null)
        return of(authActions.getCurrentUserSuccess({currentUser: null}))
      }
      return of(authActions.getCurrentUserFailure())
    })
```

WHY    two different kinds of bad news, two different actions:
       - **401** — the server answered clearly: this token is not valid. We know
         the answer, so it is a *success* with `null`, and we delete the dead
         token so it stops being sent.
       - **anything else** (offline, 500) — we do not know who you are. That is a
         real failure, and S2 step 9 leaves `currentUser` alone. Reloading with
         flaky wifi should not log you out.

       This is why both actions exist. Most tutorials use only one and then get
       the offline case wrong.

---

## Step 4 of 7 — reload while logged in

Log in (S3 works now), then press F5.

SEE    you are still logged in: navbar keeps your avatar, and it never flashes
       "Sign in / Sign up" on the way. Network tab shows one `GET /api/user`
       returning 200.

WHY    that absence of a flash is the `undefined` vs `null` design paying off.
       On boot `currentUser` is `undefined` (no block renders), then becomes the
       user. Neither state is `null`, so the signed-out links never appear.

---

## Step 5 of 7 — the logout effect

In `logoutEffect`, replace `tap(() => undefined)` with:

```ts
tap(() => {
  persistanceService.set('accessToken', null)
  router.navigateByUrl('/')
})
```

WHY    the store part is already handled by the reducer (S2 step 10 sets
       `currentUser: null`). What the effect adds is the impure half: the token on
       disk and the navigation. Skip the token deletion and reload — you are back
       in, which looks exactly like "logout doesn't work".

---

## Step 6 of 7 — the button

Nothing dispatches `logout` yet. Two small edits.

`src/app/shared/components/topBar/topBar.component.html` — inside the
`<ng-container *ngIf="currentUser$ | async as currentUser">`, after the profile
link's `</li>`, add:

```html
        <li class="nav-item">
          <a class="nav-link" (click)="logout()">
            <i class="ion-log-out"></i> Log out
          </a>
        </li>
```

`src/app/shared/components/topBar/topBar.component.ts` — add the import and the
method:

```ts
import {authActions} from '../../../auth/store/actions';
```

```ts
  logout(): void {
    this.store.dispatch(authActions.logout());
  }
```

SEE    signed in, the navbar has a "Log out" item. Click it: you are on the home
       page, the navbar shows Sign in / Sign up.

WHY    the component does not know what logging out *means* — it dispatches and
       forgets. The reducer sets the state, the effect clears the token and
       navigates. Every button in a well-built NgRx app looks this boring.

---

## Step 7 of 7 — the reload test that catches the classic bug

Log in, then log out, then reload.

SEE    you are still logged out.

WHY    if you are logged back in, the effect did not delete the token — step 5.
       This single reload is the test that separates "logout looks right" from
       "logout is right".

---

## If it doesn't work

- **Navbar never shows Sign in / Sign up when logged out** — you returned
  `getCurrentUserFailure()` in the no-token branch instead of
  `getCurrentUserSuccess({currentUser: null})`.
- **`GET /api/user` fires even with no token** — the early return is missing, or
  it is after the API call.
- **`errorResponse.status` is a red squiggle** — type the callback parameter as
  `HttpErrorResponse` (import from `@angular/common/http`).
- **Log out button does nothing** — check the `(click)` is inside the
  `*ngIf` block that only renders when a user exists, and that `logout()` is a
  method on the class, not a property.

## Done when

Reload while logged in → still logged in, no flash. Log out → home page, token
gone from localStorage, and a reload keeps you out.

Next: `docs/guide/S06-where-the-token-lives.md` — a short reading stage, no code.
