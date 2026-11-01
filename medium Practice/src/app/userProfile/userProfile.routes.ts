import {Routes} from '@angular/router'
import {provideEffects} from '@ngrx/effects'
import {provideState} from '@ngrx/store'
import {UserProfileComponent} from './components/userProfile/userProfile.component'
import * as userProfileEffects from './store/effects'
import {userProfileFeature} from './store/reducers'

/**
 * GIVEN. Two routes, one component, one lazy slice — same idea as article.
 * /profiles/ana            -> "My Posts"
 * /profiles/ana/favorites  -> "Favorites Posts"
 */
export const routes: Routes = [
  {
    path: '',
    component: UserProfileComponent,
    providers: [provideState(userProfileFeature), provideEffects(userProfileEffects)],
  },
]
