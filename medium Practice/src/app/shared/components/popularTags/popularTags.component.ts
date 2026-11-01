import {CommonModule} from '@angular/common'
import {ChangeDetectionStrategy, Component, OnInit, inject} from '@angular/core'
import {RouterLink} from '@angular/router'
import {Store} from '@ngrx/store'
import {combineLatest} from 'rxjs'
import {ErrorMessageComponent} from '../errorMessage/errorMessage.component'
import {LoadingComponent} from '../loading/loading.component'
import {popularTagsActions} from './store/actions'
import {
  selectError,
  selectIsLoading,
  selectPopularTagsData,
} from './store/reducers'

/**
 * GIVEN. The pattern every container component in this app follows:
 *
 *   1. select the slice with combineLatest -> one `data$` for the template
 *   2. dispatch "get" in ngOnInit
 *   3. render loading / error / data, in that priority
 *
 * Note it never subscribes by hand: `| async` in the template does it, and
 * OnPush means Angular only re-renders when that emission changes.
 */
@Component({
  selector: 'mc-popular-tags',
  imports: [CommonModule, LoadingComponent, ErrorMessageComponent, RouterLink],
  templateUrl: './popularTags.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopularTagsComponent implements OnInit {
  private store = inject(Store)

  data$ = combineLatest({
    popularTags: this.store.select(selectPopularTagsData),
    isLoading: this.store.select(selectIsLoading),
    error: this.store.select(selectError),
  })

  ngOnInit(): void {
    this.store.dispatch(popularTagsActions.getPopularTags())
  }
}
