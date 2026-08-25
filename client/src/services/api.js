import axios from 'axios'

// Determine base URL:
// If running in browser on 0nprint.com, www.0nprint.com, or local dev, use relative '/api'
// This completely avoids CORS errors from preview or staging URLs.
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    if (host === '0nprint.com' || host === 'www.0nprint.com' || host === 'localhost' || host === '127.0.0.1') {
      return '/api'
    }
  }
  return import.meta.env.VITE_API_URL || '/api'
}

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
})

export default api
