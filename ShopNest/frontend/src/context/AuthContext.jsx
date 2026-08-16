import { createContext, useContext, useEffect, useState } from 'react'
import * as authApi from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('shopnest_user')
    if (stored) setUser(JSON.parse(stored))
    setLoading(false)
  }, [])

  const persist = (auth) => {
    localStorage.setItem('shopnest_token', auth.token)
    localStorage.setItem(
      'shopnest_user',
      JSON.stringify({ id: auth.userId, fullName: auth.fullName, email: auth.email, role: auth.role })
    )
    setUser({ id: auth.userId, fullName: auth.fullName, email: auth.email, role: auth.role })
  }

  const login = async (email, password) => {
    const auth = await authApi.login({ email, password })
    persist(auth)
    return auth
  }

  const register = async (payload) => {
    const auth = await authApi.register(payload)
    persist(auth)
    return auth
  }

  const logout = () => {
    localStorage.removeItem('shopnest_token')
    localStorage.removeItem('shopnest_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'ADMIN' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
