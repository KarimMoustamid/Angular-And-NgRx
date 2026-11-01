import {CommonModule} from '@angular/common'
import {ChangeDetectionStrategy, Component, inject} from '@angular/core'
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {RouterLink} from '@angular/router'
import {Store} from '@ngrx/store'
import {combineLatest} from 'rxjs'
import {BackendErrorMessagesComponent} from 'src/app/shared/components/backendErrorMessages/backendErrorMessages.component'
import {authActions} from '../../store/actions'
import {selectIsSubmitting, selectValidationErrors} from '../../store/reducers'

/** GIVEN. Same shape as login — register just sends three fields instead of two. */
@Component({
  selector: 'mc-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, BackendErrorMessagesComponent],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private store = inject(Store)
  private formBuilder = inject(NonNullableFormBuilder)

  form = this.formBuilder.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  })

  data$ = combineLatest({
    isSubmitting: this.store.select(selectIsSubmitting),
    backendErrors: this.store.select(selectValidationErrors),
  })

  onSubmit(): void {
    const request = {user: this.form.getRawValue()}
    this.store.dispatch(authActions.register({request}))
  }
}
