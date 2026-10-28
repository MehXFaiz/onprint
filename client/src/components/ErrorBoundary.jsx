import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    if (
      error?.name === 'ChunkLoadError' ||
      String(error?.message).includes('Failed to fetch dynamically imported module') ||
      String(error?.message).includes('Importing a module script failed')
    ) {
      const reloaded = sessionStorage.getItem('chunk_reload_attempted')
      if (!reloaded) {
        sessionStorage.setItem('chunk_reload_attempted', 'true')
        window.location.reload()
      }
    }
  }

  handleReload = () => {
    sessionStorage.removeItem('chunk_reload_attempted')
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#040A18] px-4 text-center">
          <div className="max-w-md rounded-2xl bg-[#081226] p-8 shadow-2xl border border-[#122240] text-[#F5F2EB]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15 text-red-400 mb-4 border border-red-500/30">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-[#F5F2EB]">Something went wrong</h1>
            <p className="mt-2 text-sm text-[#B0BECE]">
              An unexpected error occurred while loading this page. Please try refreshing.
            </p>
            <div className="mt-6 flex gap-3 justify-center">
              <button
                type="button"
                onClick={this.handleReload}
                className="rounded-xl bg-[#D4AF65] px-5 py-2.5 text-sm font-bold text-[#040A18] shadow-md hover:bg-[#D4AF65]/90 transition cursor-pointer"
              >
                Refresh Page
              </button>
              <a
                href="/"
                className="rounded-xl border border-[#122240] bg-[#040A18] px-5 py-2.5 text-sm font-bold text-[#F5F2EB] hover:border-[#D4AF65] hover:text-[#D4AF65] transition"
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
