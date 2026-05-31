import { useEffect, useState } from 'react'
import { postApi } from '../../api/post.api'
import AdminPostDetailPanel from '../../components/admin/AdminPostDetailPanel'
import { Button } from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatDateTime, getErrorMessage } from '../../utils/helpers'

const CARD_SHADOW = '0 4px 24px rgba(99,102,241,0.07), 0 1px 3px rgba(0,0,0,0.04)'

export default function AdminPostsPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [selectedId, setSelectedId] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const load = async (p = 0) => {
    setLoading(true)
    try {
      const { data } = await postApi.getAdminPosts(p, 20)
      setPosts(data.result?.content || [])
    } catch (err) {
      alert(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(page)
  }, [page])

  const viewDetail = async (postId) => {
    setSelectedId(postId)
    setDetailLoading(true)
    try {
      const { data } = await postApi.getDetail(postId)
      setSelectedPost(data.result)
    } catch (err) {
      alert(getErrorMessage(err))
      setSelectedId(null)
      setSelectedPost(null)
    } finally {
      setDetailLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="fade-in-up">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Quản lý bài viết</h1>
        <p className="mt-1 text-sm text-slate-500">Duyệt và xử lý nội dung đăng tải</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className={`rounded-2xl border p-5 transition-all duration-200 ${
                selectedId === post.id
                  ? 'border-primary/50 bg-primary/10'
                  : 'border-slate-100 bg-white hover:border-indigo-200'
              }`}
              style={selectedId !== post.id ? { boxShadow: CARD_SHADOW } : undefined}
            >
              <div className="flex items-start justify-between gap-4 text-slate-600">
                <div className="min-w-0">
                  <p className="font-medium text-slate-800">
                    #{post.id} — {post.user?.fullName || 'Unknown'}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm">{post.content || '(Không có nội dung)'}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {formatDateTime(post.createdAt)} · {post.privacy}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  className="shrink-0 !py-1 !text-xs"
                  onClick={() => viewDetail(post.id)}
                >
                  Xem
                </Button>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 p-10 text-center">
              <div className="mb-3 text-4xl">📭</div>
              <p className="font-medium text-slate-500">Không có bài viết</p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button variant="secondary" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              Trước
            </Button>
            <Button variant="secondary" onClick={() => setPage((p) => p + 1)}>
              Sau
            </Button>
          </div>
        </div>

        <AdminPostDetailPanel
          post={selectedPost}
          loading={detailLoading}
          onClose={() => {
            setSelectedId(null)
            setSelectedPost(null)
          }}
        />
      </div>
    </div>
  )
}
