import {Injectable} from '@angular/core'

/** GIVEN. Turns (start, end) into [start..end-1]. Used to build page numbers. */
@Injectable({providedIn: 'root'})
export class UtilsService {
  range(start: number, end: number): number[] {
    return [...Array(end - start).keys()].map((el) => el + start)
  }
}
