# S16 — a meta-reducer

**New file:** `src/app/core/logger.metaReducer.ts` +
one line in `app.config.ts`. 20 minutes.

A meta-reducer wraps *every* reducer in the app. You are not changing what the
state does — you are intercepting the pipeline that computes it. This is the
mechanism behind persistence, undo/redo, action logging and state freezing.

Start with logging, because you can verify it instantly.

---

## Step 1 of 3 — write it

Create `src/app/core/logger.metaReducer.ts`:

```ts
import {ActionReducer, MetaReducer} from '@ngrx/store'

export function logger(reducer: ActionReducer<unknown>): ActionReducer<unknown> {
  return (state, action) => {
    const startedAt = performance.now()
    const nextState = reducer(state, action)
    const elapsed = Math.round(performance.now() - startedAt)

    console.groupCollapsed(`[ngrx] ${action.type} (${elapsed}ms)`)
    console.log('previous', state)
    console.log('next    ', nextState)
    console.log('changed ', state !== nextState)
    console.groupEnd()

    return nextState
  }
}

export const metaReducers: MetaReducer<unknown>[] = [logger]
```

The `changed` line is the one worth keeping. It teaches you the rule the whole
library depends on: if `state === nextState`, nothing re-renders. Most "my UI
doesn't update" bugs are a reducer that returned the same object (a mutation in
place, or an early `return state` you did not intend).

---

## Step 2 of 3 — register it

In `src/app/app.config.ts`, the store is created on line 42:

```ts
provideStore({router: routerReducer}),
```

Add the options object as the second argument:

```ts
provideStore({router: routerReducer}, {metaReducers}),
```

plus the import at the top:

```ts
import {metaReducers} from './core/logger.metaReducer'
```

WHY `provideStore` and not `provideState`   meta-reducers wrap the *whole* store.
Per-feature state only has `extraSelectors`; wrapping is a store-level concept.
That asymmetry is worth remembering — it is a favourite interview question.

---

## Step 3 of 3 — verify

Reload the app and open the browser Console (not DevTools — the normal console).

SEE    one collapsed group per action: `[ngrx] [feed] Get feed`,
       `[ngrx] [feed] Get feed success`, and so on. Inside: previous state, next
       state, and `changed false` for actions nothing listened to (for example
       `[router] Navigation` handled by another slice, or `@ngrx/store/init`).

WHY    `changed false` on an unrelated action is the proof that the reducer tree
       returns the same object reference and Angular skips re-rendering. That is
       the performance story of NgRx in one boolean.

Then delete the file's console calls (or keep the meta-reducer behind
`if (isDevMode())`). Logging every state snapshot in production is how you turn a
40ms interaction into a 400ms one.

---

## Optional — the same wrapper doing persistence

The wrapper you just wrote observes. The other classic job is hydration: a
meta-reducer that runs *before* the first reducer can hand it a saved state
instead of `undefined`.

```ts
export function storageMetaReducer(reducer: ActionReducer<any>) {
  return (state, action) => {
    if (state === undefined) {
      state = persistanceService.get('ngrxState') ?? undefined
    }
    const nextState = reducer(state, action)
    persistanceService.set('ngrxState', {auth: {currentUser: nextState.auth.currentUser}})
    return nextState
  }
}
```

Two honest warnings, both of which are the real interview answer:

- **Not everything should be persisted.** Here only `auth.currentUser` is written;
  feed lists are stale the moment you reload and belong in the network, not in
  localStorage. A whitelist is the whole design decision.
- **`currentUser` carries the token**, which the effect already stores under
  `accessToken`. Persisting both duplicates the secret in two places. That is why
  S6 matters: know which copy is authoritative before you copy it again.

Put it in the array next to the logger (`[logger, storageMetaReducer]`) and the
logger still runs first, so you see the hydration as a normal state transition.

---

## If it doesn't work

- **No groups in the console** — `metaReducers` not passed to `provideStore`, or
  the store was created in an older bundle: hard-reload the tab.
- **Everything logs but the app is slow** — expected: you are `console.log`ging the
  entire state tree on every action. Remove the two state logs, keep `action.type`.
- **TypeScript complains about `ActionReducer<unknown>`** — use
  `ActionReducer<any>` if your store's root state type is not unknown-friendly; it
  is a test-instrumentation file, and `any` here is defensible.

## Done when

Every action shows up in the console with a before/after state and a
`changed true|false` flag, and you can point at one action that changed nothing.

Next: `docs/guide/S17-entity-adapter.md` — optional, and the last stage.
