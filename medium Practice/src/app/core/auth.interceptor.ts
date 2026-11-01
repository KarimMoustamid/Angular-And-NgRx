import {HttpInterceptorFn} from '@angular/common/http'
import {inject} from '@angular/core'
import {PersistanceService} from './persistance.service'

/**
 * GIVEN — read it, don't change it (stage S6 asks you a question about it).
 *
 * Every outgoing request gets `Authorization: Bearer <token>` if we have a
 * token in localStorage. The API uses that header to answer "who is asking?".
 *
 * Note the shape: a functional interceptor is just a function
 * `(req, next) => Observable<HttpEvent>`, registered in app.config.ts.
 *
 * Discussion point for S6: the token is read from localStorage, not from the
 * store. What breaks if you read it from the store instead?
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const persistanceService = inject(PersistanceService)
  const token = persistanceService.get<string>('accessToken')

  if (!token) {
    return next(req)
  }

  return next(
    req.clone({setHeaders: {Authorization: `Bearer ${token}`}})
  )
}
