# NgRx cheatsheet — the shapes, no prose

Everything here is reference. The build guide is where the explanations are.

## The five pieces

```
component  --dispatch-->  action  -->  reducer  -->  new state  -->  selector --> component
                                        (pure)                        (memoised)
                             |
                             +---------> effect --> HTTP/nav/storage --> more actions
```

- **action** = a thing that happened (past tense, `[Source] Event`)
- **reducer** = pure `(state, action) => state`
- **effect** = impure side effect that returns actions
- **selector** = memoised `state => derived value`
- **store** = the single object all of the above share

## Actions

```ts
import {createActionGroup, emptyProps, props} from '@ngrx/store'

export const feedActions = createActionGroup({
  source: 'Feed',
  events: {
    'Get feed': props<{url: string}>(),
    'Get feed success': props<{feed: GetFeedResponseInterface}>(),
    'Get feed failure': emptyProps(),
  },
})
```

Dispatch: `store.dispatch(feedActions.getFeed({url: '/articles'}))`
Type string: `'[Feed] Get feed'` — camelCase key becomes a space-separated name.

`props` vs `emptyProps`: if the payload is not there, do not invent it. An action
with `emptyProps()` is dispatched as `feedActions.getFeedFailure()`.

## Reducer + feature

```ts
export const feedFeature = createFeature({
  name: 'feed',
  reducer: createReducer(
    initialState,
    on(feedActions.getFeed, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(feedActions['Get feed success'], (state, {feed}) => ({
      ...state,
      isLoading: false,
      data: feed,
    }))
  ),
})
```

`createFeature` generates, from the interface's keys:
`selectFeedState`, `selectIsLoading`, `selectError`, `selectData`.

Rules: copy with `...state`; never mutate; clear errors when you start *and* when
you succeed; keep the previous good data while loading.

## Selectors

```ts
// same slice
const selectArticles = createSelector(selectData, (data) => data?.articles ?? [])

// two slices (composing other features' selectors)
export const selectIsAuthor = createSelector(
  selectCurrentUser,
  selectArticleData,
  (user, article) =>
    !!user && !!article && user.username === article.author.username
)
```

Memoisation: recomputes only when an input's **identity** changes. That is why
reducers return new objects, and why mutating state silently breaks selectors.

`store.select(selector)` returns an observable. In templates: `selector | async`.
In components: `toSignal(store.select(selector))`.

## Effects

```ts
export const getFeedEffect = createEffect(
  (actions$ = inject(Actions), feedService = inject(FeedService)) =>
    actions$.pipe(
      ofType(feedActions.getFeed),
      switchMap(({url}) =>
        feedService.getFeed(url).pipe(
          map((feed) => feedActions['Get feed success']({feed})),
          catchError(() => of(feedActions['Get feed failure']()))
        )
      )
    ),
  {functional: true}
)
```

- `catchError` **inside** `switchMap`, always.
- `dispatch: false` for effects that only navigate or log.
- `{functional: true}` — arrow form, no class, no decorator.

### Which flattening operator

| operator | use when |
|----------|----------|
| `switchMap` | latest wins: search, pagination, route params |
| `concatMap` | order matters, must not interleave: writes, deletes |
| `mergeMap` | all of them, order irrelevant |
| `exhaustMap` | ignore new ones while busy: form submit, "save" button |

### Reading state inside an effect

```ts
// modern
withLatestFrom(store.select(selectCurrentUser))
// or, cleaner, no extra subscription
concatLatestFrom(() => store.select(selectCurrentUser))
```

## Registration

```ts
// global (app.config.ts)
provideStore(),
provideState(authFeature),
provideEffects([loginEffect, registerEffect]),
provideStoreDevtools({maxAge: 25, logOnly: !isDevMode()}),

// lazy (feature.routes.ts)
providers: [provideState(articleFeature), provideEffects(getArticleEffect)],
```

Lazy slices disappear when you leave the route. Register a slice twice and you
get two listenable copies of every effect — the classic "why does my API get
called twice" bug.

## Entity adapter

```ts
const adapter = createEntityAdapter<ArticleInterface>({selectId: (a) => a.slug})
export const initialState = adapter.getInitialState({isLoading: false, error: null})

on(success, (state, {feed}) => adapter.setAll(feed.articles, {...state, isLoading: false}))
on(updateArticleInList, (state, {article}) =>
  adapter.updateOne({id: article.slug, changes: article}, state)
)

const {selectAll, selectEntities} = adapter.getSelectors()
```

`updateOne`, `addOne`, `upsertOne`, `removeOne`, `setAll` — all O(1) via the id
map. `selectEntities` gives you a dictionary for `*ngIf="entities[slug]"`.

## Testing

```ts
// reducer: a pure function, no TestBed
expect(feedReducer(undefined, feedActions.getFeed({url: '/x'})).isLoading).toBe(true)

// selector: call the projector
expect(selectIsAuthor.projector(article, user)).toBe(true)

// effect: mock actions + mock service
TestBed.configureTestingModule({
  providers: [
    getFeedEffect,
    provideMockActions(() => actions$),
    {provide: FeedService, useValue: feedServiceMock},
  ],
})
```

## Debugging order (use this list before DevTools)

1. Was the action dispatched? (DevTools → the action is in the list)
2. Did a reducer handle it? (DevTools → state changed)
3. Did the effect fire? (Network tab)
4. Is the selector returning what I think? (`store.select(s).subscribe(console.log)`)

If 1 is false, the component is wrong. If 2 is false, the reducer is wrong
(wrong action type string is the usual cause — check for a typo in the
space-separated name). If 3 is false, the effect is not registered. If 4 is
false, you mutated state.

## Error messages you will meet

| message | cause |
|---------|-------|
| `Effect dispatched an invalid action` | effect returns `undefined`/non-action; missing `dispatch: false` |
| `Cannot add feature: 'x' already exists` | slice registered in both `app.config.ts` and a route |
| `NullInjectorError: Store` | forgot `provideStore()` |
| template never updates | mutation in the reducer, or `OnPush` + non-observable field |
| API called on every keystroke | `mergeMap` where `switchMap` belonged, or subscribe in a getter |
