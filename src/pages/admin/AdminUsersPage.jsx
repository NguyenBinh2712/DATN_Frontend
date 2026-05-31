import { useEffect, useState } from 'react'
import { userApi } from '../../api/user.api'
import AdminUserDetailPanel from '../../components/admin/AdminUserDetailPanel'
import { Button } from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getErrorMessage } from '../../utils/helpers'

const CARD_SHADOW = '0 4px 24px rgba(99,102,241,0.07), 0 1px 3px rgba(0,0,0,0.04)'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [selectedId, setSelectedId] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const load = async (p = 0) => {
    setLoading(true)
    try {
      const { data } = await userApi.getAll(p, 20)
      setUsers(data.result || [])
    } catch (err) {
      alert(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(page)
  }, [page])

  const viewDetail = async (id) => {
    setSelectedId(id)
    setDetailLoading(true)
    try {
      const { data } = await userApi.getById(id)
      setSelectedUser(data.result)
    } catch (err) {
      alert(getErrorMessage(err))
      setSelectedId(null)
      setSelectedUser(null)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Xóa người dùng này?')) return
    try {
      await userApi.deleteUser(id)
      if (selectedId === id) {
        setSelectedId(null)
        setSelectedUser(null)
      }
      load(page)
    } catch (err) {
      alert(getErrorMessage(err))
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="fade-in-up">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Quản lý người dùng</h1>
        <p className="mt-1 text-sm text-slate-500">Xem, tìm kiếm và quản lý tài khoản</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0">
          <div
            className="overflow-x-auto rounded-2xl border border-slate-100 bg-white"
            style={{ boxShadow: CARD_SHADOW }}
          >
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-indigo-50/80 text-xs uppercase tracking-wider text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Tên</th>
                  <th className="px-4 py-3 font-semibold">Online</th>
                  <th className="px-4 py-3 font-semibold">Ngày tạo</th>
                  <th className="px-4 py-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className={`border-t border-slate-100 text-slate-600 transition ${
                      selectedId === u.id ? 'bg-primary/10' : 'hover:bg-indigo-50/60'
                    }`}
                  >
                    <td className="px-4 py-3">{u.id}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">{u.profile?.fullName || '—'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          u.status
                            ? 'bg-emerald-500/20 text-emerald-600'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {u.status ? 'Online' : 'Offline'}
                      </span>
                    </td>
                    <td className="px-4 py-3">{u.createAt || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          className="!py-1 !text-xs"
                          onClick={() => viewDetail(u.id)}
                        >
                          Xem chi tiết
                        </Button>
                        <Button
                          variant="danger"
                          className="!py-1 !text-xs"
                          onClick={() => handleDelete(u.id)}
                        >
                          Xóa
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex gap-2">
            <Button variant="secondary" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              Trước
            </Button>
            <Button variant="secondary" onClick={() => setPage((p) => p + 1)}>
              Sau
            </Button>
          </div>
        </div>

        <AdminUserDetailPanel
          user={selectedUser}
          loading={detailLoading}
          onClose={() => {
            setSelectedId(null)
            setSelectedUser(null)
          }}
        />
      </div>
    </div>
  )
}
