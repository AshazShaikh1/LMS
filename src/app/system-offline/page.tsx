import { Metadata } from 'next'
import Link from 'next/link'
import { AlertTriangle, ServerOff, ShieldAlert, Lock, RefreshCw } from 'lucide-react'

export const metadata: Metadata = {
  title: '503 - Service Temporarily Unavailable',
  description: 'The server is temporarily unavailable due to scheduled maintenance or capacity constraints.',
}

export default function SystemOfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-slate-900 text-slate-100 p-6 selection:bg-red-500 selection:text-white">
      {/* Top Status Bar */}
      <div className="w-full max-w-2xl flex items-center justify-between text-xs text-slate-400 font-mono border-b border-slate-800 pb-4 pt-2">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
          HTTP 503 SERVICE UNAVAILABLE
        </span>
        <span>GATEWAY: ERROR_OFFLINE</span>
      </div>

      {/* Main Offline Card */}
      <div className="my-auto w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950/70 p-8 shadow-2xl backdrop-blur-md text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
          <ServerOff className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            System Unavailable
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            The academic portal and student database are currently offline due to administrative suspension or unscheduled emergency maintenance.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-left font-mono text-xs text-slate-400 space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-500">Error Code:</span>
            <span className="text-rose-400">ERR_SERVICE_SUSPENDED</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Host:</span>
            <span>lms-academic-portal</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Security Clearance:</span>
            <span className="text-amber-400">RESTRICTED_ACCESS</span>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          If you are an enrolled student or faculty member, please check back later or consult with your academic institution coordinator.
        </p>
      </div>

      {/* Discrete Owner Emergency Access */}
      <div className="w-full max-w-2xl flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-4 pb-2">
        <span>Academic Infrastructure &bull; Protected Node</span>
        <Link
          href="/system-control"
          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-300 transition"
          title="Owner Emergency Portal"
        >
          <Lock className="h-3 w-3" />
          <span>System Authority Access</span>
        </Link>
      </div>
    </div>
  )
}
