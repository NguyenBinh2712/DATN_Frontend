import AppShell from './AppShell'

export default function TeacherLayout() {
  return (
    <AppShell
      badge={
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
          Giáo viên
        </span>
      }
    />
  )
}
