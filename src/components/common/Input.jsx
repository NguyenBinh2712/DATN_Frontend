export function Input({ label, error, className = "", ...props }) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}

      <input
        className={`
          w-full
          rounded-2xl
          border
          border-slate-200
          bg-white/80
          px-4
          py-3

          text-sm
          text-slate-800

          shadow-sm
          backdrop-blur-sm

          transition-all
          duration-300

          placeholder:text-slate-400

          hover:border-slate-300

          focus:border-indigo-500
          focus:ring-4
          focus:ring-indigo-500/10

          ${error ? "border-red-500" : ""}

          ${className}
        `}
        {...props}
      />

      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
export function Textarea({ label, error, className = "", ...props }) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}

      <textarea
        className={`
          w-full
          min-h-[140px]

          rounded-2xl
          border
          border-slate-200

          bg-white/80
          px-4
          py-3

          text-sm
          text-slate-800

          shadow-sm
          backdrop-blur-sm

          transition-all
          duration-300

          placeholder:text-slate-400

          hover:border-slate-300

          focus:border-indigo-500
          focus:ring-4
          focus:ring-indigo-500/10

          resize-none

          ${error ? "border-red-500" : ""}

          ${className}
        `}
        {...props}
      />

      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
