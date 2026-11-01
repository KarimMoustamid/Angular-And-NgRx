# Medium Practice — Angular 22 + NgRx 22

A rebuild of the RealWorld ("Medium clone") front end, with the state layer left
for you to write.

The point of this repo is **not** to build a Medium clone. The clone is the
excuse: it has exactly the three shapes every real app has — a list that changes
when you click something, a detail page that has to stay in sync with that list,
and a login that survives a page refresh. Those three shapes are where NgRx
either earns its place or gets in the way.

If you only want to read a finished NgRx app, `../medium Reference` is one
(Angular 16 + NgRx 16). This folder is the same app rebuilt in Angular 22 with
the store removed, so you can put it back.

---

## Run it

```bash
npm install          # once
npm run api          # terminal 1 — the local API on :3100
npm start            # terminal 2 — the app on :4200
```

Then open http://localhost:4200.

Log in with `karim@example.com` / `password123` (or `ana@example.com`, same
password). There are 12 seeded articles, so pagination has something to page.

`npm run dev` starts both in one terminal if you prefer (log output is mixed).

### What you should see on day one

The layout renders, the navbar renders, and the article list is **empty** —
because nothing is loading it yet. That is the starting line, not a bug. Articles
appear at stage S8.

### Where to start reading

Three files, in this order:

| File | What it is |
|------|-----------|
| `docs/build-guide.md` | one page: the map, the rules, how to use the rest |
| `docs/00-first-hour.md` | your first session — dispatch an action, watch state move |
| `docs/progress.md` | 76 checkboxes, one per micro-step |

Each stage then has its own file under `docs/guide/` (`S02-auth-reducer.md`,
`S03-login-effect.md`, …). One file ≈ one sitting.

---

## Folder map

```
api/                        the fake backend — read it, don't change it
  server.js                 node:http, no dependencies, in-memory
  data.js                   3 users, 12 articles

src/app/
  app.config.ts             provideStore/provideEffects/devtools  <- YOU uncomment
  app.routes.ts             all routes, all lazy
  app.ts                    shell: <mc-topbar> + <router-outlet>

  core/
    persistance.service.ts  localStorage wrapper          GIVEN
    auth.interceptor.ts     adds the Token header          GIVEN

  auth/
    services/auth.service.ts      HTTP calls               GIVEN
    store/actions.ts              the action list          GIVEN
    store/reducers.ts             S2  <- YOU
    store/effects.ts              S3-S5 <- YOU
    components/login, register    forms already wired to the store

  shared/
    types/                        every interface            GIVEN
    components/
      topBar, banner, tagList, pagination, errorMessage,
      backendErrorMessages, loading, addToFavorites/*.ts      GIVEN
      feed/
        services/feed.service.ts                             GIVEN
        store/{actions,selectors}.ts                         GIVEN
        store/{reducers,effects}.ts    S8  <- YOU
        feed.component.ts              GIVEN (read it at S9)
      popularTags/
        services/popularTag.service.ts                       GIVEN
        store/actions.ts                                     GIVEN
        store/{reducers,effects}.ts    S7  <- YOU (whole feature)
        popularTags.component.ts                             GIVEN
      addToFavorites/store/effects.ts  S13 <- YOU

  article/         S11 (+ S14 selector)      <- YOU
  userProfile/     S12                      <- YOU
  globalFeed/, yourFeed/, tagFeed/          GIVEN, thin wrappers
```

"GIVEN" means: it already works, it is not the exercise, and changing it will
not teach you NgRx. Comments that start with `GIVEN` explain why the file exists.

---

## The rules of this repo

1. **You write the store.** Reducers (pure functions), effects (side effects),
   selectors (derived state), and the wiring in `app.config.ts`.
2. **Do not touch the templates** to make them compile. They are written against
   the final state shape. If a template fights you, your state shape is wrong,
   not the template.
3. **No `any` in the store.** Every reducer has a typed state interface next to
   it. If you find yourself casting, re-read the interface.
4. **One stage at a time**, in the order of `docs/build-guide.md`. Each stage
   ends with something you can see in the browser. If you cannot see it, stop —
   the problem is in that stage, not the next one.

---

## The stages

| # | What you build | Files | You can see it when |
|---|----------------|-------|---------------------|
| S1 | orientation — dispatch a fake action in devtools | `app.config.ts` (read) | devtools shows the four slices |
| S2 | auth reducer | `auth/store/reducers.ts` | devtools shows `auth` reacting to actions |
| S3 | login effect | `auth/store/effects.ts` | the form logs you in for real |
| S4 | register effect | `auth/store/effects.ts` | signing up creates the user and lands on home |
| S5 | get-current-user + logout | `auth/store/effects.ts` | F5 keeps you logged in; logout clears the navbar |
| S6 | read the interceptor | `core/auth.interceptor.ts` | you can explain where the token comes from |
| S7 | popular tags (solo) | `popularTags/store/*` | the tag cloud appears on the right |
| S8 | feed reducer + effect | `feed/store/{reducers,effects}.ts` | ten article previews appear |
| S9 | pagination + why the page lives in the URL | `feed/feed.component.ts` (read) | clicking "2" loads ten more |
| S10 | one slice, three routes | `globalFeed/`, `yourFeed/`, `tagFeed/` (read) | `#ngrx` filters, /feed shows yours |
| S11 | article feature | `article/store/*` | clicking a title opens the article |
| S12 | profile feature | `userProfile/store/*` | `/profiles/karim` shows that author's articles |
| S13 | favourites, cross-feature | `addToFavorites/store/effects.ts` | the heart updates the row you clicked |
| S14 | cross-slice selector | `article/store/selectors.ts` | the delete button appears only on your article |
| S15 | tests | `*.spec.ts` | `npm test` is green |
| S16 | a meta-reducer (logging, then persistence) | `core/logger.metaReducer.ts` | every action, with prev/next state, in the console |
| S17 | entity adapter | `feed/store/*` | the feed holds `{ids, entities}` |

S1–S14 are in the code as `TODO S<n>` comments. S15–S17 have no stubs — you
create those files yourself; the stage file says what goes in them.

---

## How to check yourself

- **Redux DevTools** — install the extension, open it, watch actions arrive.
  `provideStoreDevtools({maxAge: 25, logOnly: false, trace: true})` shows the
  stack of every dispatch. That `trace` flag answers "who dispatched this twice?"
  and it is the single most useful debugging tool in this repo.
- **The Network tab** — after S8 there should be exactly one `GET /articles`
  per tab click. Two means an effect is subscribed twice. Zero means the
  component is not dispatching.
- **`npm test`** — after S15 you have reducer and selector tests that do not
  need a browser.
- **The reference app** — `../medium Reference/src/app` is the answer key. Read
  it *after* attempting a stage, not before. It is Angular 16, so the syntax
  differs (`switch` reducers, `concatMap` in effects, no `createFeature`); the
  ideas are identical.

---

## The API

`api/server.js` implements the subset of the RealWorld spec this app uses, with
the exact response shapes the templates expect.

| Method | Path | Notes |
|--------|------|-------|
| POST | `/api/users` | register — 422 on duplicate email |
| POST | `/api/users/login` | 422 with `errors.credentials` on bad password |
| GET | `/api/user` | needs `Authorization: Token <t>` |
| GET | `/api/articles?limit=&offset=&tag=&author=` | paginated |
| GET | `/api/articles/:slug` | detail |
| DELETE | `/api/articles/:slug` | 403 if it is not yours |
| POST/DELETE | `/api/articles/:slug/favorite` | returns the updated article |
| GET | `/api/tags` | every tag, sorted |
| GET | `/api/profiles/:username` | public profile |

**Fault injection** — the reason this API exists instead of the dead public one:

```bash
curl 'localhost:3100/api/articles?_fail=500'    # any request can 500
curl 'localhost:3100/api/articles?_delay=3000'  # any request can hang
curl -X POST localhost:3100/api/_control -d '{"fail":401}'   # globally
curl -X POST localhost:3100/api/_control -d '{"reset":true}'
```

Restarting the process resets all data.

---

## If you get stuck

1. Read the `TODO` comment again — most of them contain the recipe.
2. Check the observable in devtools. Is the action dispatched? Did it reach the
   reducer? Is the state what you think it is?
3. Only then open `../medium Reference`.
4. Ask. Bring the state tree, not the error message.
