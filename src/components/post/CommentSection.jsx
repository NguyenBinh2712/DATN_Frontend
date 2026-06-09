import { useState } from "react";
import { Button } from "../common/Button";
import { Input, Textarea } from "../common/Input";
import { postApi } from "../../api/post.api";
import { useAuth } from "../../context/AuthContext";
import { formatRelativeTime, getErrorMessage } from "../../utils/helpers";

export default function CommentSection({
  postId,
  comments: initial = [],
  onUpdate,
  blockedUserIds,
}) {
  const { userId } = useAuth();
  const [comments, setComments] = useState(initial);
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    const { data } = await postApi.getComments(postId);
    setComments(data.result || []);
    onUpdate?.(data.result);
  };

  const submit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      await postApi.createComment(postId, {
        content,
        parentId: replyTo,
      });
      setContent("");
      setReplyTo(null);
      await refresh();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm("Xóa bình luận này?")) return;
    try {
      await postApi.deleteComment(postId, commentId);
      await refresh();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const visibleComments = blockedUserIds
    ? comments.filter((c) => !blockedUserIds.has(c.userId))
    : comments;

  const roots = visibleComments.filter((c) => !c.parentId);
  const repliesOf = (parentId) =>
    visibleComments.filter((c) => c.parentId === parentId);

  const renderComment = (comment, depth = 0) => (
    <div key={comment.id} className={depth > 0 ? "ml-6 mt-2" : "mt-3"}>
      <div className="rounded-lg bg-slate-50 px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium">{comment.fullName}</span>
          <span className="text-xs text-muted">
            {formatRelativeTime(comment.createdAt)}
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-700">{comment.content}</p>
        <div className="mt-2 flex gap-3 text-xs text-muted">
          <button
            type="button"
            onClick={() => setReplyTo(comment.id)}
            className="hover:text-primary"
          >
            Trả lời
          </button>
          {comment.userId === userId && (
            <button
              type="button"
              onClick={() => handleDelete(comment.id)}
              className="hover:text-danger"
            >
              Xóa
            </button>
          )}
        </div>
      </div>
      {repliesOf(comment.id).map((r) => renderComment(r, depth + 1))}
    </div>
  );

  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <h3 className="mb-3 font-semibold">
        Bình luận ({visibleComments.length})
      </h3>

      <div className="space-y-1">
        {roots.map((c) => renderComment(c))}
        {roots.length === 0 && (
          <p className="text-sm text-muted">Chưa có bình luận</p>
        )}
      </div>

      <div className="mt-4 space-y-2 border-t border-border pt-4">
        {replyTo && (
          <p className="text-xs text-muted">
            Đang trả lời comment #{replyTo}{" "}
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="text-primary"
            >
              Hủy
            </button>
          </p>
        )}
        <Textarea
          placeholder="Viết bình luận..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button onClick={submit} loading={loading} disabled={!content.trim()}>
          Gửi
        </Button>
      </div>
    </div>
  );
}
