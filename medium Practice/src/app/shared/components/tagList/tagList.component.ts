import {ChangeDetectionStrategy, Component, Input} from '@angular/core'
import {PopularTagType} from '../../types/popularTag.type'

/** GIVEN. Presentational: renders the tags it is given, nothing else. */
@Component({
  selector: 'mc-tag-list',
  imports: [],
  templateUrl: './tagList.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagListComponent {
  @Input() tags: PopularTagType[] = []
}
