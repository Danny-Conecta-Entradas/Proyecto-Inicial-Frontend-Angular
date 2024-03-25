import { Component, inject } from '@angular/core';
import { SpinnerComponent } from '../../components/spinner/spinner.component.js'
import APIService, { APIModel } from '../../services/api.service.js'
import { InputComponent } from '../../components/input/input.component.js'

@Component({
  selector: 'app-home[data-page-component]',
  standalone: true,
  imports: [SpinnerComponent, InputComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  private _apiService = inject(APIService)

  isLoading = false

  onFormSubmit(event: SubmitEvent) {
    event.preventDefault()

    const form = event.target as HTMLFormElement | null

    if (!form) {
      return
    }

    const formData = Object.fromEntries(new FormData(form)) as unknown as Omit<APIModel, 'creation_date'>

    const currentDate = new Date()

    const creation_date = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`

    const resultData: APIModel = {...formData, creation_date}

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
