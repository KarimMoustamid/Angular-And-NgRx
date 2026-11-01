import {Routes} from '@angular/router'
import {LoginComponent} from './components/login/login.component'
import {RegisterComponent} from './components/register/register.component'

export const loginRoutes: Routes = [
  {path: '', component: LoginComponent},
]

export const registerRoutes: Routes = [
  {path: '', component: RegisterComponent},
]
