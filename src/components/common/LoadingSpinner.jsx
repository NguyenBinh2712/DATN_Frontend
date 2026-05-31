export default function LoadingSpinner({ className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
      <div className="relative h-14 w-14">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg,transparent 0%,#6366f1 50%,transparent 100%)",
            animation: "spin 1s linear infinite",
          }}
        />
        <div className="absolute inset-1.5 rounded-full bg-white" />
        <div
          className="absolute inset-0 rounded-full"
          style={{ boxShadow: "0 0 20px rgba(99,102,241,0.3)" }}
        />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-400 animate-pulse">Đang tải...</p>
    </div>
  );
}
