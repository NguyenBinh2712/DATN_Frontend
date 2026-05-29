import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "../common/Button";
import { Textarea } from "../common/Input";
import { postApi } from "../../api/post.api";
import { getErrorMessage } from "../../utils/helpers";

export default function CreatePostBox({ onCreated, groupId }) {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const handleFiles = (selected) => {
    const list = Array.from(selected);
    setFiles((prev) => [...prev, ...list]);
    list.forEach((file) => {
      const url = URL.createObjectURL(file);
      setPreviews((prev) => [
        ...prev,
        { url, type: file.type, name: file.name },
      ]);
    });
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim() && files.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await postApi.create(
        { content, privacy: "PUBLIC", groupId: groupId || undefined },
        files,
      );
      setContent("");
      setFiles([]);
      setPreviews([]);
      onCreated?.(data.result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
      <Textarea
        placeholder="Bạn đang nghĩ gì?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {previews.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {previews.map((p, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-lg bg-slate-100"
            >
              {p.type.startsWith("video/") ? (
                <video src={p.url} className="h-24 w-full object-cover" />
              ) : p.type.startsWith("image/") ? (
                <img src={p.url} alt="" className="h-24 w-full object-cover" />
              ) : (
                <div className="flex h-24 items-center justify-center p-2 text-xs">
                  {p.name}
                </div>
              )}
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="mt-2 text-sm text-danger">{error}</p>}

      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:bg-slate-100"
        >
          <ImagePlus size={18} /> Ảnh/Video
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Button
          onClick={handleSubmit}
          loading={loading}
          disabled={!content.trim() && files.length === 0}
        >
          Đăng bài
        </Button>
      </div>
    </div>
  );
}
