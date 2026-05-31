export function Button({
  children,
  variant = "primary",
  className = "",
  loading = false,
  disabled,
  ...props
}) {
  const variants = {
    primary: `
      shine
      bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600
      text-white font-semibold
      shadow-lg shadow-indigo-500/25
      hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/35
      active:translate-y-0 active:shadow-md
      transition-all duration-200
    `,

    secondary: `
      bg-white border border-slate-200
      text-slate-700 font-semibold
      shadow-sm
      hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-700 hover:-translate-y-0.5 hover:shadow-md
      active:translate-y-0
      transition-all duration-200
    `,

    danger: `
      shine
      bg-gradient-to-r from-red-500 to-rose-500
      text-white
      shadow-lg shadow-red-500/20
      hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-500/30
      active:translate-y-0
      transition-all duration-200
    `,

    ghost: `
      bg-transparent text-slate-600
      hover:bg-indigo-50 hover:text-indigo-700
      transition-all duration-200
    `,
  };

  return (
    <button
      disabled={disabled || loading}
      className={`
        relative
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-2xl
        px-5
        py-3
        text-sm
        font-semibold
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      )}
      {children}
    </button>
  );
}
