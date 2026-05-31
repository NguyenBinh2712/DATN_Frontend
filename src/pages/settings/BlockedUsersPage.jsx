import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { blockApi } from '../../api/block.api'
import { userApi } from '../../api/user.api'
import { Button } from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getErrorMessage } from '../../utils/helpers'

export default function BlockedUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await blockApi.getMyBlocked()
      const ids = data.result || []
      const details = await Promise.all(
        ids.map(async (id) => {
          try {
            const res = await userApi.getById(id)
            return res.data.result
          } catch {
            return { id, email: `#${id}`, profile: null }
          }
        }),
      )
      setUsers(details)
    } catch (err) {
      alert(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const unblock = async (id) => {
    try {
      await blockApi.unblock(id)
      load()
    } catch (err) {
      alert(getErrorMessage(err))
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="fade-in-up space-y-4">
      <h1 className="text-2xl font-bold">Người đã chặn</h1>
      <p className="text-sm text-muted">
        Bài viết và tương tác từ những người này sẽ không hiển thị trên feed của bạn.
      </p>

      <div className="space-y-3">
        {users.map((u) => (
          <div
            key={u.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-white p-4"
          >
            <Link to={`/profile/${u.id}`} className="min-w-0">
              <p className="font-medium">{u.profile?.fullName || u.email}</p>
              <p className="text-sm text-muted">{u.email}</p>
            </Link>
            <Button variant="secondary" className="!py-1 !text-xs" onClick={() => unblock(u.id)}>
              Bỏ chặn
            </Button>
          </div>
        ))}
        {users.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 p-10 text-center">
            <div className="mb-3 text-4xl">📭</div>
            <p className="font-medium text-slate-500">Chưa chặn ai</p>
          </div>
        )}
      </div>
    </div>
  )
}
