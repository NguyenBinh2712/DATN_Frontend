import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { groupApi } from '../../api/group.api'
import GroupCard from '../../components/group/GroupCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getErrorMessage } from '../../utils/helpers'

export default function MyGroupsPage() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    groupApi
      .getMyGroups()
      .then(({ data }) => setGroups(data.result || []))
      .catch((err) => alert(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="fade-in-up space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nhóm của tôi</h1>
        <Link to="/groups" className="text-sm text-primary hover:underline">
          Khám phá nhóm
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {groups.map((g) => (
          <GroupCard key={g.id} group={g} />
        ))}
      </div>
      {groups.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 p-10 text-center">
          <div className="mb-3 text-4xl">📭</div>
          <p className="font-medium text-slate-500">
            Bạn chưa tham gia nhóm nào.{' '}
            <Link to="/groups" className="text-primary hover:underline">
              Khám phá ngay
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}
