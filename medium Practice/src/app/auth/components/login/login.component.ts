import {CommonModule} from '@angular/common'
import {ChangeDetectionStrategy, Component, OnInit, inject} from '@angular/core'
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {RouterLink} from '@angular/router'
import {Store} from '@ngrx/store'
import {combineLatest} from 'rxjs'
import {BackendErrorMessagesComponent} from 'src/app/shared/components/backendErrorMessages/backendErrorMessages.component'
import {authActions} from '../../store/actions'
import {selectIsSubmitting, selectValidationErrors} from '../../store/reducers'

/**
 * GIVEN. The component is boring on purpose — the interesting part is the last
 * line of ngOnInit.
 *
 * The component does NOT call the API. It says "someone asked to log in, here
 * are the credentials" and returns. Everything after that — the request, the
 * token, the redirect, the error rendering — is the store's job.
 *
 * That is the whole point of the pattern: the view never owns a request.
 */
@Component({
  selector: 'mc-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, BackendErrorMessagesComponent],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  private store = inject(Store)
  private formBuilder = inject(NonNullableFormBuilder)

  form = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  })

  data$ = combineLatest({
    isSubmitting: this.store.select(selectIsSubmitting),
    backendErrors: this.store.select(selectValidationErrors),
  })

  ngOnInit(): void {
    // S3 exercises: open the Network tab, click Sign In, and count how many
    // times this line runs before the reducer/effect exist (hint: the request
    // never leaves the browser, because nothing is listening yet).
  }

  onSubmit(): void {
    const request = {user: this.form.getRawValue()}
    this.store.dispatch(authActions.login({request}))
  }
}
