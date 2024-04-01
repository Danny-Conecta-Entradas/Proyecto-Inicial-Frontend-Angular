import { Component, inject } from '@angular/core';
import { LabelInputComponent } from '../label-input/label-input.component.js'
import APIService, { APIModel } from '../../services/api.service.js'
import { SpinnerComponent } from '../spinner/spinner.component.js'
import requestWebcamScreenShot from '../../../utils/request-webcam-screenshot.js'

@Component({
  selector: 'app-edit-data',
  standalone: true,
  imports: [LabelInputComponent, SpinnerComponent],
  templateUrl: './edit-data.component.html',
  styleUrl: './edit-data.component.css'
})
export class EditDataComponent {

  private _apiService = inject(APIService)

  isLoading = false

  prefillData = {} as APIModel

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

    const updatedData: APIModel = {...this.prefillData, ...formData}

    this.isLoading = true

    this._apiService.editData(updatedData)
    .then(() => {
      alert('Data updated successfuly.')

      for (const successListener of this._successListeners) {
        try {
          successListener()
        } catch (reason) {
          console.error(reason)
        }
      }

      this._failureListeners.clear()
    })
    .catch(reason => {
      console.warn(reason)
      alert(`An error occurred while updating the data.`)

      for (const failureListener of this._failureListeners) {
        try {
          failureListener(reason)
        } catch (reason) {
          console.error(reason)
        }
      }

      this._failureListeners.clear()
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

  private _successListeners = new Set<() => void>()

  onSuccess(listener: () => void) {
    this._successListeners.add(listener)
  }

  private _failureListeners = new Set<(reason: unknown) => void>()

  onFailure(listener: (reason: unknown) => void) {
    this._failureListeners.add(listener)
  }

  waitForResult(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.onSuccess(() => resolve())
      this.onFailure(() => reject())
    })
  }

}
