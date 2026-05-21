import { createContext, useContext, useEffect, useState } from 'react'
import { BASE_URL } from '../config'

interface User {
  id: string
  name: string
  email: string
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
    const res = await fetch(`${BASE_URL}/api/me`, { credentials: 'include' })
    setUser(res.ok ? await res.json() : null)
  }

  useEffect(() => {
    refreshUser().finally(() => setLoading(false))
  }, [])

  const logout = async () => {
    await fetch(`${BASE_URL}/api/logout`, { method: 'POST', credentials: 'include' })
    setUser(null)
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
