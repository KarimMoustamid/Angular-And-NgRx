import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core'
import {RouterLink} from '@angular/router'
import {UtilsService} from '../../services/utils.service'

/**
 * GIVEN. Builds the page numbers from a total count.
 *
 * Note the inputs: `url` is the page we are on ("/" or "/tags/angular"), and
 * `currentPage` comes from the query string. The component never talks to the
 * store — pagination is pure URL state. That is deliberate: the URL is the
 * source of truth for "which page am I looking at".
 */
@Component({
  selector: 'mc-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent implements OnChanges {
  @Input() total = 0
  @Input() limit = 10
  @Input() url = ''
  @Input() currentPage = 1

  pagesCount = 0
  pages: number[] = []

  constructor(private utilsService: UtilsService) {}

  ngOnChanges(): void {
    this.pagesCount = Math.ceil(this.total / this.limit)
    this.pages =
      this.pagesCount > 0
        ? this.utilsService.range(1, this.pagesCount + 1)
        : []
  }
}
