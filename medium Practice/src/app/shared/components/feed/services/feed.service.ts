import {HttpClient} from '@angular/common/http'
import {Injectable, inject} from '@angular/core'
import {Observable} from 'rxjs'
import {environment} from 'src/environments/environment'
import {GetFeedResponseInterface} from '../types/getFeedResponse.interface'

/**
 * GIVEN. One method, one URL — and that URL is the interesting part.
 *
 * The feed endpoint is the same for all three tabs, only the query string
 * changes:  /articles  |  /articles/feed  |  /articles?tag=angular
 * The component owns the query string; the service just prefixes the host.
 */
@Injectable({providedIn: 'root'})
export class FeedService {
  private http = inject(HttpClient)
  private apiUrl = environment.apiUrl

  getFeed(url: string): Observable<GetFeedResponseInterface> {
    const fullUrl = `${this.apiUrl}${url}`
    return this.http.get<GetFeedResponseInterface>(fullUrl)
  }
}
