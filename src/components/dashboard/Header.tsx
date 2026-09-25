'use client'

import { logout } from '@/app/auth/actions'
import { RoleBadge } from './RoleBadge'
import { Profile } from '@/types'
import { Menu, LogOut, User } from 'lucide-react'
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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-8">
      {/* Left side: Hamburger button for mobile */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="hidden sm:block">
          <h2 className="text-sm font-medium text-slate-500">
            Academic Management System
          </h2>
        </div>
      </div>

      {/* Right side: User Profile info and Actions */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-slate-50"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200">
            {initials}
          </div>
          <div className="hidden text-left sm:block">
            <div className="text-sm font-semibold text-slate-800 leading-tight">
              {profile.full_name || 'Academic User'}
            </div>
            <div className="text-xs text-slate-400">
              {profile.email}
            </div>
          </div>
        </Link>

        <RoleBadge role={profile.role} />

        <div className="h-6 w-px bg-slate-200" />

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          title="Sign out of your account"
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 transition disabled:opacity-50"
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
