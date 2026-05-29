import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { userApi } from '../../api/user.api'
import { postApi } from '../../api/post.api'
import { useAuth } from '../../context/AuthContext'
import { useProfileRelation } from '../../hooks/useProfileRelation'
import { useBlockedUsers } from '../../hooks/useBlockedUsers'
import ProfileRelationActions from '../../components/friend/ProfileRelationActions'
import PostCard from '../../components/post/PostCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { Button } from '../../components/common/Button'
import { Input, Textarea } from '../../components/common/Input'
import { getErrorMessage } from '../../utils/helpers'

export default function ProfilePage() {
  const { id } = useParams()
  const { userId: currentUserId, refreshUser } = useAuth()
  const targetId = id === 'me' ? currentUserId : Number(id)
  const isMe = id === 'me' || targetId === currentUserId

  const { status, friendshipId, blocked, iBlockedThem, reload } = useProfileRelation(
    targetId,
    currentUserId,
  )
  const { filterPosts, isBlocked } = useBlockedUsers()

  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [profileForm, setProfileForm] = useState({ fullName: '', bio: '' })
  const [reactions, setReactions] = useState({})
  const loadMoreRef = useRef(null)

  const loadUser = useCallback(async () => {
    const { data } = isMe ? await userApi.getMe() : await userApi.getById(targetId)
    setUser(data.result)
    setProfileForm({
      fullName: data.result.profile?.fullName || '',
      bio: data.result.profile?.bio || '',
    })
  }, [isMe, targetId])

  const loadPosts = useCallback(
    async (pageNum, append = false) => {
      if (!isMe && (blocked || isBlocked(targetId))) {
        setPosts([])
        setHasMore(false)
        return
      }
      const { data } = await postApi.getUserPosts(targetId, pageNum, 10)
      const slice = data.result
      const content = filterPosts(slice?.content || [])
      setHasMore(!slice?.last)
      setPosts((prev) => (append ? [...prev, ...content] : content))
    },
    [targetId, isMe, blocked, isBlocked, filterPosts],
  )

  useEffect(() => {
    setLoading(true)
    Promise.all([loadUser(), loadPosts(0)]).finally(() => setLoading(false))
  }, [loadUser, loadPosts])

  useEffect(() => {
    const el = loadMoreRef.current
    if (!el || !hasMore) return
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const next = page + 1
        loadPosts(next, true).then(() => setPage(next))
      }
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [hasMore, page, loadPosts])

  const saveProfile = async () => {
    try {
      await userApi.updateProfile(profileForm)
      await loadUser()
      await refreshUser()
      setEditing(false)
    } catch (err) {
      alert(getErrorMessage(err))
    }
  }

  const handleAvatar = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      await userApi.changeAvatar(file)
      await loadUser()
      await refreshUser()
    } catch (err) {
      alert(getErrorMessage(err))
    }
  }

  const handleReact = async (postId, type) => {
    const { data } = await postApi.react(postId, type)
    setPosts((prev) => prev.map((p) => (p.id === postId ? data.result : p)))
    const { data: r } = await postApi.getMyReaction(postId)
    setReactions((prev) => ({ ...prev, [postId]: r.result }))
  }

  const handleRelationUpdate = () => {
    reload()
    loadPosts(0)
  }

  if (loading) return <LoadingSpinner />
  if (!user) return null

  const hidePosts = !isMe && (blocked || isBlocked(targetId))

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="relative">
            {user.profile?.avatarUrl ? (
              <img
                src={user.profile.avatarUrl}
                alt=""
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                {(user.profile?.fullName || user.email)[0].toUpperCase()}
              </div>
            )}
            {isMe && (
              <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-primary px-2 py-1 text-xs text-white">
                Đổi
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
              </label>
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            {editing ? (
              <div className="space-y-2">
                <Input
                  label="Họ tên"
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm((f) => ({ ...f, fullName: e.target.value }))}
                />
                <Textarea
                  label="Bio"
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm((f) => ({ ...f, bio: e.target.value }))}
                />
                <div className="flex gap-2">
                  <Button onClick={saveProfile}>Lưu</Button>
                  <Button variant="secondary" onClick={() => setEditing(false)}>
                    Hủy
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold">{user.profile?.fullName || 'Chưa cập nhật tên'}</h1>
                <p className="text-muted">{user.email}</p>
                {user.profile?.bio && <p className="mt-2 text-sm">{user.profile.bio}</p>}
                {isMe && (
                  <Button variant="secondary" className="mt-3" onClick={() => setEditing(true)}>
                    Chỉnh sửa hồ sơ
                  </Button>
                )}
              </>
            )}

            {!isMe && (
              <ProfileRelationActions
                targetUserId={targetId}
                status={status}
                friendshipId={friendshipId}
                blocked={blocked}
                iBlockedThem={iBlockedThem}
                onUpdate={handleRelationUpdate}
              />
            )}
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold">Bài viết</h2>
      {hidePosts ? (
        <p className="rounded-xl border border-border bg-white p-6 text-center text-muted">
          Không thể xem nội dung của người dùng này
        </p>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              myReaction={reactions[post.id]}
              onReact={handleReact}
            />
          ))}
          {posts.length === 0 && (
            <p className="text-center text-muted">Chưa có bài viết</p>
          )}
          {hasMore && <div ref={loadMoreRef} className="py-4 text-center text-sm text-muted" />}
        </>
      )}
    </div>
  )
}
