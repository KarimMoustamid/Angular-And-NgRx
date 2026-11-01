# Progress

Tick a box only when the browser showed what the step's SEE line said.
76 boxes. Most take one to five minutes; none take more than half an hour.

## S1 — learn to look at the store  (10m)
- [ ] 1. See the four slices in DevTools
- [ ] 2. Read `auth`: `undefined` vs `null`
- [ ] 3. Dispatch an unhandled action, state does not move

## S2 — the auth reducer  (45m)
- [ ] 1. Read the worked example (`login`)
- [ ] 2. `register` → submitting, clear old errors  · TODO S2.1
- [ ] 3. `registerSuccess` → store the user  · TODO S2.2
- [ ] 4. `loginSuccess` → store the user  · TODO S2.3
- [ ] 5. `loginFailure` → errors on state  · TODO S2.4
- [ ] 6. `registerFailure` → same handler, second action  · TODO S2.4
- [ ] 7. `getCurrentUser` → loading  · TODO S2.5
- [ ] 8. `getCurrentUserSuccess` → loading off, user in  · TODO S2.6
- [ ] 9. `getCurrentUserFailure` → loading off only  · TODO S2.7
- [ ] 10. `logout` → `currentUser: null`  · TODO S2.8

## S3 — the login effect  (20m)
- [ ] 1. The shape: why `switchMap`
- [ ] 2. `catchError` in the right place
- [ ] 3. Happy path: navbar flips by itself
- [ ] 4. Failure path: wrong password shows the error
- [ ] 5. Prove it: one request, not two

## S4 — the register effect  (25m)
- [ ] 1. The request
- [ ] 2. The failure
- [ ] 3. Register a real user end to end
- [ ] 4. The redirect (`dispatch: false`)
- [ ] 5. Duplicate email: the 422 lands on the form

## S5 — "who am I?" and logout  (30m)
- [ ] 1. Three cases, three answers (read)
- [ ] 2. No token → `currentUser: null`, no HTTP call
- [ ] 3. Token → call the API; 401 → drop the token
- [ ] 4. Reload while logged in: still logged in
- [ ] 5. The logout effect clears the token + navigates
- [ ] 6. Add the Log out button to the navbar
- [ ] 7. The reload test that catches the classic bug

## S6 — where the token lives  (10m, read only)
- [ ] 1. Read `persistance.service.ts`
- [ ] 2. Read the interceptor
- [ ] 3. Answer the four questions

## S7 — popular tags  (25m)
- [ ] 1. "tags requested"
- [ ] 2. "tags arrived"
- [ ] 3. "tags failed"
- [ ] 4. The effect
- [ ] 5. Verify in the browser

## S8 — the feed slice  (30m)
- [ ] 1. "feed requested" (keep the old list)
- [ ] 2. "feed arrived"
- [ ] 3. "feed failed"
- [ ] 4. The effect
- [ ] 5. Verify

## S9 — pagination  (10m, read only)
- [ ] 1. Find the url
- [ ] 2. Find the page count
- [ ] 3. Answer: why is the page in the URL, not the store?

## S10 — one slice, three routes  (10m, read only)
- [ ] 1. Put the three routes side by side
- [ ] 2. Watch it in the action log
- [ ] 3. Answer: what breaks with one slice per route?

## S11 — the article feature  (40m)
- [ ] 1. "article requested"
- [ ] 2. "article arrived" …
- [ ] 3. … "article failed"
- [ ] 4. `deleteArticleSuccess` (think before typing)
- [ ] 5. The load effect
- [ ] 6. The delete effect + navigate home
- [ ] 7. Click a title, then delete it

## S12 — the profile feature  (25m)
- [ ] 1. "profile requested"
- [ ] 2. "profile arrived"
- [ ] 3. "profile failed"
- [ ] 4. The effect
- [ ] 5. `/profiles/karim` renders

## S13 — favourites across two features  (25m)
- [ ] 1. One action, three buttons (read)
- [ ] 2. The effect
- [ ] 3. The feed reducer learns a new trick
- [ ] 4. Wire the effect to the other slices
- [ ] 5. Verify: heart red, count +1, no reload

## S14 — a selector that needs two slices  (15m)
- [ ] 1. Write the condition
- [ ] 2. Check memoization
- [ ] 3. See it in the page (delete button, own article only)

## S15 — tests  (45m)
- [ ] 1. A reducer test
- [ ] 2. A selector test (two slices)
- [ ] 3. Run them: green
- [ ] 4. An effect test (stretch)

## S16 — a logging meta-reducer  (20m)
- [ ] 1. Write it
- [ ] 2. Register it in `provideStore`
- [ ] 3. Verify: every action logged with prev/next state

## S17 — entity adapter (optional)  (40m)
- [ ] 1. Branch first
- [ ] 2. Change the state shape
- [ ] 3. Build the adapter
- [ ] 4. Rewrite the two handlers
- [ ] 5. Keep the template working
