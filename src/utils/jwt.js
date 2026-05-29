import { jwtDecode } from 'jwt-decode'

export function decodeToken(token) {
  if (!token) return null
  try {
    return jwtDecode(token)
  } catch {
    return null
  }
}

export function getRolesFromToken(token) {
  const payload = decodeToken(token)
  if (!payload?.scope) return []
  return String(payload.scope).split(' ').filter(Boolean)
}

export function getUserIdFromToken(token) {
  const payload = decodeToken(token)
  return payload?.userId ?? null
}

export function isTokenExpired(token) {
  const payload = decodeToken(token)
  if (!payload?.exp) return true
  return payload.exp * 1000 < Date.now()
}

export function hasRole(token, role) {
  return getRolesFromToken(token).includes(role)
}
