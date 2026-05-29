import { useEffect, useState } from 'react'
import { postApi } from '../../api/post.api'
import AdminPostDetailPanel from '../../components/admin/AdminPostDetailPanel'
import { Button } from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatDateTime, getErrorMessage } from '../../utils/helpers'

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
    <div>
      <h1 className="text-2xl font-bold text-white">Quản lý bài viết</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className={`rounded-xl border p-4 transition ${
                selectedId === post.id
                  ? 'border-primary/50 bg-primary/10'
                  : 'border-slate-800 bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-4 text-slate-300">
                <div className="min-w-0">
                  <p className="font-medium text-white">
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
          {posts.length === 0 && <p className="text-slate-400">Không có bài viết</p>}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 disabled:opacity-50"
            >
              Trước
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300"
            >
              Sau
            </button>
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
