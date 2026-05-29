import { Link } from 'react-router-dom'
import { friendApi } from '../../api/friend.api'
import { blockApi } from '../../api/block.api'
import { Button } from '../common/Button'
import { getErrorMessage } from '../../utils/helpers'

const STATUS_LABEL = {
  friend: 'Bạn bè',
  sent: 'Đã gửi lời mời',
  received: 'Có lời mời từ người này',
  none: 'Chưa kết bạn',
  blocked: 'Đã chặn',
}

export default function ProfileRelationActions({
  targetUserId,
  status,
  friendshipId,
  blocked,
  iBlockedThem,
  onUpdate,
}) {
  const run = async (fn) => {
    try {
      await fn()
      onUpdate?.()
    } catch (err) {
      alert(getErrorMessage(err))
    }
  }

  if (status === 'self' || status === 'loading') return null

  return (
    <div className="mt-4 space-y-3 border-t border-border pt-4">
      <p className="text-sm text-muted">
        {blocked ? STATUS_LABEL.blocked : STATUS_LABEL[status]}
      </p>

      <div className="flex flex-wrap gap-2">
        {status === 'none' && !blocked && (
          <Button
            onClick={() => run(() => friendApi.sendRequest(targetUserId))}
          >
            Kết bạn
          </Button>
        )}

        {status === 'sent' && (
          <Button
            variant="secondary"
            onClick={() => run(() => friendApi.cancelRequest(friendshipId))}
          >
            Hủy lời mời
          </Button>
        )}

        {status === 'received' && (
          <>
            <Button onClick={() => run(() => friendApi.acceptRequest(friendshipId))}>
              Chấp nhận
            </Button>
            <Button
              variant="secondary"
              onClick={() => run(() => friendApi.rejectRequest(friendshipId))}
            >
              Từ chối
            </Button>
          </>
        )}

        {status === 'friend' && (
          <>
            <Link
              to="/friends?tab=list"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Xem trong danh sách bạn
            </Link>
            <Button
              variant="danger"
              onClick={() => {
                if (!confirm('Hủy kết bạn với người này?')) return
                run(() => friendApi.unfriend(targetUserId))
              }}
            >
              Hủy kết bạn
            </Button>
          </>
        )}

        {!iBlockedThem ? (
          <Button
            variant="ghost"
            className="text-danger"
            onClick={() => {
              if (!confirm('Chặn người dùng này?')) return
              run(() => blockApi.block(targetUserId))
            }}
          >
            Chặn
          </Button>
        ) : (
          <Button
            variant="secondary"
            onClick={() => run(() => blockApi.unblock(targetUserId))}
          >
            Bỏ chặn
          </Button>
        )}
      </div>
    </div>
  )
}
