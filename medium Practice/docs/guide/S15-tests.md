# S15 — tests

**New files:** `*.spec.ts` next to what you test. 45 minutes.

Reducers and selectors are the two easiest things in the world to test: they are
pure functions. No TestBed, no HTTP, no fixtures. Effects are harder, which is
precisely why the "keep effects dumb" advice in S8 exists.

The project is already set up for this: `@angular/build:unit-test` with Vitest,
and `npm test` runs it.

Note: there are no spec files in `src` yet. You are creating the first ones.

---

## Step 1 of 4 — a reducer test

Create `src/app/shared/components/popularTags/store/reducers.spec.ts`:

```ts
import {describe, expect, it} from 'vitest'
import {popularTagsActions} from './actions'
import {popularTagsReducer} from './reducers'

const initialState = {
  isLoading: false,
  error: null,
  data: null,
}

describe('popularTagsReducer', () => {
  it('marks loading when the tags are requested', () => {
    const state = popularTagsReducer(
      initialState,
      popularTagsActions.getPopularTags()
    )

    expect(state.isLoading).toBe(true)
    expect(state.error).toBeNull()
  })

  it('stores the tags when they arrive', () => {
    const tags = [{name: 'angular'}, {name: 'ngrx'}]
    const state = popularTagsReducer(
      {isLoading: true, error: 'old error', data: null},
      popularTagsActions.getPopularTagsSuccess({popularTags: tags})
    )

    expect(state.isLoading).toBe(false)
    expect(state.data).toEqual(tags)
  })

  it('keeps the previous tags when a request fails', () => {
    const tags = [{name: 'angular'}]
    const state = popularTagsReducer(
      {isLoading: true, error: null, data: tags},
      popularTagsActions.getPopularTagsFailure()
    )

    expect(state.isLoading).toBe(false)
    expect(state.data).toEqual(tags)
    expect(state.error).not.toBeNull()
  })
})
```

If `describe`/`it`/`expect` come back undefined, the builder is not injecting
globals in your setup: then import them from `'vitest'` (the file above already
does, so this should just work).

WHY the third test   "keeps the previous tags when a request fails" is the test
that documents the design decision you made in S8 step 3. Tests are how decisions
stop being folklore.

---

## Step 2 of 4 — a selector test (two slices)

Create `src/app/article/store/selectors.spec.ts`. You do not need a real store —
a selector is a function. Build the two slices by hand:

```ts
import {describe, expect, it} from 'vitest'
import {selectIsAuthor} from './selectors'

const article = (username: string) =>
  ({author: {username}}) as any

const state = (articleData: any, currentUser: any) => ({
  article: {isLoading: false, error: null, data: articleData},
  auth: {isSubmitting: false, isLoading: false, currentUser, validationErrors: null},
})

describe('selectIsAuthor', () => {
  it('is true for my own article', () => {
    expect(selectIsAuthor(state(article('karim'), {username: 'karim'}))).toBe(true)
  })

  it('is false for someone else’s article', () => {
    expect(selectIsAuthor(state(article('anna'), {username: 'karim'}))).toBe(false)
  })

  it('is false when nobody is logged in', () => {
    expect(selectIsAuthor(state(article('karim'), null))).toBe(false)
  })

  it('is false before we know who is logged in', () => {
    expect(selectIsAuthor(state(article('karim'), undefined))).toBe(false)
  })

  it('is false when there is no article', () => {
    expect(selectIsAuthor(state(null, {username: 'karim'}))).toBe(false)
  })
})
```

WHY five cases   because "am I the author?" has exactly five answers, and two of
them (`null` user, `undefined` user) are the ones that break in production. This is
the S14 trap, written down as a test.

Note the state shape in the helper: the selector's input selectors read
`state.article.data` and `state.auth.currentUser`. If your app's state shape
differs, the test is telling you that you know it — adjust the helper, not the
assertions.

---

## Step 3 of 4 — run them

```
cd "~/Desktop/AngularBootcamp/Angular & NgRx/medium Practice"
npm test
```

SEE    8 passing tests. If it opens a watch mode, `q` quits it; for a single run
       use `npm test -- --watch=false`.

WHY     now break one assertion on purpose (`toBe(true)` → `toBe(false)`) and watch
       it fail. A test you have never seen fail is a test you cannot trust.

---

## Step 4 of 4 — an effect test (stretch)

Effects need `TestBed` + `provideMockActions` from `@ngrx/effects/testing` and
`provideHttpClientTesting`. It is genuinely more work — one hour for the first
one. Do it when you want to, not because the guide says so.

```ts
import {TestBed} from '@angular/core/testing'
import {provideMockActions} from '@ngrx/effects/testing'
import {firstValueFrom, of} from 'rxjs'
import {vi} from 'vitest'
import {getPopularTagsEffect} from './effects'
import {PopularTagService} from '../services/popularTag.service'
import {popularTagsActions} from './actions'
import {describe, expect, it, beforeEach} from 'vitest'

describe('getPopularTagsEffect', () => {
  let actions$: any

  beforeEach(() => {
    actions$ = of(popularTagsActions.getPopularTags())
    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        {
          provide: PopularTagService,
          useValue: {getPopularTags: vi.fn(() => of([{name: 'angular'}]))},
        },
      ],
    })
  })

  it('maps tags to a success action', async () => {
    const action = await firstValueFrom(TestBed.runInInjectionContext(() =>
      getPopularTagsEffect(actions$, TestBed.inject(PopularTagService)) as any
    ))

    expect(action).toEqual(
      popularTagsActions.getPopularTagsSuccess({popularTags: [{name: 'angular'}]})
    )
  })
})
```

WHY the effect takes its dependencies as arguments   because functional effects are
plain functions `(actions$, service) => Observable<Action>`. That is the whole
payoff of `{functional: true}`: no class, no constructor injection, and a test that
does not need the whole app.

If this test fights you for more than an hour, leave it. Come back after S17.

---

## Done when

`npm test` is green, you have watched one assertion fail on purpose, and the
selector test covers the logged-out case.

Next: `docs/guide/S16-meta-reducer.md`.
