# The map (start here)

You are rebuilding a Medium clone's state layer in NgRx. The app already looks
finished — HTML, CSS, services and routes are done. What is missing is every
`on(...)` in the reducers and every `switchMap` in the effects, and those are
yours to write.

Nothing here asks you to be clever. Every step is: open one file, type the small
thing shown, look at the browser. If the browser shows what "SEE" says, go to the
next step. If it does not, stop — there is an "If it doesn't work" list at the
end of each file.

## The two rules

1. **One step at a time.** A step is small on purpose. If you understand a step
   in 30 seconds, that is the design working, not a sign you are slow.
2. **Never move on with a red or empty screen.** Every stage assumes the
   previous one works. This is the whole reason the app was built in this order.

## Run it

Two terminals, both in this folder:

```bash
npm run api     # the fake API on :3100
npm start       # the app on :4200
```

`npm start` needs Node 26. If you get a "Node.js version v22 detected" error:

```bash
PATH="$HOME/.nvm/versions/node/v26.13.0/bin:$PATH" npm start
```

## Your first sitting

`docs/00-first-hour.md` — about an hour, ends with you dispatching an action by
hand and watching state change. Do this one before anything else; it is the
mental model the rest of the course rides on.

## The stages

| stage | what you build | time | code given to you |
|-------|----------------|------|-------------------|
| [S1](guide/S01-look-at-the-store.md) | nothing — learn to look at the store | 10m | – |
| [S2](guide/S02-auth-reducer.md) | the auth reducer | 45m | full code |
| [S3](guide/S03-login-effect.md) | the login effect | 20m | full code |
| [S4](guide/S04-register-effect.md) | the register effect + redirect | 25m | full code |
| [S5](guide/S05-who-am-i-and-logout.md) | startup "who am I?", logout | 30m | full code |
| [S6](guide/S06-where-the-token-lives.md) | read only — the interceptor | 10m | – |
| [S7](guide/S07-popular-tags.md) | your first whole slice, alone | 25m | blanks |
| [S8](guide/S08-feed-slice.md) | the feed reducer + effect | 30m | blanks |
| [S9](guide/S09-pagination.md) | read only — page number in the URL | 10m | – |
| [S10](guide/S10-one-slice-three-routes.md) | read only — one slice, three routes | 10m | – |
| [S11](guide/S11-article-feature.md) | the article feature (lazy) | 40m | blanks |
| [S12](guide/S12-profile-feature.md) | the profile feature (lazy) | 25m | blanks |
| [S13](guide/S13-favorites-cross-feature.md) | favourites across two features | 25m | blanks |
| [S14](guide/S14-selector-two-slices.md) | a selector that needs two slices | 15m | blanks |
| [S15](guide/S15-tests.md) | reducer / selector / effect tests | 45m | blanks |
| [S16](guide/S16-meta-reducer.md) | a logging meta-reducer | 20m | new file |
| [S17](guide/S17-entity-adapter.md) | migrate the feed to @ngrx/entity | 40m | new code |

Tick them off in `docs/progress.md` — 76 small boxes, not 17 big ones.

## When something does not work

Ask in this order. It answers roughly ninety percent of NgRx bugs:

1. Was the action **dispatched**? (DevTools shows every action, even unhandled ones.)
2. Did a reducer **handle** it? (Did the state change in DevTools?)
3. Did the effect **fire**? (Network tab: was the request made?)
4. Is the selector **selecting** what I think? (DevTools → State tab, read the slice.)

## Redux DevTools shows "No store found"

The app is fine; the extension is not attached to that tab. In order:

1. Run `!!window.__REDUX_DEVTOOLS_EXTENSION__` in the browser console. `false`
   means the extension is not reaching the page — reload the tab, then check
   chrome://extensions → Redux DevTools → Details → Site access → "On all sites".
2. `true`? Reload the tab and pick **Medium Practice** in the panel's instance
   dropdown (top-left).
3. The panel belongs to one tab. If you have it open on another window or on a
   tab left over from before you restarted `npm start`, it says exactly this.

No extension and no patience? Do stage S16 early: it is a 15-line meta-reducer
that `console.log`s every action and its state change, and it needs no extension
at all.

## Reference material

- `docs/cheatsheet.md` — one screen of NgRx syntax, when you forget a shape.
- `../medium Reference/` — a finished, older version of the same app. Do not
  copy from it while a stage is in front of you. Copy from it *after* your
  stage works, and compare.
