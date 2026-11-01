/**
 * Seed data for the practice API. Plain arrays in memory — restart the server
 * and you are back to this exact state, which is what you want while learning.
 */

function avatar(initial, bg) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">` +
    `<rect width="100" height="100" rx="50" fill="${bg}"/>` +
    `<text x="50" y="68" font-family="Helvetica,Arial,sans-serif" font-size="46" ` +
    `fill="#ffffff" text-anchor="middle">${initial}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const users = [
  {
    id: 1,
    username: 'karim',
    email: 'karim@example.com',
    password: 'password123',
    bio: 'Writes Angular for a living, NgRx for the interview.',
    image: avatar('K', '#5cb85c'),
    favorites: ['why-ngrx-at-all'],
  },
  {
    id: 2,
    username: 'ana',
    email: 'ana@example.com',
    password: 'password123',
    bio: 'Entity adapter enthusiast.',
    image: avatar('A', '#5bc0de'),
    favorites: ['why-ngrx-at-all', 'effects-are-for-side-effects'],
  },
  {
    id: 3,
    username: 'sam',
    email: 'sam@example.com',
    password: 'password123',
    bio: 'Still not sure about reducers.',
    image: avatar('S', '#f0ad4e'),
    favorites: [],
  },
]

const articles = [
  {
    slug: 'why-ngrx-at-all',
    title: 'Why NgRx at all?',
    description:
      'A shared value in a service becomes two sources of truth the moment someone caches it.',
    body:
      'The honest answer is that most apps do not need a store.\n\n' +
      'What they need is one place where a piece of data lives, so that four components showing the same thing cannot disagree. A service with a BehaviorSubject does that too - until the day it also needs to survive navigation, be restored from localStorage, be replayed in a test, or be inspected after a bug report.\n\n' +
      'That is when the ceremony starts paying for itself: every change is an action with a name, every name is searchable, and the entire history of the app is a list you can step through.',
    tagList: ['ngrx', 'angular', 'architecture'],
    authorId: 1,
    createdAt: '2026-10-02T09:15:00.000Z',
  },
  {
    slug: 'effects-are-for-side-effects',
    title: 'Effects are for side effects, not for state',
    description:
      'If an effect writes state directly, you have hidden a reducer inside it.',
    body:
      'An effect listens to actions and produces actions. That is the entire contract.\n\nThe trap: an effect that calls the service, then patches the store by hand. Suddenly the state can be changed by something the devtools cannot see coming - and the reducer you carefully tested is no longer the only place mutations happen.\n\nKeep it boring: effect dispatches success or failure, reducer decides what those mean.',
    tagList: ['ngrx', 'effects'],
    authorId: 2,
    createdAt: '2026-10-05T14:40:00.000Z',
  },
  {
    slug: 'selectors-are-not-getters',
    title: 'Selectors are not getters',
    description:
      'A memoized selector recomputes only when its inputs change - a getter runs on every change detection pass.',
    body:
      'createSelector keeps the last input values and the last result. Same inputs, same object reference, no recomputation, no re-render.\n\nThat "same object reference" part is the reason OnPush works at all with a store. If your selector builds a new array every time, you have quietly turned every component into a ChangeDetectionStrategy.Default component with extra steps.',
    tagList: ['ngrx', 'selectors', 'performance'],
    authorId: 2,
    createdAt: '2026-10-08T11:05:00.000Z',
  },
  {
    slug: 'one-action-many-slices',
    title: 'One action, many slices',
    description:
      'Every reducer sees every action. That is a feature, not a leak.',
    body:
      'When you favourite an article, three different pieces of the screen need to change. There is no rule that says the action must belong to one feature.\n\nDispatch it once, let the feed reducer patch the row, let the article reducer patch the page, let the profile reducer ignore it. Each slice opts in by handling the action and opts out by doing nothing.',
    tagList: ['ngrx', 'architecture'],
    authorId: 1,
    createdAt: '2026-10-11T08:20:00.000Z',
  },
  {
    slug: 'entity-adapter-in-practice',
    title: 'The entity adapter, in practice',
    description:
      'ids plus entities beats an array as soon as you need to update one row.',
    body:
      'An array gives you O(n) updates and a reference to the whole list for one changed row. The adapter gives you a dictionary plus an id list, so updating one article touches one entry.\n\nFor a list of ten it does not matter. For a list of ten thousand, or for a list that patches rows on every favourite click, it is the difference between re-rendering everything and re-rendering one row.',
    tagList: ['ngrx', 'entity', 'performance'],
    authorId: 2,
    createdAt: '2026-10-14T16:30:00.000Z',
  },
  {
    slug: 'testing-a-reducer',
    title: 'Testing a reducer takes four lines',
    description:
      'No TestBed, no HTTP, no mocks. Input state plus action equals output state.',
    body:
      'A reducer is a pure function, so testing one is a function call:\n\n' +
      '  const next = reducer(initialState, authActions.loginSuccess({currentUser}))\n\n' +
      'The reason people test effects and skip reducers is that effects look like the hard part. They are not - the reducer is where your business rules live, and it is the cheapest thing in the app to test.',
    tagList: ['ngrx', 'testing'],
    authorId: 1,
    createdAt: '2026-10-18T10:00:00.000Z',
  },
  {
    slug: 'meta-reducers-and-persistence',
    title: 'Meta-reducers, or how state survives a refresh',
    description:
      'A meta-reducer wraps the whole reducer and sees every action.',
    body:
      'Loading state from localStorage at boot is a meta-reducer: it runs once, before anything else, and returns the rehydrated state.\n\nSaving is an effect that listens to everything and writes the subset you care about. Two halves of the same idea, and neither of them touches a feature reducer.',
    tagList: ['ngrx', 'meta-reducers', 'storage'],
    authorId: 2,
    createdAt: '2026-10-21T12:45:00.000Z',
  },
  {
    slug: 'onpush-and-observables',
    title: 'OnPush and the async pipe',
    description:
      'The async pipe subscribes, marks for check, and unsubscribes for you.',
    body:
      'Under OnPush a component only re-renders when an input reference changes, an event fires inside it, or something marks it dirty. The async pipe does that last part.\n\nSo `data$ | async` is not just shorthand for a subscription - it is the thing that tells Angular "the value changed, look again".',
    tagList: ['angular', 'performance'],
    authorId: 1,
    createdAt: '2026-10-24T09:30:00.000Z',
  },
  {
    slug: 'lazy-state-tradeoffs',
    title: 'Lazy state has a price',
    description:
      'provideState inside a route is elegant until another slice needs to read it.',
    body:
      'Registering a slice on a route keeps the initial bundle small and keeps related code together.\n\nThe price is timing: the state does not exist until the user navigates there. A cross-feature effect that wants to read it will find undefined - and no type error will warn you.',
    tagList: ['ngrx', 'routing', 'architecture'],
    authorId: 2,
    createdAt: '2026-10-26T15:10:00.000Z',
  },
  {
    slug: 'devtools-trace',
    title: 'Turn on trace and read the stack',
    description:
      'One config flag tells you which line dispatched the action.',
    body:
      'provideStoreDevtools({trace: true}) records the stack for every dispatch. Open the action in the extension and you get file and line.\n\nIt is slow. It is also the fastest way to answer "who dispatched this twice?" That trade is worth making while you are learning, and worth removing before you ship.',
    tagList: ['ngrx', 'devtools'],
    authorId: 1,
    createdAt: '2026-10-28T07:00:00.000Z',
  },
  {
    slug: 'optimistic-updates',
    title: 'Optimistic updates need a rollback plan',
    description:
      'Flipping the heart before the server answers is fine - if you can flip it back.',
    body:
      'Update the UI immediately, send the request, reconcile on the response. The user sees zero latency and the request almost always succeeds.\n\nThe "almost" is the whole design problem. When it fails you need the previous value, and you need to know whether the user clicked again in the meantime. Store the intent in the action and the rollback becomes a second action with the same payload.',
    tagList: ['ngrx', 'ux', 'effects'],
    authorId: 2,
    createdAt: '2026-10-30T13:25:00.000Z',
  },
  {
    slug: 'when-not-to-use-ngrx',
    title: 'When not to use NgRx',
    description:
      'A form with three fields is not application state. Keep it in the component.',
    body:
      'Local UI state - a dropdown being open, a half-typed search box - belongs in the component. Putting it in the store means every keystroke becomes an action in the devtools history and every component can now depend on it.\n\nThe rule of thumb: if exactly one component cares about the value and it disappears when the component does, it is not global state.',
    tagList: ['ngrx', 'architecture', 'opinion'],
    authorId: 1,
    createdAt: '2026-11-01T08:00:00.000Z',
  },
]

module.exports = {users, articles}
