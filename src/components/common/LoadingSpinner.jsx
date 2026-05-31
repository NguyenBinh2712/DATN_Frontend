export default function LoadingSpinner({ className = "" }) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="relative">
        <div className="h-14 w-14 rounded-full border-4 border-indigo-100" />

        <div
          className="
            absolute
            inset-0

            h-14
            w-14

            animate-spin

            rounded-full

            border-4
            border-transparent
            border-t-indigo-600
            border-r-violet-500
          "
        />
      </div>
    </div>
  );
}
