import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

// Automatically recover from stale chunk / preload errors on mobile & desktop after deployments
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    let alreadyReloaded = window.location.search.includes('_r=1')
    try {
      if (window.sessionStorage.getItem('chunk_reload_attempted')) {
        alreadyReloaded = true
      } else {
        window.sessionStorage.setItem('chunk_reload_attempted', 'true')
      }
    } catch {
      // Ignore storage SecurityError in restricted mobile WebViews
    }
    if (!alreadyReloaded) {
      event.preventDefault()
      const sep = window.location.search ? '&' : '?'
      window.location.replace(window.location.pathname + window.location.search + sep + '_r=1')
    }
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
