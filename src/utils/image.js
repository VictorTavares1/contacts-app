const MAX_DIMENSION = 400
const JPEG_QUALITY = 0.8

/**
 * Converts an image file into a resized JPEG data URL.
 * Pictures are stored in localStorage (~5MB total), so they are
 * downscaled to keep many contacts within that limit.
 */
export function imageFileToDataUrl(file, maxDimension = MAX_DIMENSION) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('The selected file is not an image.'))
      return
    }

    const objectUrl = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      const scale = Math.min(1, maxDimension / Math.max(image.width, image.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(image.width * scale)
      canvas.height = Math.round(image.height * scale)

      const context = canvas.getContext('2d')
      context.fillStyle = '#fff' // JPEG has no transparency; avoid black backgrounds.
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, canvas.width, canvas.height)

      URL.revokeObjectURL(objectUrl) // Free the temporary URL from memory.
      resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY))
    }

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Could not load the selected image.'))
    }

    image.src = objectUrl
  })
}