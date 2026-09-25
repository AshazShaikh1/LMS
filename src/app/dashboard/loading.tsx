export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-40 rounded-2xl bg-slate-200/80" />

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="h-24 rounded-xl bg-slate-200/80" />
        <div className="h-24 rounded-xl bg-slate-200/80" />
        <div className="h-24 rounded-xl bg-slate-200/80" />
        <div className="h-24 rounded-xl bg-slate-200/80" />
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-64 rounded-xl bg-slate-200/80" />
          <div className="h-48 rounded-xl bg-slate-200/80" />
        </div>
        <div className="space-y-4">
          <div className="h-56 rounded-xl bg-slate-200/80" />
          <div className="h-48 rounded-xl bg-slate-200/80" />
        </div>
      </div>
    </div>
  )
}
