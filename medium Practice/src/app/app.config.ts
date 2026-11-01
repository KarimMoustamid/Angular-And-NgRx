import {isDevMode, provideBrowserGlobalErrorListeners} from '@angular/core'
import {provideHttpClient, withInterceptors} from '@angular/common/http'
import {ApplicationConfig} from '@angular/core'
import {provideRouter} from '@angular/router'
import {provideEffects} from '@ngrx/effects'
import {provideState, provideStore} from '@ngrx/store'
import {provideStoreDevtools} from '@ngrx/store-devtools'
import {provideRouterStore, routerReducer} from '@ngrx/router-store'
import {appRoutes} from './app.routes'
import {authInterceptor} from './core/auth.interceptor'
import {authFeature} from './auth/store/reducers'
import * as authEffects from './auth/store/effects'
import {feedFeature} from './shared/components/feed/store/reducers'
import * as feedEffects from './shared/components/feed/store/effects'
import {popularTagsFeature} from './shared/components/popularTags/store/reducers'
import * as popularTagsEffects from './shared/components/popularTags/store/effects'
import * as addToFavoritesEffects from './shared/components/addToFavorites/store/effects'

/**
 * This file IS the NgRx wiring. Read it once, top to bottom, then come back to it
 * at the end of the course — it will read completely differently.
 *
 * Three things are registered here:
 *   1. provideStore(...)   -> creates THE store (one per app) + the router slice
 *   2. provideState(...)   -> "mount this slice of state under this name"
 *   3. provideEffects(...) -> "run these side-effect handlers"
 *
 * article/ and userProfile/ are NOT here on purpose: their state and effects are
 * registered lazily, inside their route definitions (see app.routes.ts and
 * article/article.routes.ts). Two ways of doing the same thing — you should be
 * able to say why you would pick each.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([authInterceptor])),

    // --- the store itself ---------------------------------------------------
    // `router` is @ngrx/router-store's slice: a serialisable copy of the URL.
    // We register it here so every feature can react to navigation.
    provideStore({router: routerReducer}),
    provideRouterStore(),

    // --- feature slices that everybody needs --------------------------------
    provideState(authFeature), // who is logged in — the whole app reads this
    provideState(feedFeature), // the article list, used on 4 different routes
    provideState(popularTagsFeature), // the sidebar

    // --- effects ------------------------------------------------------------
    provideEffects(
      authEffects,
      feedEffects,
      popularTagsEffects,
      addToFavoritesEffects
    ),

    // --- devtools -----------------------------------------------------------
    // Open Redux DevTools in Chrome/Firefox, pick "Medium Practice" in the
    // instance dropdown, and you can watch every action + time-travel.
    provideStoreDevtools({
      name: 'Medium Practice',
      maxAge: 30,
      logOnly: !isDevMode(),
      // trace: true prints the line of code that dispatched the action.
      // It is slow on big apps; it is fantastic while learning. Leave it on.
      trace: true,
      traceLimit: 30,
    }),
  ],
}
