import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Share2, Flag } from 'lucide-react'
import { postApi } from '../../api/post.api'
import PostCard from '../../components/post/PostCard'
import CommentSection from '../../components/post/CommentSection'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { Button } from '../../components/common/Button'
import { getErrorMessage, REPORT_REASONS } from '../../utils/helpers'

import { useBlockedUsers } from '../../hooks/useBlockedUsers'

export default function PostDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isBlocked, blockedIds } = useBlockedUsers()
  const [post, setPost] = useState(null)
  const [myReaction, setMyReaction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showReport, setShowReport] = useState(false)
  const [reportReason, setReportReason] = useState('SPAM')
  const [reportDesc, setReportDesc] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const [{ data }, reactRes] = await Promise.all([
        postApi.getDetail(id),
        postApi.getMyReaction(id).catch(() => ({ data: { result: null } })),
      ])
      setPost(data.result)
      setMyReaction(reactRes.data.result)
      if (isBlocked(data.result?.user?.id)) {
        navigate('/')
        return
      }
    } catch (err) {
      alert(getErrorMessage(err))
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [id])

  const handleReact = async (postId, type) => {
    const { data } = await postApi.react(postId, type)
    setPost(data.result)
    const { data: r } = await postApi.getMyReaction(postId)
    setMyReaction(r.result)
  }

  const handleShare = async () => {
    try {
      const { data } = await postApi.share(id)
      alert('Chia sẻ thành công!')
      navigate(`/post/${data.result.id}`)
    } catch (err) {
      alert(getErrorMessage(err))
    }
  }

  const handleReport = async () => {
    try {
      await postApi.report(id, { reason: reportReason, description: reportDesc })
      alert('Báo cáo đã được gửi')
      setShowReport(false)
    } catch (err) {
      alert(getErrorMessage(err))
    }
  }

  if (loading) return <LoadingSpinner />
  if (!post) return null

  return (
    <div className="space-y-4">
      <Link to="/" className="text-sm text-primary hover:underline">
        ← Quay lại feed
      </Link>

      <PostCard post={post} myReaction={myReaction} onReact={handleReact} />

      <div className="flex gap-2">
        <Button variant="secondary" onClick={handleShare}>
          <Share2 size={16} /> Chia sẻ bài viết
        </Button>
        <Button variant="ghost" onClick={() => setShowReport(true)}>
          <Flag size={16} /> Báo cáo
        </Button>
      </div>

      {showReport && (
        <div className="rounded-xl border border-border bg-white p-4">
          <h3 className="font-semibold">Báo cáo bài viết</h3>
          <select
            className="mt-2 w-full rounded-lg border border-border px-3 py-2 text-sm"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
          >
            {REPORT_REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <textarea
            className="mt-2 w-full rounded-lg border border-border px-3 py-2 text-sm"
            placeholder="Mô tả thêm (tuỳ chọn)"
            value={reportDesc}
            onChange={(e) => setReportDesc(e.target.value)}
          />
          <div className="mt-3 flex gap-2">
            <Button onClick={handleReport}>Gửi báo cáo</Button>
            <Button variant="secondary" onClick={() => setShowReport(false)}>
              Hủy
            </Button>
          </div>
        </div>
      )}

      <CommentSection
        postId={id}
        comments={post.comments || []}
        blockedUserIds={blockedIds}
      />
    </div>
  )
}
