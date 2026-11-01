import {HttpClient} from '@angular/common/http'
import {Injectable, inject} from '@angular/core'
import {Observable, map} from 'rxjs'
import {environment} from 'src/environments/environment'
import {PopularTagType} from 'src/app/shared/types/popularTag.type'
import {GetPopularTagsResponseInterface} from '../types/getPopularTagsResponse.interface'

/** GIVEN. GET /tags -> ["angular", "ngrx", ...] */
@Injectable({providedIn: 'root'})
export class PopularTagService {
  private http = inject(HttpClient)
  private apiUrl = environment.apiUrl

  getPopularTags(): Observable<PopularTagType[]> {
    return this.http
      .get<GetPopularTagsResponseInterface>(`${this.apiUrl}/tags`)
      .pipe(map((response) => response.tags))
  }
}
