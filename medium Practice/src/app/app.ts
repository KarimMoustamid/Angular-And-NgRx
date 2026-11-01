import {ChangeDetectionStrategy, Component, inject} from '@angular/core'
import {RouterOutlet} from '@angular/router'
import {Store} from '@ngrx/store'
import {authActions} from './auth/store/actions'
import {TopBarComponent} from './shared/components/topBar/topBar.component'

/**
 * GIVEN — the shell. Nothing to write here.
 *
 * One line matters: the constructor dispatches "Get current user" exactly once,
 * at startup. That is the app asking "is somebody logged in?" before the first
 * paint. Everything the navbar shows about the user comes from the answer.
 *
 * Stage S5 makes that answer arrive. Until then the store's currentUser stays
 * `undefined` — "we don't know yet" — which is a different thing from `null`
 * ("we know: nobody"). Open DevTools and watch both.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopBarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private store = inject(Store)

  constructor() {
    this.store.dispatch(authActions.getCurrentUser())
  }
}
