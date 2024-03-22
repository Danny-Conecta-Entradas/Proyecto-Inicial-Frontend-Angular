import { Component, inject } from '@angular/core';
import AuthService from '../../services/auth.service.js'
import { Router } from '@angular/router'
import { SpinnerComponent } from '../../components/spinner/spinner.component.js'

@Component({
  selector: 'app-home[data-page-component]',
  standalone: true,
  imports: [SpinnerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  readonly API_ORIGIN = 'https://proyecto-inicial-backend-agk6kyxhfa-uc.a.run.app/'

  private _authService = inject(AuthService)

  private _router = inject(Router)

  isLoading = false

  async sendData(data: FormData): Promise<unknown> {
    const endpoint = new URL('/api/send-data/', this.API_ORIGIN)

    const stringifiedData = JSON.stringify(data)

    const response = await fetch(endpoint, {
      method: 'POST',
      body: stringifiedData,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return await response.json()
  }

  async logOut() {
    this.isLoading = true
    await this._authService.logOut()
    this.isLoading = false

    this._router.navigateByUrl('/')
  }

  onFormSubmit(event: SubmitEvent) {
    event.preventDefault()

    const form = event.target as HTMLFormElement | null

    if (!form) {
      return
    }

    const formData = Object.fromEntries(new FormData(form)) as {qr_string: string}

    const resultData: FormData = {...formData, timestamp: Date.now()}

    console.log(resultData)

    this.isLoading = true

    this.sendData(resultData)
    .then(() => alert('Data uploaded successfuly.'))
    .catch((reason: unknown) => {
      console.warn(reason)
      alert('An error occurred after submiting the form.')
    })
    .finally(() => this.isLoading = false)
  }

}

interface FormData {
  qr_string: string
  timestamp: number
}
