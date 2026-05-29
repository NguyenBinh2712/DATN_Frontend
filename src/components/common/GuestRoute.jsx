import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function GuestRoute() {
  const { isAuthenticated, loading, isAdmin, isTeacher } = useAuth()

  if (loading) return null

  if (isAuthenticated) {
    if (isAdmin) return <Navigate to="/admin" replace />
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
