import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'onprint_auth_user'

export const DEMO_USERS = [
  {
    _id: 'user-admin-1',
    name: 'ONPRINT Admin',
    email: 'admin@onprint.ae',
    password: 'admin123',
    role: 'admin',
    company: 'ONPRINT Printing Press LLC',
  },
  {
    _id: 'user-client-1',
    name: 'Sarah Al-Maktoum',
    email: 'client@onprint.ae',
    password: 'password123',
    role: 'customer',
    company: 'Dubai Luxury Gifts LLC',
    phone: '+971 50 123 4567',
  },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    // Default logged in user for instant preview experience
    return DEMO_USERS[0]
  })

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // ignore
    }
  }, [user])

  const login = async (email, password) => {
    const trimmedEmail = email.trim().toLowerCase()
    
    // Check demo users first
    const foundDemo = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === trimmedEmail && u.password === password
    )

    if (foundDemo) {
      setUser(foundDemo)
      return foundDemo
    }

    // Default fallback auth logic for custom entered credentials
    const role = trimmedEmail.includes('admin') ? 'admin' : 'customer'
    const newUser = {
      _id: `user-${Date.now()}`,
      name: email.split('@')[0] || 'User',
      email,
      role,
      company: role === 'admin' ? 'ONPRINT Press' : 'Corporate Client',
    }
    setUser(newUser)
    return newUser
  }

  const register = async (userData) => {
    const newUser = {
      _id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      company: userData.company || 'Private Customer',
      role: 'customer',
    }
    setUser(newUser)
    return newUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
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
