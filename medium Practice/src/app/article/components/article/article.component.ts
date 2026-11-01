import {CommonModule} from '@angular/common'
import {ChangeDetectionStrategy, Component, OnInit, inject} from '@angular/core'
import {ActivatedRoute, RouterLink} from '@angular/router'
import {Store} from '@ngrx/store'
import {combineLatest} from 'rxjs'
import {ErrorMessageComponent} from 'src/app/shared/components/errorMessage/errorMessage.component'
import {LoadingComponent} from 'src/app/shared/components/loading/loading.component'
import {TagListComponent} from 'src/app/shared/components/tagList/tagList.component'
import {articleActions} from '../../store/actions'
import {selectArticleData, selectError, selectIsLoading} from '../../store/reducers'
import {selectIsAuthor} from '../../store/selectors'

/**
 * GIVEN — the only thing you install here is awareness.
 *
 * See the three store selects? Two come from the slice, one is the derived
 * cross-slice selector you write in S14. The template has no idea where the
 * data came from, which is the point.
 */
@Component({
  selector: 'mc-article',
  imports: [
    CommonModule,
    RouterLink,
    TagListComponent,
    ErrorMessageComponent,
    LoadingComponent,
  ],
  templateUrl: './article.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleComponent implements OnInit {
  private store = inject(Store)
  private route = inject(ActivatedRoute)

  slug = this.route.snapshot.paramMap.get('slug') ?? ''

  data$ = combineLatest({
    isLoading: this.store.select(selectIsLoading),
    error: this.store.select(selectError),
    article: this.store.select(selectArticleData),
    isAuthor: this.store.select(selectIsAuthor),
  })

  ngOnInit(): void {
    this.store.dispatch(articleActions.getArticle({slug: this.slug}))
  }

  deleteArticle(): void {
    this.store.dispatch(articleActions.deleteArticle())
  }
}
