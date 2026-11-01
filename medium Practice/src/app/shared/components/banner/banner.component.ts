import {ChangeDetectionStrategy, Component} from '@angular/core'

/** GIVEN. The green hero at the top of the home page. Static. */
@Component({
  selector: 'mc-banner',
  templateUrl: './banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerComponent {}
