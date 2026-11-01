import {ChangeDetectionStrategy, Component, Input} from '@angular/core'

/**
 * GIVEN. Renders a failed request.
 *
 * Notice what is NOT here: no HTTP call, no retry button, no knowledge of where
 * the message came from. The component only knows "somebody handed me a string".
 * That is what makes it reusable across feed / article / profile / tags.
 */
@Component({
  selector: 'mc-error-message',
  template: '<div class="error-message">{{ message }}</div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorMessageComponent {
  @Input() message: string | null = 'Something went wrong'
}
