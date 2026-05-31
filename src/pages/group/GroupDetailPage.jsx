import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { groupApi } from '../../api/group.api'
import { friendApi } from '../../api/friend.api'
import { postApi } from '../../api/post.api'
import { quizApi } from '../../api/quiz.api'
import { useAuth } from '../../context/AuthContext'
import CreatePostBox from '../../components/post/CreatePostBox'
import PostCard from '../../components/post/PostCard'
import { Button } from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getErrorMessage } from '../../utils/helpers'
import { useBlockedUsers } from '../../hooks/useBlockedUsers'

export default function GroupDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { userId } = useAuth()
  const { blockedIds } = useBlockedUsers()

  const [group, setGroup] = useState(null)
  const [members, setMembers] = useState([])
  const [posts, setPosts] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [friends, setFriends] = useState([])
  const [friendsLoading, setFriendsLoading] = useState(false)
  const [invitedFriendIds, setInvitedFriendIds] = useState(new Set())
  const [tab, setTab] = useState('feed')
  const [loading, setLoading] = useState(true)
  const [isMember, setIsMember] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [reactions, setReactions] = useState({})
  const [quizzes, setQuizzes] = useState([])
  const [quizzesLoading, setQuizzesLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const loadMoreRef = useRef(null)

  const loadGroup = useCallback(async () => {
    const { data } = await groupApi.getDetail(id)
    setGroup(data.result)
    setIsOwner(data.result.ownerId === userId)
  }, [id, userId])

  const loadMembers = useCallback(async () => {
    try {
      const { data } = await groupApi.getMembers(id)
      const list = data.result || []
      setMembers(list)
      const me = list.find((m) => m.userId === userId)
      setIsMember(!!me)
    } catch {
      setIsMember(false)
    }
  }, [id, userId])

  const loadFeed = useCallback(
    async (pageNum, append = false, blocked = blockedIds) => {
      const { data } = await groupApi.getFeed(id, pageNum, 10)
      const raw = data.result?.content || []
      const content = raw.filter((p) => !blocked.has(p.user?.id))
      setHasMore(!data.result?.last)
      setPosts((prev) => (append ? [...prev, ...content] : content))
    },
    [id, blockedIds],
  )

  const loadPending = useCallback(async () => {
    try {
      const { data: groupData } = await groupApi.getDetail(id)
      if (groupData.result?.ownerId !== userId) return
      const { data } = await groupApi.getPendingRequests(id)
      setPendingRequests(data.result || [])
    } catch {
      setPendingRequests([])
    }
  }, [id, userId])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([loadGroup(), loadMembers()])
      .then(() => loadFeed(0))
      .then(() => loadPending())
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, userId])

  useEffect(() => {
    if (!loading) loadFeed(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockedIds])

  useEffect(() => {
    const el = loadMoreRef.current
    if (!el || !hasMore || tab !== 'feed') return
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const next = page + 1
        loadFeed(next, true).then(() => setPage(next))
      }
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [hasMore, page, loadFeed, tab])

  const run = async (fn, reloadMembers = false) => {
    try {
      await fn()
      await loadGroup()
      if (reloadMembers) await loadMembers()
      await loadPending()
    } catch (err) {
      alert(getErrorMessage(err))
    }
  }

  const handleJoin = () => run(() => groupApi.requestJoin(id))
  const handleCancelJoin = () => run(() => groupApi.cancelJoinRequest(id))
  const handleLeave = () => {
    if (!confirm('Rời nhóm này?')) return
    run(() => groupApi.leave(id), true)
  }

  const loadFriendsForInvite = async () => {
    setFriendsLoading(true)
    setTab('invite')
    try {
      const { data } = await friendApi.getFriends()
      setFriends(data.result || [])
    } catch (err) {
      alert(getErrorMessage(err))
    } finally {
      setFriendsLoading(false)
    }
  }

  const handleInviteFriend = async (friendId) => {
    try {
      await groupApi.inviteFriend(id, friendId)
      setInvitedFriendIds((prev) => new Set(prev).add(friendId))
    } catch (err) {
      alert(getErrorMessage(err))
    }
  }

  const memberIds = new Set(members.map((m) => m.userId))
  const inviteableFriends = friends.filter((f) => !memberIds.has(f.userId))

  const loadQuizzes = useCallback(async () => {
    setQuizzesLoading(true)
    try {
      const { data } = await quizApi.getByGroup(id)
      setQuizzes(data.result || [])
    } catch {
      setQuizzes([])
    } finally {
      setQuizzesLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (tab === 'quizzes' && isMember) loadQuizzes()
  }, [tab, isMember, loadQuizzes])

  const handleReact = async (postId, type) => {
    const { data } = await postApi.react(postId, type)
    setPosts((prev) => prev.map((p) => (p.id === postId ? data.result : p)))
    const { data: r } = await postApi.getMyReaction(postId)
    setReactions((prev) => ({ ...prev, [postId]: r.result }))
  }

  if (loading) return <LoadingSpinner />
  if (!group) return null

  return (
    <div className="fade-in-up space-y-4">
      <Link to="/groups" className="text-sm text-primary hover:underline">
        ← Quay lại nhóm
      </Link>

      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div
          className="h-32 bg-cover bg-center"
          style={
            group.coverImageUrl
              ? { backgroundImage: `url(${group.coverImageUrl})` }
              : { background: "linear-gradient(135deg,#667eea 0%,#764ba2 50%,#c84b9e 100%)" }
          }
        />
        <div className="p-5">
          <h1 className="text-2xl font-bold">{group.name}</h1>
          <p className="mt-1 text-sm text-muted">{group.description}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm text-muted">
            <span>{group.memberCount} thành viên</span>
            <span>·</span>
            <span>{group.privacy}</span>
            <span>·</span>
            <span>Owner: {group.ownerName}</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {!isMember && (
              <Button onClick={handleJoin}>Yêu cầu tham gia</Button>
            )}
            {isMember && !isOwner && (
              <Button variant="secondary" onClick={handleLeave}>
                Rời nhóm
              </Button>
            )}
            {isOwner && (
              <>
                <Button
                  variant="danger"
                  onClick={async () => {
                    if (!confirm('Xóa nhóm vĩnh viễn?')) return
                    try {
                      await groupApi.delete(id)
                      navigate('/groups/my')
                    } catch (err) {
                      alert(getErrorMessage(err))
                    }
                  }}
                >
                  Xóa nhóm
                </Button>
                <Button variant="secondary" onClick={loadFriendsForInvite}>
                  Tải danh sách bạn để mời
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-b border-border pb-2">
        {['feed', 'members', 'quizzes', ...(isOwner ? ['requests', 'invite'] : [])].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            style={tab === t ? { background: "linear-gradient(135deg,#667eea,#c84b9e)" } : {}}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              tab === t
                ? "text-white shadow-lg shadow-indigo-500/25"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
            }`}
          >
            {t === 'feed' && 'Bài viết'}
            {t === 'members' && 'Thành viên'}
            {t === 'quizzes' && 'Quiz'}
            {t === 'requests' && `Yêu cầu (${pendingRequests.length})`}
            {t === 'invite' && 'Mời bạn'}
          </button>
        ))}
      </div>

      {tab === 'feed' && (
        <div className="space-y-4">
          {isMember && (
            <CreatePostBox
              groupId={Number(id)}
              onCreated={(post) => setPosts((prev) => [post, ...prev])}
            />
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
            <p className="text-center text-muted">Chưa có bài viết trong nhóm</p>
          )}
          {hasMore && <div ref={loadMoreRef} className="py-4 text-center text-sm text-muted" />}
        </div>
      )}

      {tab === 'quizzes' && (
        <div className="space-y-3">
          {!isMember ? (
            <p className="text-center text-muted">Tham gia nhóm để xem và làm quiz</p>
          ) : quizzesLoading ? (
            <LoadingSpinner />
          ) : quizzes.length === 0 ? (
            <p className="text-center text-muted">Chưa có quiz trong nhóm</p>
          ) : (
            quizzes.map((q) => (
              <div
                key={q.id}
                className="rounded-xl border border-border bg-white p-4"
              >
                <h3 className="font-semibold">{q.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{q.description}</p>
                <p className="mt-2 text-xs text-muted">
                  {q.time} phút · {q.maxAttempts} lần làm
                </p>
                <div className="mt-3 flex gap-2">
                  <Link to={`/quizzes/${q.id}/take`}>
                    <Button className="!py-1 !text-xs">Làm bài</Button>
                  </Link>
                  <Link to={`/quizzes/${q.id}/attempts`}>
                    <Button variant="secondary" className="!py-1 !text-xs">
                      Lịch sử
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'members' && (
        <div className="space-y-2">
          {members.map((m) => (
            <div
              key={m.userId}
              className="flex items-center justify-between rounded-xl border border-border bg-white p-3"
            >
              <Link to={`/profile/${m.userId}`} className="font-medium hover:text-primary">
                {m.fullName}
              </Link>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{m.role}</span>
                {isOwner && m.userId !== userId && (
                  <>
                    <Button
                      variant="ghost"
                      className="!py-1 !text-xs"
                      onClick={() =>
                        run(() =>
                          groupApi.changeRole(
                            id,
                            m.userId,
                            m.role === 'MODERATOR' ? 'MEMBER' : 'MODERATOR',
                          ),
                          true,
                        )
                      }
                    >
                      {m.role === 'MODERATOR' ? 'Hạ mod' : 'Lên mod'}
                    </Button>
                    <Button
                      variant="danger"
                      className="!py-1 !text-xs"
                      onClick={() => {
                        if (!confirm('Kick thành viên?')) return
                        run(() => groupApi.removeMember(id, m.userId), true)
                      }}
                    >
                      Kick
                    </Button>
                    {m.role !== 'OWNER' && (
                      <Button
                        variant="secondary"
                        className="!py-1 !text-xs"
                        onClick={() => {
                          if (!confirm('Chuyển quyền owner?')) return
                          run(() => groupApi.transferOwnership(id, m.userId), true)
                        }}
                      >
                        Chuyển owner
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'requests' && isOwner && (
        <div className="space-y-3">
          {pendingRequests.map((req) => (
            <div
              key={req.id}
              className="flex items-center justify-between rounded-xl border border-border bg-white p-4"
            >
              <div>
                <p className="font-medium">{req.userName}</p>
                <p className="text-xs text-muted">
                  {req.inviterName ? `Được mời bởi ${req.inviterName}` : 'Yêu cầu tham gia'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  className="!py-1 !text-xs"
                  onClick={() => run(() => groupApi.approveRequest(req.id), true)}
                >
                  Duyệt
                </Button>
                <Button
                  variant="secondary"
                  className="!py-1 !text-xs"
                  onClick={() => run(() => groupApi.rejectRequest(req.id))}
                >
                  Từ chối
                </Button>
              </div>
            </div>
          ))}
          {pendingRequests.length === 0 && (
            <p className="text-muted">Không có yêu cầu chờ</p>
          )}
        </div>
      )}

      {tab === 'invite' && isOwner && (
        <div className="space-y-2">
          {friendsLoading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
              Đang tải danh sách bạn...
            </div>
          ) : friends.length === 0 ? (
            <p className="text-sm text-muted">
              Bấm &quot;Tải danh sách bạn để mời&quot; ở trên để hiển thị bạn bè
            </p>
          ) : inviteableFriends.length === 0 ? (
            <p className="text-sm text-muted">Tất cả bạn bè đã trong nhóm</p>
          ) : (
            inviteableFriends.map((f) => {
              const alreadyInvited = invitedFriendIds.has(f.userId)
              return (
                <div
                  key={f.userId}
                  className="flex items-center justify-between rounded-xl border border-border bg-white p-3"
                >
                  <span>{f.fullName}</span>
                  <Button
                    className="!py-1 !text-xs"
                    variant={alreadyInvited ? 'secondary' : 'primary'}
                    disabled={alreadyInvited}
                    onClick={() => handleInviteFriend(f.userId)}
                  >
                    {alreadyInvited ? 'Đã mời' : 'Mời'}
                  </Button>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
