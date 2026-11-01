import {CommonModule} from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core'
import {ActivatedRoute, Router, RouterLink} from '@angular/router'
import {Store} from '@ngrx/store'
import {Subscription, combineLatest} from 'rxjs'
import {environment} from 'src/environments/environment'
import {AddToFavoritesComponent} from '../addToFavorites/addToFavorites.component'
import {ErrorMessageComponent} from '../errorMessage/errorMessage.component'
import {LoadingComponent} from '../loading/loading.component'
import {PaginationComponent} from '../pagination/pagination.component'
import {TagListComponent} from '../tagList/tagList.component'
import {feedActions} from './store/actions'
import {selectError, selectFeedData, selectIsLoading} from './store/reducers'

/**
 * GIVEN — the most reuse-heavy component in the app. Read it, don't rewrite it.
 *
 * ONE component, ONE store slice, THREE routes (global / your feed / #tag).
 * The only thing that changes between them is the `[apiUrl]` input.
 *
 * That is the payoff of putting the list in the store: the page does not know
 * or care which endpoint it is showing. Change the input, dispatch, done.
 */
@Component({
  selector: 'mc-feed',
  imports: [
    CommonModule,
    RouterLink,
    ErrorMessageComponent,
    LoadingComponent,
    PaginationComponent,
    TagListComponent,
    AddToFavoritesComponent,
  ],
  templateUrl: './feed.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedComponent implements OnInit, OnChanges, OnDestroy {
  @Input() apiUrl = ''

  private store = inject(Store)
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  limit = environment.limit
  baseUrl = this.router.url.split('?')[0]
  currentPage = 1

  private queryParamsSubscription?: Subscription

  data$ = combineLatest({
    isLoading: this.store.select(selectIsLoading),
    error: this.store.select(selectError),
    feed: this.store.select(selectFeedData),
  })

  ngOnInit(): void {
    // Page number lives in the URL (?page=2), not in the store.
    // Reload the browser on /?page=2 and you get page 2 — that is why.
    this.queryParamsSubscription = this.route.queryParams.subscribe(() => {
      this.baseUrl = this.router.url.split('?')[0]
      this.currentPage = Number(this.route.snapshot.queryParamMap.get('page') ?? 1)
      this.fetchFeed()
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    // The router REUSES this component when you switch profile tabs
    // (/profiles/ana -> /profiles/ana/favorites). ngOnInit does not run again,
    // so without this the second tab would show the first tab's articles.
    const apiUrl = changes['apiUrl']
    if (apiUrl && !apiUrl.firstChange && apiUrl.currentValue !== apiUrl.previousValue) {
      this.fetchFeed()
    }
  }

  ngOnDestroy(): void {
    this.queryParamsSubscription?.unsubscribe()
  }

  /**
   * GIVEN. Builds the url with pagination and hands it to the store.
   * (The reference app used the `query-string` package for this; a plain
   *  URLSearchParams does the same job with zero dependencies.)
   */
  fetchFeed(): void {
    const offset = (this.currentPage - 1) * this.limit
    const [path, query] = this.apiUrl.split('?')
    const params = new URLSearchParams(query ?? '')
    params.set('limit', String(this.limit))
    params.set('offset', String(offset))

    this.store.dispatch(feedActions.getFeed({url: `${path}?${params.toString()}`}))
  }
}
