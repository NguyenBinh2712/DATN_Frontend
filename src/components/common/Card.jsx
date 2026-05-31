export default function Card({ children, className = "" }) {
  return (
    <div
      className={`
        rounded-2xl
        border border-slate-100
        bg-white
        p-6
        transition-all duration-300
        hover:-translate-y-1
        ${className}
      `}
      style={{
        boxShadow: "0 4px 24px rgba(99,102,241,0.07), 0 1.5px 4px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 12px 40px rgba(99,102,241,0.14), 0 4px 12px rgba(0,0,0,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow =
          "0 4px 24px rgba(99,102,241,0.07), 0 1.5px 4px rgba(0,0,0,0.04)";
      }}
    >
      {children}
    </div>
  );
}
