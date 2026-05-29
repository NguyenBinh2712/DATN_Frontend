import { useCallback, useEffect, useState } from 'react'
import { blockApi } from '../api/block.api'

export function useBlockedUsers() {
  const [blockedIds, setBlockedIds] = useState(new Set())
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const { data } = await blockApi.getMyBlocked()
      setBlockedIds(new Set(data.result || []))
    } catch {
      setBlockedIds(new Set())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const isBlocked = useCallback(
    (userId) => blockedIds.has(userId),
    [blockedIds],
  )

  const filterPosts = useCallback(
    (posts) => posts.filter((p) => !blockedIds.has(p.user?.id)),
    [blockedIds],
  )

  return { blockedIds, loading, refresh, isBlocked, filterPosts }
}
