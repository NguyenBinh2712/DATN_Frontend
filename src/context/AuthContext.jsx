import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '../api/auth.api'
import { userApi } from '../api/user.api'
import { storage } from '../utils/storage'
import { getRolesFromToken, getUserIdFromToken, isTokenExpired } from '../utils/jwt'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setTokenState] = useState(() => storage.getToken())
  const [loading, setLoading] = useState(true)

  const roles = useMemo(() => getRolesFromToken(token), [token])
  const userId = useMemo(() => getUserIdFromToken(token), [token])

  const setToken = useCallback((newToken) => {
    if (newToken) {
      storage.setToken(newToken)
      setTokenState(newToken)
    } else {
      storage.removeToken()
      setTokenState(null)
    }
  }, [])

  const fetchMe = useCallback(async () => {
    const { data } = await userApi.getMe()
    setUser(data.result)
    return data.result
  }, [])

  const login = useCallback(async (credentials) => {
    const { data } = await authApi.login(credentials)
    const newToken = data.result?.token
    if (!newToken) throw new Error('Không nhận được token')
    setToken(newToken)
    const me = await fetchMe()
    return { token: newToken, user: me, roles: getRolesFromToken(newToken) }
  }, [setToken, fetchMe])

  const logout = useCallback(async () => {
    const currentToken = storage.getToken()
    try {
      if (currentToken) await authApi.logout({ token: currentToken })
    } catch {
      // ignore logout errors
    }
    setUser(null)
    setToken(null)
  }, [setToken])

  const refreshUser = useCallback(async () => {
    if (!storage.getToken()) return null
    return fetchMe()
  }, [fetchMe])

  useEffect(() => {
    const init = async () => {
      const saved = storage.getToken()
      if (!saved || isTokenExpired(saved)) {
        storage.removeToken()
        setLoading(false)
        return
      }
      try {
        await fetchMe()
      } catch {
        storage.removeToken()
        setTokenState(null)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [fetchMe])

  const value = useMemo(
    () => ({
      user,
      token,
      roles,
      userId,
      loading,
      isAuthenticated: !!token && !!user,
      isAdmin: roles.includes('ADMIN'),
      isTeacher: roles.includes('TEACHER'),
      isStudent: roles.includes('STUDENT'),
      login,
      logout,
      refreshUser,
      setToken,
    }),
    [user, token, roles, userId, loading, login, logout, refreshUser, setToken],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
