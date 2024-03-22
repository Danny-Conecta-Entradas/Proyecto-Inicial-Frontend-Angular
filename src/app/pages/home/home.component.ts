import { Component, inject } from '@angular/core';
import AuthService from '../../services/auth.service.js'
import { Router } from '@angular/router'
import { SpinnerComponent } from '../../components/spinner/spinner.component.js'
import APIService, { APIModel } from '../../services/api.service.js'

@Component({
  selector: 'app-home[data-page-component]',
  standalone: true,
  imports: [SpinnerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  private _authService = inject(AuthService)

  private _router = inject(Router)

  private _apiService = inject(APIService)

  isLoading = false

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

    const formData = Object.fromEntries(new FormData(form)) as unknown as Omit<APIModel, 'timestamp'>

    // Transform date string from `<form>` to number
    formData.birth_date = new Date(formData.birth_date).getTime()

    const resultData: APIModel = {...formData, timestamp: Date.now()}

    console.log(resultData)

    this.isLoading = true

    this._apiService.sendData(resultData)
    .then(() => alert('Data uploaded successfuly.'))
    .catch((reason: unknown) => {
      console.warn(reason)
      alert('An error occurred after submiting the form.')
    })
    .finally(() => this.isLoading = false)
  }

}
