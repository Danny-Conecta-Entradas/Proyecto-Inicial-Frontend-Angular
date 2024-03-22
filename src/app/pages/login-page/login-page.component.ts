import { Component, inject } from '@angular/core';
import AuthService from '../../services/auth.service.js'
import { Router, RouterModule } from '@angular/router'
import { FirebaseError } from 'firebase/app'
import { GoogleLogInComponent } from '../../components/google-log-in/google-log-in.component.js'

interface LoginFormData {
  email: string
  password: string
}


@Component({
  selector: 'app-login-page[data-page-component]',
  standalone: true,
  imports: [RouterModule, GoogleLogInComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  private _authService = inject(AuthService)

  private _router = inject(Router)

  async onFormSubmit(event: SubmitEvent): Promise<void> {
    const form = event.target as HTMLFormElement | null

    if (!form) {
      return
    }

    event.preventDefault()

    const { email, password } = Object.fromEntries(new FormData(form)) as unknown as LoginFormData

    const userCredentials = await this._authService.logIn(email, password).catch((reason: FirebaseError) => reason)

    if (userCredentials instanceof FirebaseError) {
      console.warn(userCredentials)
      alert(`No se ha podido registrar la cuenta. Error: ${userCredentials.message}`)
      return
    }

    this._router.navigateByUrl('/home')
  }

  onGoogleLogInSuccess() {
    this._router.navigateByUrl('/home')
  }

  onGoogleLogInError(error: FirebaseError) {
    console.warn(error)
    alert(`No se puedo registrar o iniciar sesión con la cuenta de Google. ${error.message}`)
  }

}
