import { Profile, Course, Announcement } from '@/types'
import {
  BookOpen,
  FileCheck2,
  Bell,
  GraduationCap,
  Calendar,
  ArrowRight,
  Sparkles,
  User
} from 'lucide-react'
import Link from 'next/link'

interface StudentDashboardProps {
  profile: Profile
  enrolledCourses?: (Course & { enrollmentCount?: number })[]
  announcements?: Announcement[]
  pendingAssignmentsCount?: number
  averageGrade?: string
}

export function StudentDashboard({
  profile,
  enrolledCourses = [],
  announcements = [],
  pendingAssignmentsCount = 0,
  averageGrade = '—',
}: StudentDashboardProps) {
  const stats = [
    {
      label: 'Enrolled Courses',
      value: enrolledCourses.length.toString(),
      description: 'Active semester courses',
      icon: BookOpen,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      label: 'Pending Assignments',
      value: pendingAssignmentsCount.toString(),
      description: 'Awaiting submission',
      icon: FileCheck2,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      label: 'Announcements',
      value: announcements.length.toString(),
      description: 'Course noticeboard updates',
      icon: Bell,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      label: 'Average Grade',
      value: averageGrade,
      description: 'Overall semester GPA',
      icon: GraduationCap,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Greeting Banner */}
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="h-4 w-4" />
              Student Academic Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome back, {profile.full_name || 'Student'}!
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-xl">
              Track your enrolled courses, submit assignments, and review grades from your unified student dashboard.
            </p>
          </div>
          <div className="flex shrink-0 w-full sm:w-auto">
            <Link
              href="/dashboard/courses"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white px-5 py-3 text-sm font-semibold shadow-sm transition"
            >
              Browse Course Catalog
              <ArrowRight className="h-4 w-4" />
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

      {/* Grid: Enrolled Courses & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: My Enrolled Courses */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                My Enrolled Courses ({enrolledCourses.length})
              </h2>
              <p className="text-xs text-slate-500">
                Courses you are actively attending this semester
              </p>
            </div>
            <Link
              href="/dashboard/courses"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View catalog &rarr;
            </Link>
          </div>

          {enrolledCourses.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 py-12 px-4 text-center">
              <div className="rounded-full bg-slate-100 p-3 text-slate-400 mb-3">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800">
                No courses enrolled yet
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm">
                You have not enrolled in any courses for this term. Browse the available courses to get started.
              </p>
              <Link
                href="/dashboard/courses"
                className="mt-4 inline-flex items-center gap-2 rounded-md bg-white border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 transition"
              >
                Explore Course Catalog
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {enrolledCourses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-lg border border-slate-200 p-4 hover:border-slate-300 transition flex flex-col justify-between"
                >
                  <div>
                    <span className="inline-block rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 mb-2">
                      {course.category}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {course.description || 'No description available'}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Instructor: {course.teacher?.full_name || 'Faculty'}
                    </span>
                    <Link
                      href={`/dashboard/courses/${course.id}`}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      Open &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Upcoming Deadlines & Announcements */}
        <div className="space-y-6">
          {/* Upcoming Assignments Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                Upcoming Deadlines
              </h3>
            </div>
            <div className="text-center py-6 text-slate-500 text-xs">
              No upcoming assignments due. You are all caught up!
            </div>
          </div>

          {/* Recent Announcements Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Bell className="h-4 w-4 text-amber-500" />
                Recent Announcements ({announcements.length})
              </h3>
              <Link
                href="/dashboard/announcements"
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
              >
                View all &rarr;
              </Link>
            </div>

            {announcements.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                No new announcements posted by your instructors.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {announcements.slice(0, 3).map((item) => (
                  <div key={item.id} className="py-2.5">
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                      {item.content}
                    </p>
                    <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{item.teacher?.full_name || 'Instructor'}</span>
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
