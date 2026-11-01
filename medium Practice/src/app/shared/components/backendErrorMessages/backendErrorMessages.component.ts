import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core'
import {BackendErrorsInterface} from '../../types/backendErrors.interface'

/**
 * GIVEN. Turns the API's validation payload into a flat list of sentences.
 *
 * The API answers 422 with:
 *   {errors: {email: ["has already been taken"], password: ["is too short"]}}
 * This component renders "email has already been taken", one line each.
 */
@Component({
  selector: 'mc-backend-error-messages',
  imports: [],
  templateUrl: './backendErrorMessages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackendErrorMessagesComponent implements OnChanges {
  @Input() backendErrors: BackendErrorsInterface | null = null

  errorMessages: string[] = []

  ngOnChanges(): void {
    if (!this.backendErrors) {
      this.errorMessages = []
      return
    }

    this.errorMessages = Object.keys(this.backendErrors).map((name) => {
      const messages = this.backendErrors![name].join(' ')
      return `${name} ${messages}`
    })
  }
}
