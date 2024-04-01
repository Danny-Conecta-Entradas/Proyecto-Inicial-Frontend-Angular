export async function captureVideoFrameAsBlob(video: HTMLVideoElement): Promise<Blob> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  ctx.drawImage(video, 0, 0)

  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error(`Canvas couldn't be read as Blob.`))
          return
        }

        resolve(blob)
      })
    } catch (reason) {
      reject(reason)
    }
  })
}
