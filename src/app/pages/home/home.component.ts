import { Component, OnInit, inject } from '@angular/core';
import AuthService from '../../services/auth.service.js'

@Component({
  selector: 'app-home[data-page-component]',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  readonly API_ORIGIN = 'https://proyecto-inicial-backend-agk6kyxhfa-uc.a.run.app/'

  private _authService = inject(AuthService)

  async ngOnInit(): Promise<void> {
    console.log(await this._authService.isUserLogged())
  }

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

  onFormSubmit(event: SubmitEvent) {
    event.preventDefault()

    const form = event.target as HTMLFormElement | null

    if (!form) {
      return
    }

    const formData = Object.fromEntries(new FormData(form)) as {qr_string: string}

    const resultData: FormData = {...formData, timestamp: Date.now()}

    console.log(resultData)

    this.sendData(resultData)
    .then(() => alert('Data uploaded successfuly.'))
    .catch((reason: unknown) => {
      console.error(reason)
      alert('An error occurred after submiting the form.')
    })
  }

}

interface FormData {
  qr_string: string
  timestamp: number
}
