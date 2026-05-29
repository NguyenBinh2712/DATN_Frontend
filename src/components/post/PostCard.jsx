import { Link } from "react-router-dom";
import { MessageCircle, Share2 } from "lucide-react";
import { formatRelativeTime, REACTION_EMOJI } from "../../utils/helpers";
import ReactionBar from "./ReactionBar";

export default function PostCard({
  post,
  onReact,
  myReaction,
  showComments = false,
}) {
  const totalReactions = Object.values(post.reactions || {}).reduce(
    (a, b) => a + b,
    0,
  );

  return (
    <article className="rounded-xl border border-border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <Link to={`/profile/${post.user?.id}`}>
          {post.user?.urlAvatar ? (
            <img
              src={post.user.urlAvatar}
              alt=""
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {(post.user?.fullName || "U")[0]}
            </div>
          )}
        </Link>
        <div>
          <Link
            to={`/profile/${post.user?.id}`}
            className="font-semibold text-slate-900 hover:text-primary"
          >
            {post.user?.fullName || "Người dùng"}
          </Link>
          <p className="text-xs text-muted">
            {formatRelativeTime(post.createdAt)}
          </p>
        </div>
      </div>

      <Link to={`/post/${post.id}`}>
        {post.content && (
          <p className="mb-3 whitespace-pre-wrap text-sm text-slate-800">
            {post.content}
          </p>
        )}
      </Link>

      {post.medias?.length > 0 && (
        <div
          className={`mb-3 grid gap-2 ${post.medias.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}
        >
          {post.medias.map((media) => (
            <div
              key={media.id}
              className="overflow-hidden rounded-lg bg-slate-100"
            >
              {media.mediaType === "VIDEO" ? (
                <video
                  src={media.url}
                  controls
                  className="max-h-96 w-full object-cover"
                />
              ) : media.mediaType === "IMAGE" ? (
                <img
                  src={media.url}
                  alt=""
                  className="max-h-96 w-full object-cover"
                />
              ) : (
                <a
                  href={media.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block p-4 text-primary"
                >
                  Xem tệp đính kèm
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {totalReactions > 0 && (
        <div className="mb-2 flex flex-wrap gap-1 text-sm text-muted">
          {Object.entries(post.reactions || {}).map(([type, count]) =>
            count > 0 ? (
              <span key={type}>
                {REACTION_EMOJI[type]} {count}
              </span>
            ) : null,
          )}
        </div>
      )}

      <ReactionBar postId={post.id} myReaction={myReaction} onReact={onReact} />

      <div className="mt-2 flex items-center gap-4 border-t border-border pt-2 text-sm text-muted">
        <Link
          to={`/post/${post.id}`}
          className="flex items-center gap-1 hover:text-primary"
        >
          <MessageCircle size={16} /> {post.commentCount || 0} bình luận
        </Link>
        <Link
          to={`/post/${post.id}`}
          className="flex items-center gap-1 hover:text-primary"
        >
          <Share2 size={16} /> Chia sẻ
        </Link>
      </div>

      {showComments && post.comments?.length > 0 && (
        <div className="mt-3 space-y-2 border-t border-border pt-3">
          {post.comments.slice(0, 3).map((c) => (
            <div
              key={c.id}
              className="rounded-lg bg-slate-50 px-3 py-2 text-sm"
            >
              <span className="font-medium">User #{c.userId}</span>: {c.content}
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
