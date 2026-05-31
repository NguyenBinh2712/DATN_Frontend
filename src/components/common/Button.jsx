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
      bg-gradient-to-r
      from-indigo-600
      via-violet-600
      to-purple-600

      text-white

      shadow-lg
      shadow-indigo-500/20

      hover:-translate-y-0.5
      hover:shadow-xl
      hover:shadow-indigo-500/30
    `,

    secondary: `
      bg-white
      border
      border-slate-200

      text-slate-700

      shadow-sm

      hover:border-slate-300
      hover:bg-slate-50
    `,

    danger: `
      bg-gradient-to-r
      from-red-500
      to-rose-500

      text-white

      hover:-translate-y-0.5
    `,

    ghost: `
      bg-transparent
      text-slate-600

      hover:bg-slate-100
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

        transition-all
        duration-300

        disabled:cursor-not-allowed
        disabled:opacity-50

        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <span
          className="
            h-4
            w-4
            animate-spin
            rounded-full
            border-2
            border-white/30
            border-t-white
          "
        />
      )}

      {children}
    </button>
  );
}
