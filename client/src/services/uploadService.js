import api from './api'

/**
 * Upload a single image file to the backend
 * @param {File} file - File object to upload
 * @param {Function} onProgress - Optional callback for upload progress (0-100)
 * @returns {Promise<{success: boolean, url: string, filename: string}>}
 */
export async function uploadImage(file, onProgress) {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const { data } = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(percent)
        }
      },
    })
    return data
  } catch (err) {
    if (err.message === 'Network Error' || !err.response) {
      // Offline / Local preview fallback: create a blob URL
      const mockUrl = URL.createObjectURL(file)
      return {
        success: true,
        url: mockUrl,
        filename: file.name,
      }
    }
    throw new Error(err?.response?.data?.message || err?.message || 'Failed to upload image.')
  }
}

/**
 * Upload multiple image files to the backend
 * @param {File[]} files - Array of File objects to upload
 * @param {Function} onProgress - Optional callback for upload progress
 * @returns {Promise<{success: boolean, urls: string[], data: Array}>}
 */
export async function uploadImages(files, onProgress) {
  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))

  try {
    const { data } = await api.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(percent)
        }
      },
    })
    return data
  } catch (err) {
    if (err.message === 'Network Error' || !err.response) {
      const mockUrls = files.map((file) => URL.createObjectURL(file))
      return {
        success: true,
        urls: mockUrls,
        data: files.map((f, i) => ({ url: mockUrls[i], filename: f.name })),
      }
    }
    throw new Error(err?.response?.data?.message || err?.message || 'Failed to upload images.')
  }
}
