import { Component, OnInit, inject } from '@angular/core';
import { SpinnerComponent } from '../../components/spinner/spinner.component.js'
import APIService, { APIModel } from '../../services/api.service.js'
import { LabelInputComponent } from '../../components/label-input/label-input.component.js'
import requestWebcamScreenShot from '../../../utils/request-webcam-screenshot.js'

@Component({
  selector: 'app-home[data-page-component]',
  standalone: true,
  imports: [SpinnerComponent, LabelInputComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  private _apiService = inject(APIService)

  isLoading = false

  onFormSubmit(event: SubmitEvent) {
    event.preventDefault()

    if (this.isLoading) {
      return
    }

    const form = event.target as HTMLFormElement | null

    if (!form) {
      return
    }

    const formData = Object.fromEntries(new FormData(form)) as unknown as Omit<APIModel, 'creation_date'>

    const creation_date = Date.now()

    const birth_date = new Date(formData.birth_date).getTime()

    const resultData: APIModel = {...formData, birth_date, creation_date}

    console.log(resultData)

    this.isLoading = true

    this._apiService.sendData(resultData)
    .then(() => alert('Data uploaded successfuly.'))
    .catch((reason) => {
      console.warn(reason)
      alert(`An error occurred after submiting the form.\n${reason.message}`)
    })
    .finally(() => this.isLoading = false)
  }

  webcamFile: File | null = null

  async requestWebcamScreenShotHandler() {
    const blob = await requestWebcamScreenShot().catch(reason => reason)

    if (blob instanceof Error) {
      alert(`An error happened while working with the webcam.\n${blob.message}`)
      return
    }

    const file = new File([blob], 'webcam.png', {type: blob.type})
    this.webcamFile = file
  }

}
