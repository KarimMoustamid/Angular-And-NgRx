# S6 — where the token lives

**No code.** 10 minutes, two files to read, four questions to answer out loud.
This stage exists because the next twelve stages all assume you know it, and
almost every NgRx bug report in the wild starts here.

---

## Step 1 of 3 — read the wrapper

`src/app/core/persistance.service.ts` — 30 lines: a `set` and a `get` around
`localStorage`, both wrapped in try/catch.

WHY it exists    `localStorage` does not exist on a server, and `JSON.parse`
                 throws on garbage. Two problems, one place.

---

## Step 2 of 3 — read the interceptor

`src/app/core/auth.interceptor.ts` — every outgoing HTTP request gets

```
Authorization: Bearer <token from localStorage>
```

WHY it matters   this is *how* `GET /api/user` can answer "who am I?" at all.
                 `AuthService.getCurrentUser()` sends no user id, no email — only
                 that header. The token IS the identity.

---

## Step 3 of 3 — answer these four questions

Write your answers as comments at the top of `auth/store/effects.ts`. Nobody
grades them; you will re-read them in three weeks.

**1. The token is in localStorage, not in the store. Why?**
Consider: the interceptor is a plain function that runs before the app's state
exists. Consider also: reload. The store starts empty on every boot — if the
token lived only there, the first request after a reload would go out
unauthenticated and you would be logged out.

**2. What breaks if you put the token in the store instead?**
Be concrete: name the request that fails and when.

**3. Is `currentUser.token` in the store the same thing?**
It is in `auth.currentUser.token` too (S2 step 3 puts the whole user there). Now
the same secret exists in two places. Which one does the interceptor read, and
what happens if they disagree?

**4. What is actually in the token?**
Read `api/server.js` (search for `token`) or paste a token into
https://jwt.io. It is not encrypted — it is signed. So: is it safe to keep a
permission flag in there? What would you keep in it?

---

## Done when

You can explain, without notes, the sentence: *"the store is how the page
remembers, localStorage is how the browser remembers across reloads, and the
token is the only thing that has to survive both."*

Next: `docs/guide/S07-popular-tags.md` — the first slice with no hand-holding.
