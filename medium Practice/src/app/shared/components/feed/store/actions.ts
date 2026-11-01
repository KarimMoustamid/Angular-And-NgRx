import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ArticleInterface } from 'src/app/shared/types/article.interface';
import { GetFeedResponseInterface } from '../types/getFeedResponse.interface';

export const feedActions = createActionGroup({
  source: 'feed',
  events: {
    'Get feed': props<{ url: string }>(),
    'Get feed success': props<{ feed: GetFeedResponseInterface }>(),
    'Get feed failure': emptyProps(),

    // ---------------------------------------------------------------
    // STAGE S13 — this action exists so the favourites effect has
    // somewhere to put the updated article. Look at where it is handled:
    // NOT in this feature's reducer... actually it is, but its job is to
    // patch ONE row inside `data.articles`, not the whole list.
    // ---------------------------------------------------------------
    'Update article in list': props<{ article: ArticleInterface }>(),
  },
});
