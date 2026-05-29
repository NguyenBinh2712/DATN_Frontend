import { useEffect, useState } from "react";
import { X, Crown, UserMinus, UserPlus } from "lucide-react";
import { conversationApi } from "../../api/conversation.api";
import { friendApi } from "../../api/friend.api";
import { Button } from "../common/Button";
import { getErrorMessage, unwrapList } from "../../utils/helpers";

export default function GroupManagePanel({
  convId,
  knownMemberIds = [],
  onClose,
  onUpdated,
  onLeft,
}) {
  const [friends, setFriends] = useState([]);
  const [selectedAdd, setSelectedAdd] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    friendApi
      .getFriends()
      .then(({ data }) => setFriends(unwrapList(data)))
      .finally(() => setLoading(false));
  }, []);

  const memberSet = new Set(knownMemberIds);
  const addableFriends = friends.filter((f) => !memberSet.has(f.userId));

  const handleAdd = async () => {
    if (selectedAdd.length === 0) return;
    try {
      await conversationApi.addMembers(convId, selectedAdd);
      setSelectedAdd([]);
      onUpdated?.();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handleRemove = async (userId) => {
    if (!confirm("Xóa thành viên khỏi nhóm chat?")) return;
    try {
      await conversationApi.removeMembers(convId, [userId]);
      onUpdated?.();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handlePromote = async (userId) => {
    if (!confirm("Chuyển quyền owner cho thành viên này?")) return;
    try {
      await conversationApi.promoteOwner(convId, userId);
      onUpdated?.();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handleLeave = async () => {
    if (!confirm("Rời nhóm chat?")) return;
    try {
      await conversationApi.leaveGroup(convId);
      onLeft?.();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <div className="border-b border-border bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Quản lý nhóm</h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 hover:bg-slate-200"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-slate-700">
          Thành viên ({knownMemberIds.length})
        </p>
        <div className="mt-2 max-h-32 space-y-1 overflow-y-auto">
          {knownMemberIds.map((uid) => {
            const friend = friends.find((f) => f.userId === uid);
            return (
              <div
                key={uid}
                className="flex items-center justify-between rounded-lg bg-white px-2 py-1.5 text-sm"
              >
                <span>{friend?.fullName || `User #${uid}`}</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    title="Chuyển owner"
                    className="rounded p-1 text-amber-600 hover:bg-amber-50"
                    onClick={() => handlePromote(uid)}
                  >
                    <Crown size={14} />
                  </button>
                  <button
                    type="button"
                    title="Xóa"
                    className="rounded p-1 text-red-600 hover:bg-red-50"
                    onClick={() => handleRemove(uid)}
                  >
                    <UserMinus size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <p className="flex items-center gap-1 text-sm font-medium text-slate-700">
          <UserPlus size={14} /> Thêm thành viên
        </p>
        {loading ? (
          <p className="mt-2 text-xs text-muted">Đang tải...</p>
        ) : (
          <>
            <div className="mt-2 max-h-28 space-y-1 overflow-y-auto">
              {addableFriends.map((f) => (
                <label
                  key={f.userId}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedAdd.includes(f.userId)}
                    onChange={(e) => {
                      if (e.target.checked)
                        setSelectedAdd((p) => [...p, f.userId]);
                      else
                        setSelectedAdd((p) =>
                          p.filter((id) => id !== f.userId),
                        );
                    }}
                  />
                  {f.fullName}
                </label>
              ))}
              {addableFriends.length === 0 && (
                <p className="text-xs text-muted">Không còn bạn bè để thêm</p>
              )}
            </div>
            <Button
              className="mt-2 !py-1 !text-xs"
              disabled={selectedAdd.length === 0}
              onClick={handleAdd}
            >
              Thêm ({selectedAdd.length})
            </Button>
          </>
        )}
      </div>

      <Button
        variant="danger"
        className="mt-4 w-full !py-1.5 !text-xs"
        onClick={handleLeave}
      >
        Rời nhóm chat
      </Button>
    </div>
  );
}
