import {ChangeDetectionStrategy, Component, Input, inject} from '@angular/core'
import {CommonModule} from '@angular/common'
import {RouterLink, RouterLinkActive} from '@angular/router'
import {Store} from '@ngrx/store'
import {selectCurrentUser} from '../../../auth/store/reducers'

/**
 * GIVEN. "Your feed / Global feed / #tag".
 *
 * It reads one thing from the store (are we logged in?) and never dispatches.
 * The active pill is decided by the router, not by state — again: URL wins.
 */
@Component({
  selector: 'mc-feed-toggler',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './feedToggler.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedTogglerComponent {
  @Input() tagName?: string

  private store = inject(Store)
  currentUser$ = this.store.select(selectCurrentUser)
}
