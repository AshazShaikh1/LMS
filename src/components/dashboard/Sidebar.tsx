'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserRole } from '@/types'
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Bell,
  GraduationCap,
  Users,
  Settings,
  FolderArchive,
  UserCircle,
  X
} from 'lucide-react'

interface SidebarProps {
  role: UserRole
  isOpen: boolean
  onClose: () => void
}

interface NavItem {
  name: string
  href: string
  icon: any
}

export function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  const studentNav: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Courses', href: '/dashboard/courses', icon: BookOpen },
    { name: 'Assignments', href: '/dashboard/assignments', icon: FileText },
    { name: 'Grades', href: '/dashboard/grades', icon: GraduationCap },
    { name: 'Announcements', href: '/dashboard/announcements', icon: Bell },
    { name: 'Profile', href: '/dashboard/profile', icon: UserCircle },
  ]

  const teacherNav: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Courses', href: '/dashboard/courses', icon: BookOpen },
    { name: 'Assignments', href: '/dashboard/assignments', icon: FileText },
    { name: 'Materials', href: '/dashboard/materials', icon: FolderArchive },
    { name: 'Announcements', href: '/dashboard/announcements', icon: Bell },
    { name: 'Profile', href: '/dashboard/profile', icon: UserCircle },
  ]

  const adminNav: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/dashboard/users', icon: Users },
    { name: 'Courses Oversight', href: '/dashboard/courses', icon: BookOpen },
    { name: 'System Settings', href: '/dashboard/settings', icon: Settings },
    { name: 'Profile', href: '/dashboard/profile', icon: UserCircle },
  ]

  const navItems = role === 'admin' ? adminNav : role === 'teacher' ? teacherNav : studentNav

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-sm">
              L
            </span>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              LMS Portal
            </span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {role} workspace
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => onClose()}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      isActive ? 'text-indigo-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div className="border-t border-slate-200 p-4 text-xs text-slate-400 text-center">
          Academic LMS &bull; v1.0 MVP
        </div>
      </aside>
    </>
  )
}
