import { FileText, X } from "lucide-react";
import { formatDateTime, REACTION_EMOJI } from "../../utils/helpers";

export default function AdminPostDetailPanel({ post, loading, onClose }) {
  if (!post && !loading) {
    return (
      <aside className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/50 p-6 text-center">
        <FileText size={40} className="mb-3 text-slate-600" />
        <p className="text-sm text-slate-500">
          Chọn bài viết và bấm &quot;Xem&quot;
        </p>
      </aside>
    );
  }

  if (loading) {
    return (
      <aside className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-24 rounded bg-slate-800" />
          <div className="h-20 rounded bg-slate-800" />
          <div className="h-32 rounded bg-slate-800" />
        </div>
      </aside>
    );
  }

  const totalReactions = Object.values(post.reactions || {}).reduce(
    (a, b) => a + b,
    0,
  );

  return (
    <aside className="sticky top-6 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-xl border border-slate-800 bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <h2 className="text-sm font-semibold text-white">
          Chi tiết bài viết #{post.id}
        </h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3">
          {post.user?.urlAvatar ? (
            <img
              src={post.user.urlAvatar}
              alt=""
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
              {(post.user?.fullName || "U")[0]}
            </div>
          )}
          <div>
            <p className="font-medium text-white">
              {post.user?.fullName || "Người dùng"}
            </p>
            <p className="text-xs text-slate-500">
              {formatDateTime(post.createdAt)}
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-slate-300">
            {post.privacy}
          </span>
          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-slate-300">
            {post.postType}
          </span>
          {post.isHidden && (
            <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-red-400">
              Đã ẩn
            </span>
          )}
        </div>

        {post.content && (
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
            {post.content}
          </p>
        )}

        {post.medias?.length > 0 && (
          <div className="mt-4 space-y-2">
            {post.medias.map((media) => (
              <div
                key={media.id}
                className="overflow-hidden rounded-lg bg-slate-950"
              >
                {media.mediaType === "VIDEO" ? (
                  <video
                    src={media.url}
                    controls
                    className="max-h-48 w-full object-cover"
                  />
                ) : media.mediaType === "IMAGE" ? (
                  <img
                    src={media.url}
                    alt=""
                    className="max-h-48 w-full object-cover"
                  />
                ) : (
                  <a
                    href={media.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block p-3 text-sm text-primary hover:underline"
                  >
                    Mở tệp đính kèm
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {totalReactions > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-400">
            {Object.entries(post.reactions || {}).map(([type, count]) =>
              count > 0 ? (
                <span key={type}>
                  {REACTION_EMOJI[type]} {count}
                </span>
              ) : null,
            )}
          </div>
        )}

        <div className="mt-4 rounded-lg bg-slate-950 p-3 text-sm text-slate-400">
          {post.commentCount ?? post.comments?.length ?? 0} bình luận
        </div>

        {post.comments?.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs font-medium uppercase text-slate-500">
              Bình luận gần đây
            </p>
            {post.comments.slice(0, 5).map((c) => (
              <div
                key={c.id}
                className="rounded-lg bg-slate-950 px-3 py-2 text-sm"
              >
                <span className="font-medium text-slate-300">
                  User #{c.userId}
                </span>
                <span className="text-slate-500">
                  {" "}
                  · {formatDateTime(c.createdAt)}
                </span>
                <p className="mt-0.5 text-slate-400">{c.content}</p>
              </div>
            ))}
            {post.comments.length > 5 && (
              <p className="text-xs text-slate-500">
                +{post.comments.length - 5} bình luận khác
              </p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
