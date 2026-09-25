'use client'

import { useEffect } from 'react'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'
import Link from 'next/link'

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application runtime error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
            System Error
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Something went wrong
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            An unexpected error occurred during request execution. Our error boundary caught this safely.
          </p>
        </div>

        {error.message && (
          <div className="rounded-lg bg-rose-50/50 border border-rose-100 p-2.5 text-[11px] text-rose-700 font-mono text-left truncate">
            {error.message}
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <Home className="h-3.5 w-3.5" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
