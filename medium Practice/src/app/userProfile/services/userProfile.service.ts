import {HttpClient} from '@angular/common/http'
import {Injectable, inject} from '@angular/core'
import {Observable, map} from 'rxjs'
import {environment} from 'src/environments/environment'
import {UserProfileInterface} from '../types/userProfile.interface'
import {GetUserProfileResponseInterface} from '../types/getUserProfileResponse.interface'

/** GIVEN. */
@Injectable({providedIn: 'root'})
export class UserProfileService {
  private http = inject(HttpClient)
  private apiUrl = environment.apiUrl

  getUserProfile(slug: string): Observable<UserProfileInterface> {
    const url = `${this.apiUrl}/profiles/${slug}`
    return this.http
      .get<GetUserProfileResponseInterface>(url)
      .pipe(map((response) => response.profile))
  }
}
