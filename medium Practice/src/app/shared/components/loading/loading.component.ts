import {ChangeDetectionStrategy, Component} from '@angular/core'

/** GIVEN. One spinner, used by every loading state in the app. */
@Component({
  selector: 'mc-loading',
  template: '<div class="loading"><div class="spinner"></div></div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {}
