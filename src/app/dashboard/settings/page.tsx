import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import {
  ShieldCheck,
  Database,
  Lock,
  HardDrive,
  Users,
  CheckCircle2,
  Server,
  Layers
} from 'lucide-react'

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  // System checks
  const [
    { count: usersCount },
    { count: coursesCount },
    { count: assignmentsCount },
    { count: submissionsCount },
    { count: quizzesCount },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('assignments').select('*', { count: 'exact', head: true }),
    supabase.from('submissions').select('*', { count: 'exact', head: true }),
    supabase.from('quizzes').select('*', { count: 'exact', head: true }),
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs">
            <ShieldCheck className="h-5 w-5" />
          </div>
          Administrative System Controls &amp; Security
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review database policies, row-level security enforcement, storage limits, and role access matrices
        </p>
      </div>

      {/* Grid: System Status & Security */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* RLS Status Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-600">
            <Lock className="h-5 w-5" />
            <h2 className="text-sm font-bold text-slate-900">Row-Level Security</h2>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            All tables enforce strict PostgreSQL RLS policies preventing unauthorized access across roles.
          </p>
          <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>RLS Active on 7 Core Tables</span>
          </div>
        </div>

        {/* Database Health Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-indigo-600">
            <Database className="h-5 w-5" />
            <h2 className="text-sm font-bold text-slate-900">Database &amp; Engine</h2>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            PostgreSQL engine with transaction pooler running on Supabase infrastructure.
          </p>
          <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-2.5 text-[11px] text-indigo-800 font-semibold flex items-center gap-1.5">
            <Server className="h-4 w-4 shrink-0 text-indigo-600" />
            <span>Postgres Pooler Connected</span>
          </div>
        </div>

        {/* Storage Buckets Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-purple-600">
            <HardDrive className="h-5 w-5" />
            <h2 className="text-sm font-bold text-slate-900">Storage Buckets</h2>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Private encrypted buckets with 25 MB max limit and 1-hour secure signed download URLs.
          </p>
          <div className="rounded-lg bg-purple-50 border border-purple-200 p-2.5 text-[11px] text-purple-800 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-purple-600" />
            <span>course-materials &amp; assignment-submissions</span>
          </div>
        </div>
      </div>

      {/* Database Entity Counts */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Layers className="h-5 w-5 text-slate-700" />
          Live Institutional Database Metrics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-center">
            <div className="text-xs text-slate-500 font-medium">User Profiles</div>
            <div className="text-xl font-bold text-slate-900 mt-1">{usersCount || 0}</div>
          </div>
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-center">
            <div className="text-xs text-slate-500 font-medium">Courses</div>
            <div className="text-xl font-bold text-slate-900 mt-1">{coursesCount || 0}</div>
          </div>
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-center">
            <div className="text-xs text-slate-500 font-medium">Assignments</div>
            <div className="text-xl font-bold text-slate-900 mt-1">{assignmentsCount || 0}</div>
          </div>
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-center">
            <div className="text-xs text-slate-500 font-medium">Submissions</div>
            <div className="text-xl font-bold text-slate-900 mt-1">{submissionsCount || 0}</div>
          </div>
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-center">
            <div className="text-xs text-slate-500 font-medium">Quizzes</div>
            <div className="text-xl font-bold text-slate-900 mt-1">{quizzesCount || 0}</div>
          </div>
        </div>
      </div>

      {/* Role Access Matrix */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-600" />
          Academic Role Hierarchy &amp; Permission Matrix
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Onboarding Method</th>
                <th className="py-2.5 px-3">Capabilities</th>
                <th className="py-2.5 px-3">Scope Boundary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-3 font-bold text-blue-700">Student</td>
                <td className="py-3 px-3 text-slate-600">Self-registration via signup form</td>
                <td className="py-3 px-3 text-slate-600">
                  Enroll in courses, download materials, submit coursework, take quizzes, view grades
                </td>
                <td className="py-3 px-3 text-slate-400">Restricted to enrolled subjects and own submissions</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-emerald-700">Teacher</td>
                <td className="py-3 px-3 text-slate-600">Provisioned exclusively by Administrator</td>
                <td className="py-3 px-3 text-slate-600">
                  Create courses, publish lectures/materials, post announcements, issue assignments, grade submissions, build quizzes
                </td>
                <td className="py-3 px-3 text-slate-400">Scoped to instructed courses and students</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-purple-700">Administrator</td>
                <td className="py-3 px-3 text-slate-600">System initialization / Database promotion</td>
                <td className="py-3 px-3 text-slate-600">
                  Full oversight: user role modification, course editing/deletion, institution gradebooks, system settings
                </td>
                <td className="py-3 px-3 text-slate-400">Global institutional access</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
