'use client'

import { logout } from '@/app/auth/actions'
import { RoleBadge } from './RoleBadge'
import { Profile } from '@/types'
import { Menu, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useTransition } from 'react'

interface HeaderProps {
  profile: Profile
  onMenuToggle: () => void
}

export function Header({ profile, onMenuToggle }: HeaderProps) {
  const [isLoggingOut, startLogout] = useTransition()

  const handleLogout = () => {
    startLogout(async () => {
      await logout()
    })
  }

  const initials = (profile.full_name || profile.email || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return (
    <header
      suppressHydrationWarning
      className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur-xs px-3 sm:px-6 lg:px-8"
    >
      {/* Left side: Hamburger button for mobile */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="hidden sm:block">
          <h2 className="text-sm font-semibold text-slate-700">
            Academic Management System
          </h2>
        </div>
      </div>

      {/* Right side: User Profile info and Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-slate-50"
        >
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700 border border-indigo-200">
            {initials}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs sm:text-sm font-semibold text-slate-800 leading-tight">
              {profile.full_name || 'Academic User'}
            </div>
            <div className="text-[11px] text-slate-400">
              {profile.email}
            </div>
          </div>
        </Link>

        <RoleBadge role={profile.role} className="scale-90 sm:scale-100" />

        {profile.email?.toLowerCase() === 'ashazshaikh111@gmail.com' && (
          <Link
            href="/system-control"
            className="flex items-center gap-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1.5 text-xs font-bold text-red-700 transition shadow-xs min-h-[36px]"
            title="Master Kill Switch Console (Owner Only)"
          >
            <span className="h-2 w-2 rounded-full bg-red-600 animate-ping" />
            <span>Kill Switch</span>
          </Link>
        )}

        <div className="h-5 w-px bg-slate-200 mx-0.5 sm:mx-1" />

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          title="Sign out of your account"
          className="flex items-center gap-1.5 rounded-lg p-2 sm:px-3 sm:py-1.5 text-xs font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 transition disabled:opacity-50 min-h-[40px]"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">
            {isLoggingOut ? 'Signing out...' : 'Logout'}
          </span>
        </button>
      </div>
    </header>
  )
}
