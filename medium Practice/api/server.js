/**
 * Medium Practice API — a small, dependency-free clone of the RealWorld spec.
 * ---------------------------------------------------------------------------
 * WHY DOES THIS EXIST?
 * api.realworld.io (the official demo API) is dead, and even when it was alive
 * you could not make it return a 500 on demand. This file gives you the same
 * shapes the templates already expect, plus knobs for the failure cases you
 * actually need to practise: timeouts, 500s and expired tokens.
 *
 * RUN IT:   npm run api        (listens on http://localhost:3100/api)
 * RESET IT: restart the process — state lives in memory.
 *
 * Nothing here is part of the exercise. Read it if you are curious how the
 * server side of these shapes looks; otherwise treat it as a black box.
 */

const http = require('node:http')
const {users, articles: seedArticles} = require('./data')

const PORT = Number(process.env.PORT || 3100)
const API = '/api'

/* -------------------------------------------------------------- state ----- */
const db = {
  users: users.map((u) => ({...u, favorites: [...u.favorites]})),
  articles: seedArticles.map((a) => ({...a, tagList: [...a.tagList]})),
  tokens: new Map(), // token -> userId
  nextUserId: users.length + 1,
}

/** Global fault injection, changed at runtime through POST /api/_control. */
const chaos = {fail: 0, delay: 0}

/* ------------------------------------------------------------ helpers ----- */
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function findUserByUsername(username) {
  return db.users.find((u) => u.username === username)
}

function publicUser(user) {
  return {username: user.username, email: user.email, bio: user.bio, image: user.image, token: tokenFor(user)}
}

function profileOf(user, viewer) {
  return {
    username: user.username,
    bio: user.bio,
    image: user.image,
    following: false, // follow/unfollow is not part of this practice app
    _viewer: viewer ? viewer.username : null,
  }
}

function tokenFor(user) {
  for (const [token, id] of db.tokens) {
    if (id === user.id) return token
  }
  const token = `practice-token-${user.id}-${Math.random().toString(36).slice(2, 10)}`
  db.tokens.set(token, user.id)
  return token
}

function currentUser(req) {
  const header = req.headers['authorization'] || ''
  const raw = header.replace(/^Token\s+/i, '').replace(/^Bearer\s+/i, '').trim()
  if (!raw) return null
  const id = db.tokens.get(raw)
  if (!id) return null
  return db.users.find((u) => u.id === id) || null
}

function articleView(article, viewer) {
  const favoritesCount = db.users.reduce(
    (sum, u) => sum + (u.favorites.includes(article.slug) ? 1 : 0),
    0
  )
  const author = db.users.find((u) => u.id === article.authorId)
  return {
    slug: article.slug,
    title: article.title,
    description: article.description,
    body: article.body,
    tagList: article.tagList,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt || article.createdAt,
    favorited: viewer ? viewer.favorites.includes(article.slug) : false,
    favoritesCount,
    author: profileOf(author, viewer),
  }
}

function send(res, status, payload) {
  const body = payload === undefined ? '' : JSON.stringify(payload)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Cache-Control': 'no-store',
  })
  res.end(body)
}

function readBody(req) {
  return new Promise((resolve) => {
    let raw = ''
    req.on('data', (chunk) => {
      raw += chunk
    })
    req.on('end', () => {
      if (!raw) return resolve({})
      try {
        resolve(JSON.parse(raw))
      } catch {
        resolve({})
      }
    })
  })
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function unauthorized(res) {
  return send(res, 401, {errors: {token: ['is missing or invalid']}})
}

/* -------------------------------------------------------------- server ---- */
const server = http.createServer(async (req, res) => {
  const method = req.method || 'GET'
  const url = new URL(req.url || '/', `http://localhost:${PORT}`)
  const path = url.pathname.replace(/\/+$/, '') || '/'

  if (method === 'OPTIONS') return send(res, 204)

  /* ---- fault injection knobs ------------------------------------------- */
  const forcedFail = Number(url.searchParams.get('_fail') || chaos.fail || 0)
  const forcedDelay = Number(url.searchParams.get('_delay') || chaos.delay || 0)

  console.log(`${method} ${url.pathname}${url.search}`)

  if (forcedDelay) {
    await sleep(forcedDelay)
  }

  if (path === `${API}/_control`) {
    if (method === 'POST') {
      const body = await readBody(req)
      if (body.reset) {
        chaos.fail = 0
        chaos.delay = 0
      }
      if (typeof body.fail === 'number') chaos.fail = body.fail
      if (typeof body.delay === 'number') chaos.delay = body.delay
    }
    return send(res, 200, chaos)
  }

  if (forcedFail) {
    console.log(`  -> injected ${forcedFail}`)
    return send(res, forcedFail, {errors: {server: [`injected ${forcedFail} for practice`]}})
  }

  try {
    /* ---- tags ---------------------------------------------------------- */
    if (method === 'GET' && path === `${API}/tags`) {
      const tags = [...new Set(db.articles.flatMap((a) => a.tagList))].sort()
      return send(res, 200, {tags})
    }

    /* ---- auth ---------------------------------------------------------- */
    if (method === 'POST' && path === `${API}/users`) {
      const body = await readBody(req)
      const user = body.user || {}
      const errors = {}
      if (!user.username) errors['username'] = ["can't be blank"]
      if (!user.email) errors['email'] = ["can't be blank"]
      if (!user.password) errors['password'] = ["can't be blank"]
      if (db.users.some((u) => u.email === user.email)) errors['email'] = ['has already been taken']
      if (db.users.some((u) => u.username === user.username)) errors['username'] = ['has already been taken']
      if (Object.keys(errors).length) return send(res, 422, {errors})

      const created = {
        id: db.nextUserId++,
        username: user.username,
        email: user.email,
        password: user.password,
        bio: null,
        image: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.username)}`,
        favorites: [],
      }
      db.users.push(created)
      return send(res, 201, {user: publicUser(created)})
    }

    if (method === 'POST' && path === `${API}/users/login`) {
      const body = await readBody(req)
      const creds = body.user || {}
      const user = db.users.find(
        (u) => u.email === creds.email && u.password === creds.password
      )
      if (!user) {
        return send(res, 422, {errors: {credentials: ['email or password is invalid']}})
      }
      return send(res, 200, {user: publicUser(user)})
    }

    if (method === 'GET' && path === `${API}/user`) {
      const user = currentUser(req)
      if (!user) return unauthorized(res)
      return send(res, 200, {user: publicUser(user)})
    }

    /* ---- profiles ------------------------------------------------------ */
    const profileMatch = path.match(new RegExp(`^${API}/profiles/([^/]+)$`))
    if (method === 'GET' && profileMatch) {
      const target = findUserByUsername(decodeURIComponent(profileMatch[1]))
      if (!target) return send(res, 404, {errors: {profile: ['not found']}})
      return send(res, 200, {profile: profileOf(target, currentUser(req))})
    }

    /* ---- articles ------------------------------------------------------ */
    if (method === 'GET' && path === `${API}/articles`) {
      const viewer = currentUser(req)
      const limit = Number(url.searchParams.get('limit') || 10)
      const offset = Number(url.searchParams.get('offset') || 0)
      const tag = url.searchParams.get('tag')
      const author = url.searchParams.get('author')
      const favoritedBy = url.searchParams.get('favorited')

      let list = [...db.articles].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )

      if (tag) list = list.filter((a) => a.tagList.includes(tag))
      if (author) {
        const owner = findUserByUsername(author)
        list = owner ? list.filter((a) => a.authorId === owner.id) : []
      }
      if (favoritedBy) {
        const fan = findUserByUsername(favoritedBy)
        list = fan ? list.filter((a) => fan.favorites.includes(a.slug)) : []
      }

      const page = list.slice(offset, offset + limit)
      return send(res, 200, {
        articles: page.map((a) => articleView(a, viewer)),
        articlesCount: list.length,
      })
    }

    if (method === 'GET' && path === `${API}/articles/feed`) {
      const viewer = currentUser(req)
      if (!viewer) return unauthorized(res)
      // Nobody follows anybody in this app, so "your feed" is your own articles.
      const mine = db.articles.filter((a) => a.authorId === viewer.id)
      return send(res, 200, {
        articles: mine.map((a) => articleView(a, viewer)),
        articlesCount: mine.length,
      })
    }

    if (method === 'POST' && path === `${API}/articles`) {
      const viewer = currentUser(req)
      if (!viewer) return unauthorized(res)
      const body = await readBody(req)
      const input = body.article || {}
      const errors = {}
      if (!input.title) errors['title'] = ["can't be blank"]
      if (!input.description) errors['description'] = ["can't be blank"]
      if (!input.body) errors['body'] = ["can't be blank"]
      if (Object.keys(errors).length) return send(res, 422, {errors})

      let slug = slugify(input.title)
      while (db.articles.some((a) => a.slug === slug)) slug = `${slug}-2`
      const now = new Date().toISOString()
      const article = {
        id: (db.articles.at(-1)?.id || 0) + 1,
        slug,
        title: input.title,
        description: input.description,
        body: input.body,
        tagList: Array.isArray(input.tagList) ? input.tagList : [],
        authorId: viewer.id,
        createdAt: now,
        updatedAt: now,
      }
      db.articles.push(article)
      return send(res, 201, {article: articleView(article, viewer)})
    }

    const articleMatch = path.match(new RegExp(`^${API}/articles/([^/]+)$`))
    if (articleMatch && !path.includes('/favorite')) {
      const slug = decodeURIComponent(articleMatch[1])
      const article = db.articles.find((a) => a.slug === slug)
      if (!article) return send(res, 404, {errors: {article: ['not found']}})

      if (method === 'GET') {
        return send(res, 200, {article: articleView(article, currentUser(req))})
      }

      if (method === 'DELETE') {
        const viewer = currentUser(req)
        if (!viewer) return unauthorized(res)
        if (viewer.id !== article.authorId) {
          return send(res, 403, {errors: {article: ['not yours to delete']}})
        }
        db.articles = db.articles.filter((a) => a.slug !== slug)
        return send(res, 204)
      }
    }

    const favoriteMatch = path.match(new RegExp(`^${API}/articles/([^/]+)/favorite$`))
    if (favoriteMatch) {
      const viewer = currentUser(req)
      if (!viewer) return unauthorized(res)
      const slug = decodeURIComponent(favoriteMatch[1])
      const article = db.articles.find((a) => a.slug === slug)
      if (!article) return send(res, 404, {errors: {article: ['not found']}})

      if (method === 'POST') {
        if (!viewer.favorites.includes(slug)) viewer.favorites.push(slug)
        return send(res, 200, {article: articleView(article, viewer)})
      }
      if (method === 'DELETE') {
        viewer.favorites = viewer.favorites.filter((s) => s !== slug)
        return send(res, 200, {article: articleView(article, viewer)})
      }
    }

    return send(res, 404, {errors: {route: [`no handler for ${method} ${path}`]}})
  } catch (error) {
    console.error(error)
    return send(res, 500, {errors: {server: [String(error && error.message)]}})
  }
})

server.listen(PORT, () => {
  console.log(`Medium Practice API  ->  http://localhost:${PORT}${API}`)
  console.log(`  ${db.users.length} users, ${db.articles.length} articles`)
  console.log('  log in with karim@example.com / password123')
  console.log('  fault injection:  add ?_fail=500 or ?_delay=2000 to any request')
  console.log('                    or POST /api/_control  {"fail":500}')
})
