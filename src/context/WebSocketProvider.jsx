import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'
import { useAuth } from './AuthContext'
import { storage } from '../utils/storage'
import { getWsBrokerUrl } from '../utils/ws'

const WebSocketContext = createContext(null)

export function WebSocketProvider({ children }) {
  const { isAuthenticated, token } = useAuth()
  const clientRef = useRef(null)
  const [connected, setConnected] = useState(false)
  const subscriptionsRef = useRef(new Map())

  const disconnect = useCallback(() => {
    subscriptionsRef.current.forEach((sub) => sub.unsubscribe())
    subscriptionsRef.current.clear()
    clientRef.current?.deactivate()
    clientRef.current = null
    setConnected(false)
  }, [])

  useEffect(() => {
    if (!isAuthenticated || !token) {
      disconnect()
      return
    }

    const client = new Client({
      brokerURL: getWsBrokerUrl(),
      connectHeaders: { Authorization: `Bearer ${storage.getToken()}` },
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => setConnected(true),
      onDisconnect: () => setConnected(false),
      onStompError: () => setConnected(false),
    })

    clientRef.current = client
    client.activate()

    return () => disconnect()
  }, [isAuthenticated, token, disconnect])

  const subscribe = useCallback((destination, callback, key) => {
    const client = clientRef.current
    if (!client?.connected) return () => {}

    const subKey = key || destination
    const existing = subscriptionsRef.current.get(subKey)
    existing?.unsubscribe()

    const sub = client.subscribe(destination, (message) => {
      try {
        callback(JSON.parse(message.body))
      } catch {
        callback(message.body)
      }
    })
    subscriptionsRef.current.set(subKey, sub)
    return () => {
      sub.unsubscribe()
      subscriptionsRef.current.delete(subKey)
    }
  }, [])

  const subscribeUser = useCallback(
    (queue, callback, key) => subscribe(`/user${queue}`, callback, key),
    [subscribe],
  )

  const subscribeConversation = useCallback(
    (convId, callback) =>
      subscribe(`/topic/conversation.${convId}`, callback, `conv-${convId}`),
    [subscribe],
  )

  const unsubscribeConversation = useCallback((convId) => {
    const sub = subscriptionsRef.current.get(`conv-${convId}`)
    sub?.unsubscribe()
    subscriptionsRef.current.delete(`conv-${convId}`)
  }, [])

  return (
    <WebSocketContext.Provider
      value={{
        connected,
        subscribe,
        subscribeUser,
        subscribeConversation,
        unsubscribeConversation,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocket() {
  const ctx = useContext(WebSocketContext)
  if (!ctx) throw new Error('useWebSocket must be used within WebSocketProvider')
  return ctx
}
