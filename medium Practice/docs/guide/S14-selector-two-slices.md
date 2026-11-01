# S14 — a selector that needs two slices

**File:** `src/app/article/store/selectors.ts` — one function, five lines.
15 minutes. Small stage, big idea.

`selectIsAuthor` answers "did I write this article?" — the question that decides
whether the Delete button exists. No server sends that answer. It is arithmetic
over two slices.

Read the comment block at the top of the file first: it argues the case for doing
this in a selector instead of in the component.

---

## Step 1 of 3 — write the condition

Replace `return false` with the real check.

The stub warns you about the three states of `currentUser`:

```
undefined  we never asked the server (app just booted, S5 hasn't answered)
null       we asked, nobody is logged in
{...}      a real user
```

So the answer must be `true` **only** when both `article` and `currentUser` are
real objects and the usernames match.

The trap the stub is pointing at: a naive
`article?.author.username === currentUser?.username` returns `true` when both are
`undefined` — `undefined === undefined`. That means "Delete" shows up on every
article before you log in. Handle it explicitly.

```ts
export const selectIsAuthor = createSelector(
  selectArticleData,
  selectCurrentUser,
  (article, currentUser) => {
    if (!article || !currentUser) return false
    return article.author.username === currentUser.username
  }
)
```

Write it your own way if you prefer — but make sure those two guards are there.

---

## Step 2 of 3 — check memoization

In DevTools, open the article page. Then click around (feed → article → feed).

SEE    `selectIsAuthor` only recomputes when `article.data` or `auth.currentUser`
       actually changes. Redux DevTools does not show selector recomputations
       directly, so verify it the cheap way: add a `console.count('isAuthor')`
       inside the selector body for one minute, click around, watch the numbers,
       then delete the line.

WHY    `createSelector` memoizes on its inputs. If you skip the input selectors and
       read `state.article.data` directly inside the projector, memoization is
       gone — it recomputes on every state change in the whole app, which is
       exactly what the store was supposed to save you from.

---

## Step 3 of 3 — see it in the page

You must be logged in as the author (the seeded articles belong to `karim`).

SEE    the Delete button on your own articles, and no Delete button on articles by
       other authors. Log out and open any article: still no Delete button, no
       error in the console.

WHY    log out is the important half of the test. Most "am I the author?" bugs only
       show up in the logged-out state — that is the `undefined === undefined`
       case from step 1.

---

## If it doesn't work

- **Delete shows on every article** — the `undefined === undefined` bug: you
  compared with `?.` and no guards.
- **Delete never shows, even on your own article** — the seeded articles are
  authored by `karim`; log in as `karim@example.com`. Or you compared
  `article.author` to `currentUser` (the objects) instead of the usernames.
- **TypeScript error about `undefined`** — `selectArticleData` returns
  `ArticleInterface | null | undefined`; the guards fix this too.

## Done when

Delete appears on your articles only, and stays invisible (without crashing) when
logged out.

Next: `docs/guide/S15-tests.md`.
