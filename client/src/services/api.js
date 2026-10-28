import axios from 'axios'

// Determine base URL:
// Always use relative '/api' in browser environments unless a non-local external API URL is explicitly configured.
// This prevents mobile devices on LAN/preview/production from ever attempting to reach their own localhost:5000.
const getBaseURL = () => {
  const configured = import.meta.env.VITE_API_URL
  if (typeof window !== 'undefined') {
    if (!configured || configured.includes('localhost') || configured.includes('127.0.0.1')) {
      return '/api'
    }
    const host = window.location.hostname
    if (host === '0nprint.com' || host === 'www.0nprint.com') {
      return '/api'
    }
  }
  return configured || '/api'
}

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
})

export default api
