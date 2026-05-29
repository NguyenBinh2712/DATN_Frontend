import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { groupApi } from '../../api/group.api'
import GroupCard from '../../components/group/GroupCard'
import { Button } from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getErrorMessage } from '../../utils/helpers'
import { useAuth } from '../../context/AuthContext'

export default function GroupsDiscoverPage() {
  const { isTeacher } = useAuth()
  const [suggestions, setSuggestions] = useState([])
  const [allGroups, setAllGroups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([groupApi.suggest(), groupApi.getAll()])
      .then(([sug, all]) => {
        setSuggestions(sug.data.result || [])
        setAllGroups(all.data.result || [])
      })
      .catch((err) => alert(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Nhóm học tập</h1>
        <div className="flex gap-2">
          <Link to="/groups/my">
            <Button variant="secondary">Nhóm của tôi</Button>
          </Link>
          {isTeacher && (
            <Link to="/groups/create">
              <Button>Tạo nhóm</Button>
            </Link>
          )}
        </div>
      </div>

      {suggestions.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Gợi ý cho bạn</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {suggestions.map((g) => (
              <GroupCard key={g.id} group={g} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold">Tất cả nhóm</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {allGroups.map((g) => (
            <GroupCard key={g.id} group={g} />
          ))}
        </div>
        {allGroups.length === 0 && (
          <p className="text-center text-muted">Chưa có nhóm nào</p>
        )}
      </section>
    </div>
  )
}
