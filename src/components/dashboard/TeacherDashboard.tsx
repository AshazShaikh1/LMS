import { Profile, Course } from '@/types'
import {
  BookOpen,
  ClipboardList,
  Users,
  PlusCircle,
  FileText,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

interface TeacherDashboardProps {
  profile: Profile
  teachingCourses?: (Course & { enrollmentCount?: number })[]
  pendingSubmissionsCount?: number
  activeQuizzesCount?: number
}

export function TeacherDashboard({
  profile,
  teachingCourses = [],
  pendingSubmissionsCount = 0,
  activeQuizzesCount = 0,
}: TeacherDashboardProps) {
  const totalStudents = teachingCourses.reduce((sum, c) => sum + (c.enrollmentCount || 0), 0)

  const stats = [
    {
      label: 'My Courses',
      value: teachingCourses.length.toString(),
      description: 'Active instructional courses',
      icon: BookOpen,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      label: 'Total Submissions',
      value: pendingSubmissionsCount.toString(),
      description: 'Received student submissions',
      icon: ClipboardList,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      label: 'Total Students',
      value: totalStudents.toString(),
      description: 'Across all active courses',
      icon: Users,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      label: 'Active Quizzes',
      value: activeQuizzesCount.toString(),
      description: 'Published quiz evaluations',
      icon: FileText,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Greeting Banner */}
      <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-900 to-slate-900 p-6 sm:p-8 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="h-4 w-4" />
              Instructor Workspace
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome back, Professor {profile.full_name || 'Instructor'}!
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-xl">
              Manage your course curriculums, review student submissions, publish materials, and grade assignments.
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            <Link
              href="/dashboard/courses/new"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2.5 text-sm font-semibold shadow-sm transition"
            >
              <PlusCircle className="h-4 w-4" />
              Create New Course
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

      {/* Grid: Courses Taught & Pending Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Courses Taught */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Instructional Courses ({teachingCourses.length})
              </h2>
              <p className="text-xs text-slate-500">
                Courses you are actively teaching this semester
              </p>
            </div>
            <Link
              href="/dashboard/courses"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-800"
            >
              View all &rarr;
            </Link>
          </div>

          {teachingCourses.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 py-12 px-4 text-center">
              <div className="rounded-full bg-slate-100 p-3 text-slate-400 mb-3">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800">
                No courses created yet
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm">
                Get started by creating your first academic course module. Once published, students can discover and enroll.
              </p>
              <Link
                href="/dashboard/courses/new"
                className="mt-4 inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-emerald-700 transition"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Create Course
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {teachingCourses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-lg border border-slate-200 p-4 hover:border-slate-300 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                        {course.category}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Users className="h-3 w-3" />
                        {course.enrollmentCount || 0} students
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {course.description || 'No description provided'}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/dashboard/courses/${course.id}/edit`}
                      className="text-xs text-slate-600 hover:text-slate-900"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/dashboard/courses/${course.id}`}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-800"
                    >
                      Manage &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Grading Queue & Quick Actions */}
        <div className="space-y-6">
          {/* Grading Queue Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" />
                Grading Queue
              </h3>
            </div>
            <div className="text-center py-6 text-slate-500 text-xs">
              No pending student submissions requiring evaluation.
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Instructor Quick Actions
            </h3>
            <div className="space-y-2">
              <Link
                href="/dashboard/courses/new"
                className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                <span>Create New Course</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
              <Link
                href="/dashboard/announcements"
                className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                <span>Publish Course Announcement</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
