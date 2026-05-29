import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { notificationApi } from '../api/notification.api'
import { useAuth } from './AuthContext'
import { useWebSocket } from './WebSocketProvider'
import { getNotificationPath } from '../utils/notificationNav'
import { unwrapList } from '../utils/helpers'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const { connected, subscribeUser } = useWebSocket()
  const navigate = useNavigate()

  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const refreshUnread = useCallback(async () => {
    try {
      const { data } = await notificationApi.getUnreadCount()
      setUnreadCount(data.result ?? 0)
    } catch {
      setUnreadCount(0)
    }
  }, [])

  const loadNotifications = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await notificationApi.getAll(0, 30)
      const slice = data.result
      setNotifications(slice?.content || unwrapList(data))
      await refreshUnread()
    } finally {
      setLoading(false)
    }
  }, [refreshUnread])

  const prependNotification = useCallback((n) => {
    if (!n?.id) return
    setNotifications((prev) => {
      if (prev.some((x) => x.id === n.id)) return prev
      return [n, ...prev]
    })
    if (!n.isRead) setUnreadCount((c) => c + 1)
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return
    refreshUnread()
    loadNotifications()
  }, [isAuthenticated, refreshUnread, loadNotifications])

  useEffect(() => {
    if (!connected || !isAuthenticated) return

    const unsubs = [
      subscribeUser('/queue/notifications', prependNotification, 'notif-plural'),
      subscribeUser('/queue/notification', (event) => {
        if (event?.type === 'MESSAGE') {
          setUnreadCount((c) => c + 1)
        }
      }, 'notif-chat'),
    ]

    return () => unsubs.forEach((fn) => fn())
  }, [connected, isAuthenticated, subscribeUser, prependNotification])

  const markAllRead = async () => {
    await notificationApi.markAllRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    setUnreadCount(0)
  }

  const handleClick = (notification) => {
    setOpen(false)
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)),
    )
    if (!notification.isRead) {
      setUnreadCount((c) => Math.max(0, c - 1))
    }
    navigate(getNotificationPath(notification))
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        open,
        setOpen,
        loading,
        loadNotifications,
        refreshUnread,
        markAllRead,
        handleClick,
        prependNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}
