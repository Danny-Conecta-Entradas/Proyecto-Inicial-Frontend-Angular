import { Component, OnInit, inject } from '@angular/core';
import AuthService from '../../services/auth.service.js'
import { Router, RouterModule } from '@angular/router'

interface RegisterFormData {
  email: string
  password: string
}

@Component({
  selector: 'app-register-page[data-page-component]',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {

  private _authService = inject(AuthService)

  private _router = inject(Router)

  async onFormSubmit(event: SubmitEvent): Promise<void> {
    const form = event.target as HTMLFormElement | null

    if (!form) {
      return
    }

    event.preventDefault()

    const { email, password } = Object.fromEntries(new FormData(form)) as unknown as RegisterFormData

    const userCredentials = await this._authService.signUp(email, password).catch((reason: any) => new Error(reason))

    if (userCredentials instanceof Error) {
      console.error(userCredentials)
      alert(`No se ha podido registrar la cuenta. Error: ${userCredentials.message}`)
      return
    }

    this._router.navigateByUrl('/home')
  }

}
