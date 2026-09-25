'use client'

import { useEffect } from 'react'
import { AlertCircle, RotateCcw } from 'lucide-react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard component error:', error)
  }, [error])

  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-8 text-center max-w-lg mx-auto my-12 space-y-4">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
        <AlertCircle className="h-6 w-6" />
      </div>

      <div className="space-y-1">
        <h2 className="text-base font-bold text-slate-900">Unable to load dashboard section</h2>
        <p className="text-xs text-slate-500">
          A temporary network or data fetching issue occurred while loading this view.
        </p>
      </div>

      {error.message && (
        <div className="rounded-lg bg-white border border-rose-200 p-2.5 text-[11px] font-mono text-rose-700 text-left truncate">
          {error.message}
        </div>
      )}

      <div>
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reload Section
        </button>
      </div>
    </div>
  )
}
