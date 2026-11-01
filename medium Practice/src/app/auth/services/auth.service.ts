import {HttpClient} from '@angular/common/http'
import {Injectable, inject} from '@angular/core'
import {Observable, map} from 'rxjs'
import {environment} from 'src/environments/environment'
import {AuthResponseInterface} from '../types/authResponse.interface'
import {LoginRequestInterface} from '../types/loginRequest.interface'
import {RegisterRequestInterface} from '../types/registerRequest.interface'
import {CurrentUserInterface} from 'src/app/shared/types/currentUser.interface'

/**
 * GIVEN. Plain HTTP. No state, no store, nothing clever.
 *
 * This is the boundary: everything "smart" (when to call, what to do with the
 * answer, what to do on failure) lives in the effect. The service only knows how
 * to talk to the API.
 */
@Injectable({providedIn: 'root'})
export class AuthService {
  private http = inject(HttpClient)
  private apiUrl = environment.apiUrl

  register(data: RegisterRequestInterface): Observable<CurrentUserInterface> {
    const url = `${this.apiUrl}/users`
    return this.http
      .post<AuthResponseInterface>(url, data)
      .pipe(map((response) => response.user))
  }

  login(data: LoginRequestInterface): Observable<CurrentUserInterface> {
    const url = `${this.apiUrl}/users/login`
    return this.http
      .post<AuthResponseInterface>(url, data)
      .pipe(map((response) => response.user))
  }

  /** Used on app start: "who am I?" — the token in the header answers it. */
  getCurrentUser(): Observable<CurrentUserInterface> {
    const url = `${this.apiUrl}/user`
    return this.http
      .get<AuthResponseInterface>(url)
      .pipe(map((response) => response.user))
  }
}
