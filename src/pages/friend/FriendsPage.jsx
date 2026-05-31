import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { friendApi } from '../../api/friend.api'
import { FriendListItem, RecommendCard } from '../../components/friend/FriendCards'
import { Button } from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getErrorMessage, normalizeId, unwrapList } from '../../utils/helpers'

const TABS = [
  { id: 'list', label: 'Bạn bè' },
  { id: 'received', label: 'Lời mời nhận' },
  { id: 'sent', label: 'Đã gửi' },
  { id: 'recommend', label: 'Gợi ý' },
]

export default function FriendsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') || 'list'

  const [friends, setFriends] = useState([])
  const [received, setReceived] = useState([])
  const [sent, setSent] = useState([])
  const [recommend, setRecommend] = useState([])

  const [initialLoading, setInitialLoading] = useState(true)
  const [tabRefreshing, setTabRefreshing] = useState(false)

  /** Map userId -> friendshipId cho lời mời đã gửi */
  const [sentByUserId, setSentByUserId] = useState({})
  const [friendIds, setFriendIds] = useState(new Set())
  const [receivedByUserId, setReceivedByUserId] = useState({})

  const buildRelationMaps = useCallback((friendsList, sentList, receivedList) => {
    setFriendIds(new Set(friendsList.map((f) => normalizeId(f.userId))))
    setSentByUserId(
      Object.fromEntries(
        sentList.map((f) => [normalizeId(f.userId), f.friendshipId]),
      ),
    )
    setReceivedByUserId(
      Object.fromEntries(
        receivedList.map((f) => [normalizeId(f.userId), f.friendshipId]),
      ),
    )
  }, [])

  const loadCoreRelations = useCallback(async () => {
    const [friendsRes, sentRes, receivedRes] = await Promise.all([
      friendApi.getFriends(),
      friendApi.getSent(),
      friendApi.getReceived(),
    ])
    const friendsList = unwrapList(friendsRes.data)
    const sentList = unwrapList(sentRes.data)
    const receivedList = unwrapList(receivedRes.data)

    setFriends(friendsList)
    setSent(sentList)
    setReceived(receivedList)
    buildRelationMaps(friendsList, sentList, receivedList)

    return { friendsList, sentList, receivedList }
  }, [buildRelationMaps])

  const loadRecommend = useCallback(async () => {
    const { data } = await friendApi.getRecommend(20)
    setRecommend(unwrapList(data))
  }, [])

  const loadTabData = useCallback(
    async (silent = false) => {
      if (!silent) setTabRefreshing(true)
      try {
        if (tab === 'recommend') {
          await Promise.all([loadCoreRelations(), loadRecommend()])
        } else {
          await loadCoreRelations()
        }
      } catch (err) {
        alert(getErrorMessage(err))
      } finally {
        setTabRefreshing(false)
        setInitialLoading(false)
      }
    },
    [tab, loadCoreRelations, loadRecommend],
  )

  useEffect(() => {
    loadTabData()
  }, [loadTabData])

  const run = async (fn) => {
    try {
      await fn()
      await loadTabData(true)
    } catch (err) {
      alert(getErrorMessage(err))
    }
  }

  const getRecommendStatus = (userId) => {
    const uid = normalizeId(userId)
    if (friendIds.has(uid)) return 'friend'
    if (sentByUserId[uid]) return 'sent'
    if (receivedByUserId[uid]) return 'received'
    return 'none'
  }

  const tabBadge = (tabId) => {
    if (tabId === 'received' && received.length > 0) return received.length
    if (tabId === 'sent' && sent.length > 0) return sent.length
    return null
  }

  if (initialLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Bạn bè</h1>
        <LoadingSpinner className="py-20" />
      </div>
    )
  }

  return (
    <div className="fade-in-up space-y-4">
      <h1 className="text-2xl font-bold">Bạn bè</h1>

      <div className="flex flex-wrap gap-2 border-b border-border pb-2">
        {TABS.map((t) => {
          const badge = tabBadge(t.id)
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSearchParams({ tab: t.id })}
              className={`relative rounded-lg px-4 py-2 text-sm font-medium transition ${
                tab === t.id ? 'bg-primary text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.label}
              {badge != null && (
                <span
                  className={`ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs ${
                    tab === t.id ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
                  }`}
                >
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {tabRefreshing && (
        <div className="flex items-center gap-2 text-sm text-muted">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          Đang cập nhật...
        </div>
      )}

      {tab === 'list' && (
        <div className={`space-y-3 ${tabRefreshing ? 'opacity-60' : ''}`}>
          {friends.map((f) => (
            <FriendListItem
              key={f.friendshipId ?? f.userId}
              friend={f}
              actions={
                <Button
                  variant="danger"
                  className="!py-1 !text-xs"
                  onClick={() => {
                    if (!confirm('Hủy kết bạn?')) return
                    run(() => friendApi.unfriend(f.userId))
                  }}
                >
                  Hủy kết bạn
                </Button>
              }
            />
          ))}
          {friends.length === 0 && !tabRefreshing && (
            <p className="text-center text-muted">Chưa có bạn bè</p>
          )}
        </div>
      )}

      {tab === 'received' && (
        <div className={`space-y-3 ${tabRefreshing ? 'opacity-60' : ''}`}>
          {received.map((f) => (
            <FriendListItem
              key={f.friendshipId ?? f.userId}
              friend={f}
              subtitle="Muốn kết bạn với bạn"
              actions={
                <div className="flex gap-2">
                  <Button
                    className="!py-1 !text-xs"
                    onClick={() => run(() => friendApi.acceptRequest(f.friendshipId))}
                  >
                    Chấp nhận
                  </Button>
                  <Button
                    variant="secondary"
                    className="!py-1 !text-xs"
                    onClick={() => run(() => friendApi.rejectRequest(f.friendshipId))}
                  >
                    Từ chối
                  </Button>
                </div>
              }
            />
          ))}
          {received.length === 0 && !tabRefreshing && (
            <p className="text-center text-muted">Không có lời mời kết bạn</p>
          )}
        </div>
      )}

      {tab === 'sent' && (
        <div className={`space-y-3 ${tabRefreshing ? 'opacity-60' : ''}`}>
          {sent.map((f) => (
            <FriendListItem
              key={f.friendshipId ?? f.userId}
              friend={f}
              subtitle="Đang chờ phản hồi"
              actions={
                <Button
                  variant="secondary"
                  className="!py-1 !text-xs"
                  onClick={() => run(() => friendApi.cancelRequest(f.friendshipId))}
                >
                  Hủy lời mời
                </Button>
              }
            />
          ))}
          {sent.length === 0 && !tabRefreshing && (
            <p className="text-center text-muted">Chưa gửi lời mời nào</p>
          )}
        </div>
      )}

      {tab === 'recommend' && (
        <div className={`grid gap-4 sm:grid-cols-2 ${tabRefreshing ? 'opacity-60' : ''}`}>
          {recommend.map((u) => {
            const status = getRecommendStatus(u.userId)
            return (
              <RecommendCard
                key={u.userId}
                user={u}
                status={status}
                onAdd={
                  status === 'none'
                    ? () => run(() => friendApi.sendRequest(u.userId))
                    : undefined
                }
                onAccept={
                  status === 'received'
                    ? () => run(() => friendApi.acceptRequest(receivedByUserId[normalizeId(u.userId)]))
                    : undefined
                }
              />
            )
          })}
          {recommend.length === 0 && !tabRefreshing && (
            <p className="col-span-full text-center text-muted">Không có gợi ý</p>
          )}
        </div>
      )}
    </div>
  )
}
