export function getWsBrokerUrl() {
  if (import.meta.env.VITE_WS_URL) return import.meta.env.VITE_WS_URL
  const api = import.meta.env.VITE_API_URL || 'http://localhost:8080'
  try {
    const url = new URL(api)
    const wsProto = url.protocol === 'https:' ? 'wss:' : 'ws:'
    const path = url.pathname.replace(/\/$/, '')
    return `${wsProto}//${url.host}${path}/ws-chat`
  } catch {
    return 'ws://localhost:8080/ws-chat'
  }
}
