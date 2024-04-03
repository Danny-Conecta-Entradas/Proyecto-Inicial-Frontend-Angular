import { Component, inject } from '@angular/core';
import AuthService from '../../services/auth.service.js'
import { Router, RouterModule } from '@angular/router'
import { FirebaseError } from 'firebase/app'
import { GoogleLogInComponent } from '../../components/google-log-in/google-log-in.component.js'
import { SpinnerComponent } from '../../components/spinner/spinner.component.js'
import { LabelInputComponent } from '../../components/label-input/label-input.component.js'

interface LoginFormData {
  email: string
  password: string
}


@Component({
  selector: 'app-login-page[data-page-component]',
  standalone: true,
  imports: [RouterModule, GoogleLogInComponent, SpinnerComponent, LabelInputComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  private _authService = inject(AuthService)

  private _router = inject(Router)

  isLoading = false

  async onFormSubmit(event: SubmitEvent): Promise<void> {
    event.preventDefault()

    if (this.isLoading) {
      return
    }

    const form = event.target as HTMLFormElement | null

    if (!form) {
      return
    }

    const { email, password } = Object.fromEntries(new FormData(form)) as unknown as LoginFormData

    this.isLoading = true

    const userCredentials = await this._authService.logIn(email, password).catch((reason: FirebaseError) => reason)

    if (userCredentials instanceof FirebaseError) {
      console.warn(userCredentials)

      let message = ''

      switch (userCredentials.code) {

        case 'auth/invalid-email': {
          message = `The provided value for the email is invalid. It must be a string email address.`
        }
        break

        case 'auth/missing-password': {
          message = `The password cannot be empty.`
        }
        break

        case 'auth/weak-password': {
          message = `The provided value for the password is invalid. It must be a string with at least six characters.`
        }
        break

        case 'auth/invalid-credential': {
          message = `Either password or email is incorrect.`
        }
        break

      }

      alert(message)

      this.isLoading = false
      return
    }

    this.isLoading = false
    this._router.navigateByUrl('/home')
  }

  onGoogleLogInStart() {
    this.isLoading = true
  }

  onGoogleLogInSuccess() {
    this.isLoading = false
    this._router.navigateByUrl('/home')
  }

  onGoogleLogInError(error: FirebaseError) {
    this.isLoading = false
    console.warn(error)
    alert(`No se puedo registrar o iniciar sesión con la cuenta de Google. ${error.message}`)
  }

}
