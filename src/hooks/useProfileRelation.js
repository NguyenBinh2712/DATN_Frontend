import { useCallback, useEffect, useState } from 'react'
import { friendApi } from '../api/friend.api'
import { blockApi } from '../api/block.api'
import { normalizeId, unwrapList } from '../utils/helpers'

export function useProfileRelation(targetUserId, currentUserId) {
  const [status, setStatus] = useState('loading')
  const [friendshipId, setFriendshipId] = useState(null)
  const [blocked, setBlocked] = useState(false)
  const [iBlockedThem, setIBlockedThem] = useState(false)

  const load = useCallback(async () => {
    const target = normalizeId(targetUserId)
    const current = normalizeId(currentUserId)

    if (!target || !current) return
    if (target === current) {
      setStatus('self')
      return
    }

    setStatus('loading')
    try {
      const [friendsRes, receivedRes, sentRes, blockCheckRes, myBlockedRes] = await Promise.all([
        friendApi.getFriends(),
        friendApi.getReceived(),
        friendApi.getSent(),
        blockApi.checkBlocked(target),
        blockApi.getMyBlocked(),
      ])

      const blockedList = new Set((myBlockedRes.data.result || []).map(normalizeId))
      setBlocked(blockCheckRes.data.result === true)
      setIBlockedThem(blockedList.has(target))

      const friends = unwrapList(friendsRes.data)
      const friend = friends.find((f) => normalizeId(f.userId) === target)
      if (friend) {
        setStatus('friend')
        setFriendshipId(friend.friendshipId)
        return
      }

      const received = unwrapList(receivedRes.data)
      const incoming = received.find((f) => normalizeId(f.userId) === target)
      if (incoming) {
        setStatus('received')
        setFriendshipId(incoming.friendshipId)
        return
      }

      const sent = unwrapList(sentRes.data)
      const outgoing = sent.find((f) => normalizeId(f.userId) === target)
      if (outgoing) {
        setStatus('sent')
        setFriendshipId(outgoing.friendshipId)
        return
      }

      setStatus('none')
      setFriendshipId(null)
    } catch {
      setStatus('none')
    }
  }, [targetUserId, currentUserId])

  useEffect(() => {
    load()
  }, [load])

  return { status, friendshipId, blocked, iBlockedThem, reload: load }
}
