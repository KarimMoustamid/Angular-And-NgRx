import {HttpClient} from '@angular/common/http'
import {Injectable, inject} from '@angular/core'
import {Observable, map} from 'rxjs'
import {environment} from 'src/environments/environment'
import {ArticleInterface} from 'src/app/shared/types/article.interface'
import {ArticleResponseInterface} from 'src/app/shared/types/articleResponse.interface'

/** GIVEN. */
@Injectable({providedIn: 'root'})
export class ArticleService {
  private http = inject(HttpClient)
  private apiUrl = environment.apiUrl

  getArticle(slug: string): Observable<ArticleInterface> {
    const url = `${this.apiUrl}/articles/${slug}`
    return this.http
      .get<ArticleResponseInterface>(url)
      .pipe(map((response) => response.article))
  }

  deleteArticle(slug: string): Observable<{}> {
    const url = `${this.apiUrl}/articles/${slug}`
    return this.http.delete<{}>(url)
  }
}
