import {CommonModule} from '@angular/common'
import {ChangeDetectionStrategy, Component, OnInit, inject} from '@angular/core'
import {ActivatedRoute, Router, RouterLink, RouterLinkActive} from '@angular/router'
import {Store} from '@ngrx/store'
import {combineLatest, map} from 'rxjs'
import {selectCurrentUser} from 'src/app/auth/store/reducers'
import {FeedComponent} from 'src/app/shared/components/feed/feed.component'
import {userProfileActions} from '../../store/actions'
import {
  selectError,
  selectIsLoading,
  selectUserProfileData,
} from '../../store/reducers'

/**
 * GIVEN. One subtlety worth reading carefully — the `getApiUrl()` call in the
 * template.
 *
 * Calling a method from a template runs on every change detection pass. It is
 * acceptable here ONLY because the component is OnPush and the method is a
 * two-line string concatenation. If it ever grows, turn it into a signal or a
 * piped observable. (This is also the one place a reviewer would flag.)
 */
@Component({
  selector: 'mc-user-profile',
  imports: [CommonModule, RouterLink, RouterLinkActive, FeedComponent],
  templateUrl: './userProfile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent implements OnInit {
  private store = inject(Store)
  private route = inject(ActivatedRoute)
  private router = inject(Router)

  slug = ''

  isCurrentUserProfile$ = combineLatest({
    currentUser: this.store.select(selectCurrentUser),
    userProfile: this.store.select(selectUserProfileData),
  }).pipe(
    map(({currentUser, userProfile}) => {
      if (!currentUser || !userProfile) {
        return false
      }
      return currentUser.username === userProfile.username
    })
  )

  data$ = combineLatest({
    isLoading: this.store.select(selectIsLoading),
    error: this.store.select(selectError),
    userProfile: this.store.select(selectUserProfileData),
    isCurrentUserProfile: this.isCurrentUserProfile$,
  })

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.slug = params['slug']
      this.store.dispatch(userProfileActions.getUserProfile({slug: this.slug}))
    })
  }

  getApiUrl(): string {
    const isFavorites = this.router.url.includes('favorites')
    return isFavorites ? `/articles?favorited=${this.slug}` : `/articles?author=${this.slug}`
  }
}
