import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function RoleGuard({ roles = [], redirectTo = '/' }) {
  const { roles: userRoles } = useAuth()
  const allowed = roles.some((role) => userRoles.includes(role))

  if (!allowed) return <Navigate to={redirectTo} replace />

  return <Outlet />
}
