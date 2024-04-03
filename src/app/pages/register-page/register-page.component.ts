import { Component, inject } from '@angular/core';
import AuthService from '../../services/auth.service.js'
import { Router, RouterModule } from '@angular/router'
import { FirebaseError } from 'firebase/app'
import { GoogleLogInComponent } from '../../components/google-log-in/google-log-in.component.js'
import { SpinnerComponent } from '../../components/spinner/spinner.component.js'
import { LabelInputComponent } from '../../components/label-input/label-input.component.js'

interface RegisterFormData {
  email: string
  password: string
}

@Component({
  selector: 'app-register-page[data-page-component]',
  standalone: true,
  imports: [RouterModule, GoogleLogInComponent, SpinnerComponent, LabelInputComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {

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

    const { email, password } = Object.fromEntries(new FormData(form)) as unknown as RegisterFormData

    this.isLoading = true

    const userCredentials = await this._authService.signUp(email, password).catch((reason: FirebaseError) => reason)

    if (userCredentials instanceof FirebaseError) {
      console.warn(userCredentials)

      let message = ''

      switch (userCredentials.code) {

        case 'auth/invalid-email': {
          message = `The provided value for the email user property is invalid. It must be a string email address.`
        }
        break

        case 'auth/missing-password': {
          message = `The password cannot be empty.`
        }
        break

        case 'auth/weak-password': {
          message = `The provided value for the password user property is invalid. It must be a string with at least six characters.`
        }
        break

        case 'auth/email-already-in-use': {
          message = `The provided email is already in use by an existing user. Each user must have a unique email.`
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

  onGoogleSignUpStart() {
    this.isLoading = true
  }

  onGoogleSignUpSuccess() {
    this.isLoading = false
    this._router.navigateByUrl('/home')
  }

  onGoogleSignUpError(error: FirebaseError) {
    this.isLoading = false
    console.warn(error)
    alert(`No se puedo registrar o iniciar sesión con la cuenta de Google. ${error.message}`)
  }

}
