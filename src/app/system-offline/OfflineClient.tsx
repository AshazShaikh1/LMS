'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { ServerOff, Lock, Power, RefreshCw, CheckCircle2, ShieldAlert } from 'lucide-react'
import { toggleKillSwitch } from '@/app/actions/kill-switch'
import { useRouter } from 'next/navigation'

interface OfflineClientProps {
  isOwner: boolean
  ownerEmail?: string | null
}

export function OfflineClient({ isOwner, ownerEmail }: OfflineClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [restored, setRestored] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRestore = () => {
    setError(null)
    startTransition(async () => {
      const res = await toggleKillSwitch(false)
      if (res.error) {
        setError(res.error)
      } else {
        setRestored(true)
        setTimeout(() => {
          router.push('/dashboard')
          router.refresh()
        }, 1000)
      }
    })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-slate-950 text-slate-100 p-4 sm:p-6 selection:bg-red-500 selection:text-white">
      {/* Top Status Bar */}
      <div className="w-full max-w-2xl flex items-center justify-between text-xs text-slate-400 font-mono border-b border-slate-800 pb-4 pt-2">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
          HTTP 503 SERVICE UNAVAILABLE
        </span>
        <span>STATUS: OFFLINE</span>
      </div>

      {/* Owner Authority Control Banner (Only displayed if authenticated as ashazshaikh111@gmail.com) */}
      {isOwner && (
        <div className="w-full max-w-2xl my-4 rounded-2xl border-2 border-red-500/50 bg-red-950/40 p-5 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold font-mono text-red-400 uppercase tracking-wider">
                <ShieldAlert className="h-4 w-4" />
                Owner Authority Detected ({ownerEmail})
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Kill Switch is Currently ACTIVE
              </h2>
              <p className="text-xs text-slate-300">
                The entire website is blocked for all students, teachers, and admins. You have sole root authority to bring it back online.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <button
                onClick={handleRestore}
                disabled={isPending || restored}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 text-sm shadow-lg shadow-emerald-900/40 transition disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Restoring...</span>
                  </>
                ) : restored ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-white" />
                    <span>Restored! Redirecting...</span>
                  </>
                ) : (
                  <>
                    <Power className="h-4 w-4" />
                    <span>Bring Site Back Online</span>
                  </>
                )}
              </button>

              <Link
                href="/system-control"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition"
              >
                Full Console &rarr;
              </Link>
            </div>
          </div>

          {error && (
            <div className="mt-3 rounded-lg bg-red-500/20 border border-red-500/40 p-2.5 text-xs text-red-300">
              {error}
            </div>
          )}
        </div>
      )}

      {/* Main Offline Card */}
      <div className="my-auto w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-md text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
          <ServerOff className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            System Temporarily Unavailable
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            The academic portal and student database are currently offline due to administrative suspension or unscheduled emergency maintenance.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-left font-mono text-xs text-slate-400 space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-500">HTTP Status:</span>
            <span className="text-rose-400">503 Service Unavailable</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Reason:</span>
            <span>ADMINISTRATIVE_SUSPENSION</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Access Policy:</span>
            <span className="text-amber-400">ALL_ROLES_RESTRICTED</span>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          If you are an enrolled student or faculty instructor, please check back later or consult with your academic institution administrator.
        </p>
      </div>

      {/* Discrete Owner Emergency Access */}
      <div className="w-full max-w-2xl flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-4 pb-2">
        <span>Academic Infrastructure &bull; Protected Node</span>
        <Link
          href="/system-control"
          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition"
          title="Emergency Owner Console"
        >
          <Lock className="h-3.5 w-3.5" />
          <span>System Authority Access</span>
        </Link>
      </div>
    </div>
  )
}
