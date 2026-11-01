import {ChangeDetectionStrategy, Component, inject} from '@angular/core'
import {CommonModule} from '@angular/common'
import {RouterLink} from '@angular/router'
import {Store} from '@ngrx/store'
import {selectCurrentUser} from '../../../auth/store/reducers'

/**
 * GIVEN. The navbar — and the best place to see NgRx working.
 *
 * Nothing here talks to the auth service. It just selects `currentUser` out of
 * the store. Log in and this component re-renders because the state changed,
 * with zero event bubbling, zero @Output, zero shared service.
 *
 * Stage S5 makes this observable: after login, the navbar should flip by itself.
 */
@Component({
  selector: 'mc-topbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './topBar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopBarComponent {
  private store = inject(Store)

  currentUser$ = this.store.select(selectCurrentUser)
}
