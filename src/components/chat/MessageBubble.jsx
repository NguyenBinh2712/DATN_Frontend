import { useState } from "react";
import { MoreHorizontal, Reply, Pencil, Trash2, EyeOff } from "lucide-react";
import {
  REACTION_EMOJI,
  REACTIONS,
  formatRelativeTime,
} from "../../utils/helpers";

export default function MessageBubble({
  msg,
  isMine,
  replyPreview,
  reactions = {},
  onReact,
  onReply,
  onEdit,
  onDelete,
  onDeleteForMe,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const recalled = msg.content === "Tin nhắn đã bị thu hồi";

  const reactionEntries = Object.entries(reactions);
  const grouped = reactionEntries.reduce((acc, [, type]) => {
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className={`group flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div className="relative max-w-[75%]">
        {replyPreview && (
          <p className="mb-1 truncate rounded-lg bg-slate-50 px-2 py-1 text-xs text-muted">
            ↩ {replyPreview}
          </p>
        )}
        <div
          className={`rounded-2xl px-3 py-2 text-sm ${
            isMine ? "bg-primary text-white" : "bg-slate-100 text-slate-800"
          }`}
        >
          {msg.content && (
            <p
              className={`whitespace-pre-wrap break-words ${recalled ? "italic opacity-70" : ""}`}
            >
              {msg.content}
            </p>
          )}
          {msg.messageMedias?.map((m, i) => (
            <div key={i} className="mt-2">
              {m.mediaType === "VIDEO" ? (
                <video src={m.url} controls className="max-h-48 rounded-lg" />
              ) : m.mediaType === "IMAGE" ? (
                <img src={m.url} alt="" className="max-h-48 rounded-lg" />
              ) : (
                <a
                  href={m.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`underline ${isMine ? "text-white" : ""}`}
                >
                  Tệp đính kèm
                </a>
              )}
            </div>
          ))}
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p
              className={`text-[10px] ${isMine ? "text-white/70" : "text-muted"}`}
            >
              {formatRelativeTime(msg.timestamp)}
              {msg.isEdited && !recalled && " · đã sửa"}
              {msg.seenBy?.length > 1 && isMine && " · đã xem"}
            </p>
          </div>
        </div>

        {Object.keys(grouped).length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {Object.entries(grouped).map(([type, count]) => (
              <span
                key={type}
                className="rounded-full bg-white px-1.5 py-0.5 text-xs shadow-sm ring-1 ring-border"
              >
                {REACTION_EMOJI[type] || type} {count > 1 ? count : ""}
              </span>
            ))}
          </div>
        )}

        {!recalled && (
          <div
            className={`absolute top-0 flex gap-0.5 opacity-0 transition group-hover:opacity-100 ${
              isMine ? "right-full mr-1" : "left-full ml-1"
            }`}
          >
            <button
              type="button"
              onClick={() => setPickerOpen((o) => !o)}
              className="rounded-full bg-white p-1 shadow ring-1 ring-border hover:bg-slate-50"
              title="Reaction"
            >
              👍
            </button>
            <button
              type="button"
              onClick={() => onReply?.(msg)}
              className="rounded-full bg-white p-1 shadow ring-1 ring-border hover:bg-slate-50"
              title="Trả lời"
            >
              <Reply size={14} />
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="rounded-full bg-white p-1 shadow ring-1 ring-border hover:bg-slate-50"
            >
              <MoreHorizontal size={14} />
            </button>
          </div>
        )}

        {pickerOpen && (
          <div
            className={`absolute z-10 flex gap-1 rounded-full bg-white px-2 py-1 shadow-lg ring-1 ring-border ${
              isMine ? "right-0 top-full mt-1" : "left-0 top-full mt-1"
            }`}
          >
            {REACTIONS.map((type) => (
              <button
                key={type}
                type="button"
                className="text-lg hover:scale-125"
                onClick={() => {
                  onReact?.(msg.id, type);
                  setPickerOpen(false);
                }}
              >
                {REACTION_EMOJI[type]}
              </button>
            ))}
          </div>
        )}

        {menuOpen && (
          <div
            className={`absolute z-10 min-w-[140px] rounded-lg bg-white py-1 shadow-lg ring-1 ring-border ${
              isMine ? "right-0 top-full mt-1" : "left-0 top-full mt-1"
            }`}
          >
            {isMine && (
              <>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50"
                  onClick={() => {
                    onEdit?.(msg);
                    setMenuOpen(false);
                  }}
                >
                  <Pencil size={14} /> Sửa
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  onClick={() => {
                    onDelete?.(msg.id);
                    setMenuOpen(false);
                  }}
                >
                  <Trash2 size={14} /> Thu hồi
                </button>
              </>
            )}
            <button
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50"
              onClick={() => {
                onDeleteForMe?.(msg.id);
                setMenuOpen(false);
              }}
            >
              <EyeOff size={14} /> Xóa phía tôi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
