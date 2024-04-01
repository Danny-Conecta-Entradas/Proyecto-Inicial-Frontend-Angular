import { captureVideoFrameAsBlob } from './video-utils.js'

export default async function requestWebcamScreenShot(): Promise<Blob> {
  const mediaStream: MediaStream | Error = await navigator.mediaDevices.getUserMedia({video: true}).catch(reason => reason)

  if (mediaStream instanceof Error) {
    throw mediaStream
  }

  function disableTracks(mediaStream: MediaStream) {
    for (const track of mediaStream.getTracks()) {
      mediaStream.removeTrack(track)
    }
  }

  function onFinish() {
    overlay.remove()
    abortController.abort()
  }

  const overlay = document.createElement('div')

  overlay.dataset.overlayWebcam = ''

  overlay.addEventListener('click', event => {
    if (event.eventPhase !== Event.AT_TARGET) {
      return
    }

    disableTracks(mediaStream)

    onFinish()
  })

  Object.assign(overlay.style, {
    position: 'fixed',
    'z-index': 9999999999,
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

    onFinish()
  }, {signal: abortController.signal})

  document.body.append(overlay)


  return new Promise((resolve, reject) => {
    // Detect device change in case camera is disconnected
    navigator.mediaDevices.addEventListener('devicechange', async event => {
      const devices = await navigator.mediaDevices.enumerateDevices()

      for (const device of devices) {
        if (device.kind === 'videoinput') {
          return
        }
      }

      onFinish()

      reject(new Error(`Video device was disconnected, try again.`))
    }, {signal: abortController.signal})

    buttonCapture.addEventListener('click', async event => {
      const videoFrameBlob: Blob | Error = await captureVideoFrameAsBlob(video).catch(reason => reason)

      if (videoFrameBlob instanceof Error) {
        reject(videoFrameBlob)
      }
      else {
        resolve(videoFrameBlob)
      }

      disableTracks(mediaStream)

      onFinish()
    }, {once: true})
  })
}
