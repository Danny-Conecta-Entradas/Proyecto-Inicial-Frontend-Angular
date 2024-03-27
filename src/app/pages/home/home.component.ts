import { Component, OnInit, inject } from '@angular/core';
import { SpinnerComponent } from '../../components/spinner/spinner.component.js'
import APIService, { APIModel } from '../../services/api.service.js'
import { LabelInputComponent } from '../../components/label-input/label-input.component.js'

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

  webcamFile: File | null = null

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

    const currentDate = new Date()

    const year = currentDate.getFullYear()
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
    const day = currentDate.getDate()
    const creation_date = `${year}-${month}-${day}`

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

  async requestWebcamScreenShot() {
    const mediaStream: MediaStream | Error = await navigator.mediaDevices.getUserMedia({video: true}).catch(reason => reason)

    if (mediaStream instanceof Error) {
      alert(`An error happened requesting the webcam.\nError: ${mediaStream.message}`)
      return
    }

    function disableTracks(mediaStream: MediaStream) {
      for (const track of mediaStream.getTracks()) {
        mediaStream.removeTrack(track)
      }
    }

    const overlay = document.createElement('div')

    overlay.dataset.overlayWebcam = ''

    overlay.addEventListener('click', event => {
      if (event.eventPhase !== Event.AT_TARGET) {
        return
      }

      disableTracks(mediaStream)

      overlay.remove()

      abortController.abort()
    })

    Object.assign(overlay.style, {
      position: 'fixed',
      'z-index': 99,
      inset: 0,
      margin: 'auto',
      width: '100%',
      height: '100%',
      display: 'flex',
      'flex-direction': 'column',
      'justify-content': 'center',
      'align-items': 'center',
      'row-gap': '1rem',
      'background-color': '#000a',
    })


    const video = overlay.appendChild(
      document.createElement('video')
    )

    Object.assign(video, {
      srcObject: mediaStream,
      autoplay: true,
    })

    Object.assign(video.style, {
      width: '400px',
      height: '300px',
      'max-width': '100%',
      transform: 'scaleX(-1)',
    })

    const buttonCapture = overlay.appendChild(
      document.createElement('button')
    )

    buttonCapture.innerText = 'Capture Image'

    Object.assign(buttonCapture.style, {
      padding: '1rem',
      'border-radius': '0.4rem',
      'background-color': '#06f',
    })

    const abortController = new AbortController()

    document.addEventListener('keyup', event => {
      if (event.code !== 'Escape') {
        return
      }

      disableTracks(mediaStream)

      overlay.remove()
      abortController.abort()
    }, {signal: abortController.signal})

    buttonCapture.addEventListener('click', async event => {
      const videoFrameBlob: Blob | Error = await captureVideoScreenShotAsBlob(video).catch(reason => reason)

      if (videoFrameBlob instanceof Error) {
        alert(`Unable to take capture screenshot of webcam.\nError: ${videoFrameBlob.message}`)
        overlay.remove()
        abortController.abort()
        return
      }

      const file = new File([videoFrameBlob], 'webcam.png', {type: videoFrameBlob.type})

      this.webcamFile = file

      disableTracks(mediaStream)

      overlay.remove()
      abortController.abort()
    }, {once: true})

    document.body.append(overlay)


    // Detect device change in case camera is disconnected
    navigator.mediaDevices.addEventListener('devicechange', async event => {
      const devices = await navigator.mediaDevices.enumerateDevices()

      for (const device of devices) {
        if (!(device instanceof InputDeviceInfo)) {
          continue
        }

        if (device.kind === 'videoinput') {
          return
        }
      }

      alert(`Video device was disconnected, try again.`)

      overlay.remove()

      abortController.abort()
    }, {signal: abortController.signal})
  }
}


async function captureVideoScreenShotAsBlob(video: HTMLVideoElement): Promise<Blob> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  ctx.drawImage(video, 0, 0)

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) {
        reject(new Error(`Canvas couldn't be read as Blob.`))
        return
      }

      resolve(blob)
    })
  })
}
