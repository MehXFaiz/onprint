import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

const TOKEN_KEY = 'onprint_auth_token'
const LEGACY_USER_KEY = 'onprint_auth_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verify token & restore session from MySQL backend on initial mount
  useEffect(() => {
    async function restoreSession() {
      // Clear legacy hardcoded user storage if present
      localStorage.removeItem(LEGACY_USER_KEY)

      const token = localStorage.getItem(TOKEN_KEY)
      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }

      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        const { data } = await api.get('/auth/me')
        if (data?.success && data?.user) {
          setUser(data.user)
        } else {
          logout()
        }
      } catch {
        // Token invalid, expired, or server unreachable
        logout()
      } finally {
        setLoading(false)
      }
    }

    restoreSession()
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    if (data?.token && data?.user) {
      localStorage.setItem(TOKEN_KEY, data.token)
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      setUser(data.user)
      return data.user
    }
    throw new Error(data?.message || 'Login failed')
  }

  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData)
    if (data?.token && data?.user) {
      localStorage.setItem(TOKEN_KEY, data.token)
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      setUser(data.user)
      return data.user
    }
    throw new Error(data?.message || 'Registration failed')
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(LEGACY_USER_KEY)
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: Boolean(user && (user.role === 'admin' || user.role === 'ADMINISTRATOR')),
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
