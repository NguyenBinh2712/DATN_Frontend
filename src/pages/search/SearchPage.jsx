import { useState } from 'react'
import { Link } from 'react-router-dom'
import { searchApi } from '../../api/search.api'
import GroupCard from '../../components/group/GroupCard'
import PostCard from '../../components/post/PostCard'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getErrorMessage } from '../../utils/helpers'

export default function SearchPage() {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const search = async (e) => {
    e?.preventDefault()
    if (!keyword.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const { data } = await searchApi.searchAll(keyword.trim())
      setResults(data.result || { users: [], posts: [], groups: [] })
    } catch (err) {
      alert(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const users = results?.users || []
  const posts = results?.posts || []
  const groups = results?.groups || []
  const total = users.length + posts.length + groups.length

  return (
    <div className="fade-in-up space-y-6">
      <h1 className="text-2xl font-bold">Tìm kiếm</h1>

      <form onSubmit={search} className="flex gap-2">
        <Input
          placeholder="Tìm người dùng, bài viết, nhóm..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" loading={loading}>
          Tìm
        </Button>
      </form>

      {loading && <LoadingSpinner />}

      {!loading && searched && (
        <div className="space-y-8">
          {total === 0 && (
            <p className="text-center text-muted">Không tìm thấy kết quả cho &quot;{keyword}&quot;</p>
          )}

          {users.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Người dùng ({users.length})</h2>
              <div className="space-y-2">
                {users.map((u) => (
                  <Link
                    key={u.id}
                    to={`/profile/${u.id}`}
                    className="flex items-center gap-3 rounded-xl border border-border bg-white p-3 transition hover:border-primary"
                  >
                    {u.profile?.avatarUrl ? (
                      <img
                        src={u.profile.avatarUrl}
                        alt=""
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {u.profile?.fullName?.[0] || '?'}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{u.profile?.fullName || u.email}</p>
                      <p className="text-sm text-muted">{u.email}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {posts.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Bài viết ({posts.length})</h2>
              <div className="space-y-4">
                {posts.map((p) => (
                  <PostCard key={p.id} post={p} />
                ))}
              </div>
            </section>
          )}

          {groups.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Nhóm ({groups.length})</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {groups.map((g) => (
                  <GroupCard key={g.id} group={g} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {!searched && (
        <p className="text-sm text-muted">
          Tìm kiếm tổng hợp người dùng, bài viết công khai và nhóm học tập. Xem thêm tại{' '}
          <Link to="/groups" className="text-primary hover:underline">
            Khám phá nhóm
          </Link>{' '}
          hoặc{' '}
          <Link to="/friends?tab=recommend" className="text-primary hover:underline">
            Gợi ý bạn bè
          </Link>
          .
        </p>
      )}
    </div>
  )
}
