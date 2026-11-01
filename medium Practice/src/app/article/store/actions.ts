import {createActionGroup, emptyProps, props} from '@ngrx/store'
import {ArticleInterface} from 'src/app/shared/types/article.interface'

/**
 * GIVEN — do not edit.
 *
 * Notice what is NOT in here: `isAuthor`, `comments`, `follow`. Only what the
 * server can tell us. Derived values belong in selectors, not in actions.
 */
export const articleActions = createActionGroup({
  source: 'article',
  events: {
    'Get article': props<{slug: string}>(),
    'Get article success': props<{article: ArticleInterface}>(),
    'Get article failure': emptyProps(),

    'Delete article': emptyProps(),
    'Delete article success': emptyProps(),
    'Delete article failure': emptyProps(),
  },
})
