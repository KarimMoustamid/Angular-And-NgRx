import {createFeature, createReducer} from '@ngrx/store'
import {UserProfileStateInterface} from '../types/userProfileState.interface'

/* ===========================================================================
 * STAGE S12 — the userProfile reducer. Third slice you write on your own.
 *
 * Nothing new here by design. If you have to look at the auth reducer to
 * remember the shape, that is fine — that is how the pattern becomes automatic.
 *
 * YOU WRITE: the handlers.
 * ======================================================================== */

const initialState: UserProfileStateInterface = {
  isLoading: false,
  error: null,
  data: null,
}

export const userProfileFeature = createFeature({
  name: 'userProfile',
  reducer: createReducer(
    initialState

    // TODO S12.1 — 'Get user profile'         -> isLoading: true, error: null
    // TODO S12.2 — 'Get user profile success' -> isLoading: false,
    //              data: action.userProfile
    // TODO S12.3 — 'Get user profile failure' -> isLoading: false, error: '...'
  ),
})

export const {
  name: userProfileFeatureKey,
  reducer: userProfileReducer,
  selectUserProfileState,
  selectIsLoading,
  selectError,
  selectData: selectUserProfileData,
} = userProfileFeature
