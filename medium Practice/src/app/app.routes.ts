import {Routes} from '@angular/router'

/**
 * Every route is lazy, exactly like the reference app.
 * Notice: no store registration here — feed/popularTags/auth are global.
 * The features that ARE registered per-route are article/ and userProfile/.
 */
export const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./globalFeed/globalFeed.routes').then((m) => m.routes),
  },
  {
    path: 'feed',
    loadChildren: () =>
      import('./yourFeed/yourFeed.routes').then((m) => m.routes),
  },
  {
    path: 'tags/:slug',
    loadChildren: () => import('./tagFeed/tagFeed.routes').then((m) => m.routes),
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.loginRoutes),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./auth/auth.routes').then((m) => m.registerRoutes),
  },
  {
    path: 'articles/:slug',
    loadChildren: () =>
      import('./article/article.routes').then((m) => m.routes),
  },
  {
    path: 'profiles/:slug',
    loadChildren: () =>
      import('./userProfile/userProfile.routes').then((m) => m.routes),
  },
  {
    path: 'profiles/:slug/favorites',
    loadChildren: () =>
      import('./userProfile/userProfile.routes').then((m) => m.routes),
  },
  {path: '**', redirectTo: ''},
]
