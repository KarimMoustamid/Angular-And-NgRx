import {Injectable} from '@angular/core'

/**
 * Tiny wrapper around localStorage. GIVEN — not an exercise.
 *
 * Why a wrapper at all? Because localStorage does not exist on the server, and
 * because JSON.parse throws on garbage. One place to handle both.
 *
 * The auth token lives here (not in the store) so that a page reload can
 * re-hydrate it before the first HTTP request goes out.
 */
@Injectable({providedIn: 'root'})
export class PersistanceService {
  set(key: string, data: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (e) {
      console.error('Error saving to local storage', e)
    }
  }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : null
    } catch (e) {
      console.error('Error getting from local storage', e)
      return null
    }
  }
}
