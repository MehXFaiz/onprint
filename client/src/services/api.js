import axios from 'axios'

// In production the frontend and API are served from the same domain (GoDaddy
// single-process deployment), so a relative /api path is correct.
// In local dev, the Vite proxy forwards /api → localhost:5000, so /api also works.
// VITE_API_URL can still override this for any other hosting setup.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
})

export default api
