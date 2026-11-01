import {createActionGroup, emptyProps, props} from '@ngrx/store'
import {UserProfileInterface} from '../types/userProfile.interface'

/**
 * GIVEN. Two things to notice:
 *
 * 1. One action for every profile page. The same `getUserProfile` fires for
 *    /profiles/ana and /profiles/ana/favorites — only the feed url below changes.
 * 2. `getUserProfileSuccess` REPLACES the profile. There is no "profiles" map
 *    here, so leaving a profile page and opening another keeps the old one on
 *    screen for a moment. Is that a bug or a feature? That question is the
 *    entrance to S17 (entity adapter), so keep your answer.
 */
export const userProfileActions = createActionGroup({
  source: 'userProfile',
  events: {
    'Get user profile': props<{slug: string}>(),
    'Get user profile success': props<{userProfile: UserProfileInterface}>(),
    'Get user profile failure': emptyProps(),
  },
})
