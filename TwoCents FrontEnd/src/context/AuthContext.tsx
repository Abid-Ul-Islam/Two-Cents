import { createContext, useContext, useEffect, useState } from 'react'
import { BASE_URL } from '../config'

interface User {
  id: string
  name: string
  email: string
  gender?: string
}

interface AuthContextValue {
  user: User | null
  isLoggedIn: boolean
  loading: boolean
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    let res = await fetch(`${BASE_URL}/api/me`, { credentials: 'include' })
    if (res.status === 401) {
      const refreshed = await fetch(`${BASE_URL}/api/refresh`, { method: 'POST', credentials: 'include' })
      if (refreshed.ok) {
        res = await fetch(`${BASE_URL}/api/me`, { credentials: 'include' })
      }
    }
    if (res.ok) {
      setUser(await res.json())
      localStorage.setItem('hadSession', '1')
    } else {
      setUser(null)
      localStorage.removeItem('hadSession')
    }
  }

  useEffect(() => {
    refreshUser().finally(() => setLoading(false))
  }, [])

  const logout = async () => {
    await fetch(`${BASE_URL}/api/logout`, { method: 'POST', credentials: 'include' })
    setUser(null)
    localStorage.removeItem('hadSession')
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
