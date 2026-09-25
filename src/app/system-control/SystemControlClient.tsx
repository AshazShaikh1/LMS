'use client'

import { useState, useTransition } from 'react'
import { toggleKillSwitch, KillSwitchStatus } from '@/app/actions/kill-switch'
import { login } from '@/app/auth/actions'
import {
  ShieldAlert,
  Power,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  LogOut
} from 'lucide-react'
import Link from 'next/link'
import { logout } from '@/app/auth/actions'

interface SystemControlClientProps {
  isOwner: boolean
  currentEmail: string | null
  initialStatus: KillSwitchStatus
}

export function SystemControlClient({
  isOwner,
  currentEmail,
  initialStatus,
}: SystemControlClientProps) {
  const [status, setStatus] = useState<KillSwitchStatus>(initialStatus)
  const [customMessage, setCustomMessage] = useState(initialStatus.message || '')
  const [isPending, startTransition] = useTransition()
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  // Login form state (if not authenticated as owner)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleToggle = (newActiveState: boolean) => {
    setActionError(null)
    setActionSuccess(null)

    startTransition(async () => {
      const res = await toggleKillSwitch(newActiveState, customMessage)
      if (res.error) {
        setActionError(res.error)
      } else {
        setStatus((prev) => ({
          ...prev,
          active: newActiveState,
          message: customMessage,
        }))
        setActionSuccess(
          newActiveState
            ? '🔴 Master Kill Switch ACTIVATED. The entire website is now offline for all users.'
            : '🟢 Master Kill Switch DEACTIVATED. The website is back online for all users!'
        )
      }
    })
  }

  const handleEmergencyLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)
    setIsLoggingIn(true)

    try {
      const formData = new FormData()
      formData.append('email', loginEmail.trim())
      formData.append('password', loginPassword)

      const res = await login(formData)
      if (res?.error) {
        setLoginError(res.error)
      } else {
        window.location.reload()
      }
    } catch (err: any) {
      if (err?.message !== 'NEXT_REDIRECT') {
        setLoginError(err.message || 'Authentication failed')
      } else {
        window.location.reload()
      }
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8">
      {/* Top Banner */}
      <div className="max-w-3xl mx-auto w-full flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-red-500" />
          <span className="font-mono text-sm font-bold tracking-wider text-slate-300">
            MASTER SYSTEM CONTROL &bull; OWNER CLEARANCE
          </span>
        </div>
        {isOwner && (
          <button
            onClick={() => logout()}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        )}
      </div>

      <div className="max-w-2xl mx-auto w-full my-8">
        {!isOwner ? (
          /* Authentication Screen for ashazshaikh111@gmail.com */
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 shadow-xl backdrop-blur-md space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 mb-2">
                <Lock className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-extrabold text-white">
                Owner Authentication Required
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                This console holds root power to take the entire website down or bring it back online. Access is strictly restricted to the authorized system owner.
              </p>
              {currentEmail && (
                <div className="inline-block rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-xs text-amber-400">
                  Currently signed in as: {currentEmail} (Unauthorized)
                </div>
              )}
            </div>

            {loginError && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
                {loginError}
              </div>
            )}

            <form onSubmit={handleEmergencyLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Owner Email Address
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm text-white focus:border-red-500 focus:outline-hidden"
                  placeholder="Enter authorized owner email"
                  autoComplete="off"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Account Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm text-white focus:border-red-500 focus:outline-hidden"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 text-sm transition shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Verifying Authority...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Authorize as Owner</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Owner Control Panel */
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 shadow-xl backdrop-blur-md space-y-6">
              {/* Header Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="text-xs font-mono text-emerald-400 font-semibold mb-1">
                    AUTHORIZED: {currentEmail}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Master Kill Switch Console
                  </h1>
                </div>

                <div
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${
                    status.active
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      status.active ? 'bg-red-500' : 'bg-emerald-500'
                    }`}
                  />
                  {status.active ? 'Site is KILLED (Offline)' : 'Site is ONLINE (Active)'}
                </div>
              </div>

              {actionError && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-400 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              {actionSuccess && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{actionSuccess}</span>
                </div>
              )}

              {/* Status Description */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-xs space-y-2 text-slate-300">
                <div className="font-semibold text-white">How this Kill Switch works:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li>
                    <strong>Overrules every role:</strong> Students, Teachers, and other Admins are completely blocked.
                  </li>
                  <li>
                    When active, any person visiting any URL sees the <strong>HTTP 503 System Unavailable</strong> maintenance screen.
                  </li>
                  <li>
                    <strong>Only you ({currentEmail})</strong> can view this console and turn the website back online.
                  </li>
                </ul>
              </div>

              {/* Custom Offline Reason Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Offline Notice Message (Displayed to visitors when killed):
                </label>
                <input
                  type="text"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="The academic system is temporarily offline for scheduled maintenance."
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-xs sm:text-sm text-white focus:border-red-500 focus:outline-hidden"
                />
              </div>

              {/* Big Action Buttons */}
              <div className="pt-2">
                {status.active ? (
                  <button
                    onClick={() => handleToggle(false)}
                    disabled={isPending}
                    className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 text-base transition shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    <Power className="h-5 w-5" />
                    <span>
                      {isPending ? 'Restoring System...' : 'RESTORE WEBSITE (BRING ONLINE FOR EVERYONE)'}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleToggle(true)}
                    disabled={isPending}
                    className="w-full rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold py-4 text-base transition shadow-lg shadow-red-900/30 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    <Power className="h-5 w-5" />
                    <span>
                      {isPending ? 'Activating Kill Switch...' : 'ENGAGE KILL SWITCH (TAKE ENTIRE WEBSITE DOWN)'}
                    </span>
                  </button>
                )}
              </div>

              {/* Quick Navigation Links */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 hover:text-white transition"
                >
                  <span>Go to Admin Dashboard</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/system-offline"
                  className="inline-flex items-center gap-1.5 hover:text-white transition"
                  target="_blank"
                >
                  <span>Preview 503 Screen</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-3xl mx-auto w-full text-center text-xs text-slate-400 border-t border-slate-800 pt-4">
        Academic LMS &bull; Project Root Authority &bull; Protected by Supabase PostgreSQL RLS
      </div>
    </div>
  )
}
