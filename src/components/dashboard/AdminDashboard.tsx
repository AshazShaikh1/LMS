import { Profile } from '@/types'
import {
  Users,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  UserPlus,
  Settings,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

interface AdminDashboardProps {
  profile: Profile
}

export function AdminDashboard({ profile }: AdminDashboardProps) {
  const stats = [
    {
      label: 'Registered Students',
      value: '—',
      description: 'Active learner accounts',
      icon: GraduationCap,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      label: 'Instructors',
      value: '—',
      description: 'Verified faculty members',
      icon: Users,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      label: 'Total Courses',
      value: '0',
      description: 'Active academic catalogs',
      icon: BookOpen,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
    {
      label: 'System Status',
      value: 'Optimal',
      description: 'Database & Auth operational',
      icon: ShieldCheck,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Greeting Banner */}
      <div className="rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 p-6 sm:p-8 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="h-4 w-4" />
              Administrative Command Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              System Administration &bull; {profile.full_name || 'Admin'}
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-xl">
              Oversee institution users, provision teacher accounts, monitor course offerings, and configure security policies.
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            <Link
              href="/dashboard/users"
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 text-sm font-semibold shadow-sm transition"
            >
              <UserPlus className="h-4 w-4" />
              Provision Teacher Account
            </Link>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-slate-300"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">
                  {stat.label}
                </span>
                <div className={`rounded-lg p-2.5 border ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-slate-900">
                  {stat.value}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">{stat.description}</p>
            </div>
          )
        })}
      </div>

      {/* Grid: Administrative Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: User Management Oversight */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                User Management Directory
              </h2>
              <p className="text-xs text-slate-500">
                View, manage, and provision student and faculty roles
              </p>
            </div>
            <Link
              href="/dashboard/users"
              className="text-xs font-semibold text-purple-600 hover:text-purple-800"
            >
              Manage directory &rarr;
            </Link>
          </div>

          <div className="rounded-lg bg-slate-50 p-6 border border-slate-200 text-center">
            <Users className="mx-auto h-8 w-8 text-slate-400 mb-2" />
            <h3 className="text-sm font-semibold text-slate-800">
              User Directory Ready
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
              Per requirements, students self-register as learners, while Teacher accounts are provisioned exclusively by Administrators.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <Link
                href="/dashboard/users"
                className="inline-flex items-center gap-2 rounded-md bg-white border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 transition"
              >
                <UserPlus className="h-3.5 w-3.5 text-purple-600" />
                Provision Teacher Account
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: System Controls */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Settings className="h-4 w-4 text-slate-400" />
              Administrative Controls
            </h3>
            <div className="space-y-2">
              <Link
                href="/dashboard/courses"
                className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                <span>Curriculum Course Oversight</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                <span>Security &amp; RLS Configuration</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
