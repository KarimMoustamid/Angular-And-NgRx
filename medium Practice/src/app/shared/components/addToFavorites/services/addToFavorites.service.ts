import {HttpClient} from '@angular/common/http'
import {Injectable, inject} from '@angular/core'
import {Observable, map} from 'rxjs'
import {environment} from 'src/environments/environment'
import {ArticleInterface} from 'src/app/shared/types/article.interface'
import {ArticleResponseInterface} from 'src/app/shared/types/articleResponse.interface'

/** GIVEN. The two calls the favourites button needs: favourite / unfavourite. */
@Injectable({providedIn: 'root'})
export class AddToFavoritesService {
  private http = inject(HttpClient)
  private apiUrl = environment.apiUrl

  addToFavorites(slug: string): Observable<ArticleInterface> {
    const url = `${this.apiUrl}/articles/${slug}/favorite`
    return this.http
      .post<ArticleResponseInterface>(url, {})
      .pipe(map((response) => response.article))
  }

  removeFromFavorites(slug: string): Observable<ArticleInterface> {
    const url = `${this.apiUrl}/articles/${slug}/favorite`
    return this.http
      .delete<ArticleResponseInterface>(url)
      .pipe(map((response) => response.article))
  }
}
