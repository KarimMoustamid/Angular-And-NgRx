# S2 — the auth reducer

**File:** `src/app/auth/store/reducers.ts` — 8 additions, all of them one line of
`on(...)` each. 45 minutes if you read as you go.

You already wrote step 5 of `docs/00-first-hour.md` (the `loginSuccess`
handler). If you skipped that file, do it first — it is where the mental model
comes from.

**The one rule.** A handler returns a *new* object built from the old one:

```ts
on(authActions.register, (state) => ({ ...state, isSubmitting: true }))
```

`...state` = "everything I am not touching". Never `state.isSubmitting = true`.
Never call an API from here. Never read the clock. Same input, same output.

**The one gotcha.** In `actions.ts` the events are written `'Register success'`,
but `createActionGroup` camelCases them, so in code the action is
`authActions.registerSuccess` — no brackets, no spaces. If you type
`authActions['Register success']` it is `undefined` and your handler silently
does nothing.

---

## Step 1 of 10 — read the worked example

Scroll to `on(authActions.login, ...)` — the handler that was given to you.

```ts
on(authActions.login, (state) => ({
  ...state,
  isSubmitting: true,
  validationErrors: null,
})),
```

WHY    two jobs in one handler: "a request is in flight" (`isSubmitting`) and
       "last attempt's errors are stale now, wipe them". Eight of the handlers
       below are variations on these two jobs.

SEE    nothing yet — this step is reading.

---

## Step 2 of 10 — register starts                    `TODO S2.1`

Replace the `// TODO S2.1` block with:

```ts
on(authActions.register, (state) => ({
  ...state,
  isSubmitting: true,
  validationErrors: null,
})),
```

SEE    dispatch by hand and watch it: DevTools → Dispatcher:

```json
{"type": "[auth] Register", "request": {"email": "x@y.z", "password": "p", "username": "x"}}
```

       `auth.isSubmitting` flips to `true`.

WHY    the action carries a `request` (see `actions.ts`), but this handler does
       not need it: it only records that something started. Handlers ignore
       payloads they do not use — perfectly normal.

---

## Step 3 of 10 — register succeeded                 `TODO S2.2`

```ts
on(authActions.registerSuccess, (state, action) => ({
  ...state,
  isSubmitting: false,
  currentUser: action.currentUser,
})),
```

SEE    dispatch `{"type": "[auth] Register success", "currentUser": {"id":1, "email":"a@b.c", "username":"ana", "token":"t"}}`
       → `currentUser` fills in, **and the navbar switches to "ana" with an
       avatar**. That second part is the interesting one: you never touched the
       navbar.

WHY    the navbar selects `selectCurrentUser`. One slice changed, the selector
       emitted, the component re-rendered. Nothing else in the app knows or cares
       who dispatched the action.

---

## Step 4 of 10 — login succeeded                    `TODO S2.3`

```ts
on(authActions.loginSuccess, (state, action) => ({
  ...state,
  isSubmitting: false,
  currentUser: action.currentUser,
})),
```

(If you did `docs/00-first-hour.md`, this is the one you already have.)

WHY    identical to step 3 with a different action, and that duplication is
       honest: two entry points, one outcome. Some teams collapse it with a
       shared helper function — try writing one later, it is a 4-line exercise.

---

## Step 5 of 10 — login failed                       `TODO S2.4`

```ts
on(authActions.loginFailure, (state, action) => ({
  ...state,
  isSubmitting: false,
  validationErrors: action.errors,
})),
```

SEE    `{"type": "[auth] Login failure", "errors": {"email": ["is invalid"]}}`
       → `auth.validationErrors` holds that object, `isSubmitting` back to false.

WHY    the 422 body from the API goes on state **verbatim**. The form renders it
       without knowing where it came from — no error-handling code in the
       component at all. That is the payoff of keeping errors in the store.

---

## Step 6 of 10 — register failed, without copy-paste   `TODO S2.4`

Register's failure payload is the same shape as login's. Rather than duplicating
the handler, add the action as an extra first argument:

```ts
on(authActions.loginFailure, authActions.registerFailure, (state, action) => ({
  ...state,
  isSubmitting: false,
  validationErrors: action.errors,
})),
```

SEE    `{"type": "[auth] Register failure", "errors": {"email": ["has already been taken"]}}`
       → same two fields change, one handler served both.

WHY    `on(...)` takes a list of action creators, then the handler. Same-state,
       same-shape events are the usual case for `success`/`failure` pairs. Note
       `action.errors` type-checks because both payloads are
       `BackendErrorsInterface`.

---

## Step 7 of 10 — "who am I?" starts                 `TODO S2.5`

```ts
on(authActions.getCurrentUser, (state) => ({
  ...state,
  isLoading: true,
})),
```

WHY    notice it uses `isLoading`, not `isSubmitting`. Two flags on purpose:
       - `isSubmitting` = a form is mid-submit (show a spinner *on the button*)
       - `isLoading`    = we are resolving who is logged in (show a spinner in
         the navbar, do not block the page)

       One flag for both would make the home page flash a spinner every time you
       click Login. This is the kind of decision interviewers poke at.

---

## Step 8 of 10 — "who am I?" answered               `TODO S2.6`

```ts
on(authActions.getCurrentUserSuccess, (state, action) => ({
  ...state,
  isLoading: false,
  currentUser: action.currentUser,
})),
```

WHY    `action.currentUser` is typed `CurrentUserInterface | null` here, and the
       `null` matters: "the API answered, nobody is logged in". Storing it means
       the navbar can now show Sign in / Sign up instead of nothing.

SEE    `{"type": "[auth] Get current user success", "currentUser": null}`
       → the navbar shows the Sign in / Sign up links.

---

## Step 9 of 10 — "who am I?" failed                 `TODO S2.7`

```ts
on(authActions.getCurrentUserFailure, (state) => ({
  ...state,
  isLoading: false,
})),
```

WHY    only the spinner stops. `currentUser` is left exactly as it was — we hit
       a network error, we did **not** learn that the user is logged out. Setting
       it to `null` here would log people out every time their wifi blinks.

SEE    dispatch `{"type": "[auth] Get current user failure"}` → `isLoading`
       false, `currentUser` unchanged.

---

## Step 10 of 10 — logout                            `TODO S2.8`

```ts
on(authActions.logout, (state) => ({
  ...state,
  currentUser: null,
})),
```

`null`, not `undefined`. Deliberate: `undefined` means "we have not asked yet",
and after a logout we know the answer.

Now the question this stage leaves you with — **decide and write down one line**:
should `isSubmitting` and `validationErrors` be reset here too?

Think about: you are on `/register`, typing, then you click Log out in the
navbar. What do you want the form to look like? There is no single right answer,
which is why you have to pick one and be able to defend it.

---

## If it doesn't work

- **Nothing changes when I dispatch.** Check the type string: `[auth] Login
  success`, lowercase `auth`, space before `success`. In code check you used
  `authActions.loginSuccess` and not `authActions['Login success']`.
- **The file doesn't compile.** Almost always a missing comma after `}),` or a
  handler placed outside `createReducer(...)`.
- **`action.currentUser` is a red squiggle.** You are on the wrong action —
  `currentUser` exists on `*Success` only, not on `register`/`login` (those carry
  `request`).

## Done when

Dispatching each of these by hand changes exactly the field the step says, and
nothing else: `Register` → submitting; `Register success` → user + navbar;
`Login failure` → errors; `Get current user success` (null) → Sign in links;
`Get current user failure` → spinner only; `Logout` → no user.

Next: `docs/guide/S03-login-effect.md` — the first effect.
