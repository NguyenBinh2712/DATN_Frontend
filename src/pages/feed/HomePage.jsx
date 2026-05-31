import { useCallback, useEffect, useRef, useState } from 'react'
import { postApi } from '../../api/post.api'
import CreatePostBox from '../../components/post/CreatePostBox'
import PostCard from '../../components/post/PostCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getErrorMessage } from '../../utils/helpers'
import { useBlockedUsers } from '../../hooks/useBlockedUsers'

export default function HomePage() {
  const { filterPosts } = useBlockedUsers()
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [reactions, setReactions] = useState({})
  const [error, setError] = useState('')
  const observerRef = useRef(null)
  const loadMoreRef = useRef(null)

  const loadReactions = async (postList) => {
    const map = {}
    await Promise.all(
      postList.map(async (p) => {
        try {
          const { data } = await postApi.getMyReaction(p.id)
          if (data.result) map[p.id] = data.result
        } catch {
          // not logged in reaction fetch may fail on public - but we're protected
        }
      }),
    )
    setReactions((prev) => ({ ...prev, ...map }))
  }

  const fetchFeed = useCallback(async (pageNum, append = false) => {
    try {
      const { data } = await postApi.getFeed(pageNum, 10)
      const slice = data.result
      const content = filterPosts(slice?.content || [])
      setHasMore(!slice?.last)
      setPosts((prev) => (append ? [...prev, ...content] : content))
      await loadReactions(content)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }, [filterPosts])

  useEffect(() => {
    setLoading(true)
    fetchFeed(0).finally(() => setLoading(false))
  }, [fetchFeed])

  useEffect(() => {
    if (!hasMore || loadingMore) return
    const el = loadMoreRef.current
    if (!el) return

    observerRef.current?.disconnect()
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setLoadingMore(true)
          const next = page + 1
          fetchFeed(next, true)
            .then(() => setPage(next))
            .finally(() => setLoadingMore(false))
        }
      },
      { threshold: 0.1 },
    )
    observerRef.current.observe(el)
    return () => observerRef.current?.disconnect()
  }, [hasMore, loadingMore, page, fetchFeed])

  const handleReact = async (postId, type) => {
    try {
      const { data } = await postApi.react(postId, type)
      setPosts((prev) => prev.map((p) => (p.id === postId ? data.result : p)))
      const { data: reactData } = await postApi.getMyReaction(postId)
      setReactions((prev) => ({ ...prev, [postId]: reactData.result }))
    } catch (err) {
      alert(getErrorMessage(err))
    }
  }

  const handleCreated = (post) => {
    setPosts((prev) => [post, ...prev])
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="fade-in-up space-y-4">
      <CreatePostBox onCreated={handleCreated} />
      {error && (
        <div className="fade-in rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          myReaction={reactions[post.id]}
          onReact={handleReact}
        />
      ))}
      {posts.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 p-10 text-center">
          <div className="mb-3 text-4xl">📭</div>
          <p className="font-medium text-slate-500">Chưa có bài viết nào</p>
        </div>
      )}
      {hasMore && (
        <div ref={loadMoreRef} className="py-4 text-center text-sm text-muted">
          {loadingMore ? 'Đang tải thêm...' : 'Cuộn để xem thêm'}
        </div>
      )}
    </div>
  )
}
