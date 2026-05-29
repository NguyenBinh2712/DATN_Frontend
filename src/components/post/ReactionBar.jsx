import { useState } from "react";
import { REACTIONS, REACTION_EMOJI } from "../../utils/helpers";

export default function ReactionBar({ postId, myReaction, onReact }) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="relative flex items-center gap-2">
      <button
        type="button"
        onClick={() => onReact?.(postId, myReaction ? myReaction : "LIKE")}
        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
          myReaction
            ? "bg-primary/10 text-primary"
            : "hover:bg-slate-100 text-slate-600"
        }`}
      >
        {myReaction ? REACTION_EMOJI[myReaction] : "👍"} {myReaction || "Thích"}
      </button>
      <button
        type="button"
        onClick={() => setShowPicker((s) => !s)}
        className="rounded-lg px-2 py-1.5 text-sm text-muted hover:bg-slate-100"
      >
        +
      </button>

      {showPicker && (
        <div className="absolute left-0 top-full z-10 mt-1 flex gap-1 rounded-full border border-border bg-white px-2 py-1 shadow-lg">
          {REACTIONS.map((type) => (
            <button
              key={type}
              type="button"
              className="rounded-full p-1 text-xl hover:scale-125 transition"
              onClick={() => {
                onReact?.(postId, type);
                setShowPicker(false);
              }}
            >
              {REACTION_EMOJI[type]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
