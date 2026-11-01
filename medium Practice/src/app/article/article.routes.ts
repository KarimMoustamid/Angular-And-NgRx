import {Routes} from '@angular/router'
import {provideEffects} from '@ngrx/effects'
import {provideState} from '@ngrx/store'
import {ArticleComponent} from './components/article/article.component'
import * as articleEffects from './store/effects'
import {articleFeature} from './store/reducers'

/**
 * GIVEN — but read it twice. This is the SECOND way to register a slice.
 *
 * app.config.ts registers auth/feed/popularTags eagerly: they are open on every
 * page, so there is no point deferring them.
 *
 * This one is registered on the route, so the reducer, the effects and the
 * component arrive together, in one lazy chunk, the first time somebody opens
 * an article. Same API (provideState / provideEffects), different timing.
 *
 * The trade-off, in one line: lazy state is not there before you navigate to it
 * — so a router-store effect living in another feature cannot read it. That is
 * why cross-feature effects are a design decision, not a convenience.
 */
export const routes: Routes = [
  {
    path: '',
    component: ArticleComponent,
    providers: [provideState(articleFeature), provideEffects(articleEffects)],
  },
]
