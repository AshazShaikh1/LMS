import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  GraduationCap,
  BookOpen,
  FolderArchive,
  Bell,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Users,
  CheckCircle2,
  LayoutDashboard,
  UserCheck
} from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, role, email')
      .eq('id', user.id)
      .single()
    profile = data
  }

  const role = profile?.role || 'student'
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Academic User'

  const highlights = [
    {
      title: 'Course Hub & Catalogs',
      description: 'Discover curriculum offerings, syllabi, instructor profiles, and 1-click student enrollments.',
      icon: BookOpen,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      title: 'Learning Materials',
      description: 'Centralized access to lecture slides, reading syllabi, and downloadable documents.',
      icon: FolderArchive,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      title: 'Campus Noticeboard',
      description: 'Instant announcements from faculty regarding exams, schedule updates, and syllabus changes.',
      icon: Bell,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    {
      title: 'Institutional Security',
      description: 'Strict role-based isolation (Student, Teacher, Admin) backed by PostgreSQL Row Level Security.',
      icon: ShieldCheck,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
    },
  ]

  const roles = [
    {
      roleKey: 'student',
      role: 'Student Portal',
      description: 'Self-register as a learner, browse catalog courses, enroll, download study materials, and track assignments.',
      badge: 'Learner Access',
      link: user ? '/dashboard' : '/register',
      btnText: user ? 'Open Student Dashboard' : 'Register as Student',
    },
    {
      roleKey: 'teacher',
      role: 'Faculty Workspace',
      description: 'Manage assigned curriculums, upload course lecture decks, broadcast class announcements, and grade submissions.',
      badge: 'Instructor Access',
      link: user ? '/dashboard' : '/login',
      btnText: user ? 'Open Faculty Workspace' : 'Faculty Sign In',
    },
    {
      roleKey: 'admin',
      role: 'Administration',
      description: 'Oversee student & teacher accounts, provision instructor roles, monitor course rosters, and enforce security policies.',
      badge: 'System Admin',
      link: user ? '/dashboard' : '/login',
      btnText: user ? 'Open Admin Console' : 'Admin Portal',
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-xs">
              L
            </span>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight">
                LMS Portal
              </span>
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                Academic Management System
              </span>
            </div>
          </Link>

          {/* Conditional Navigation based on Auth State */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-900">
                    {displayName}
                  </span>
                  <span className="text-[11px] capitalize text-indigo-600 font-semibold">
                    {role} Account
                  </span>
                </div>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-indigo-700 transition"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Go to Dashboard</span>
                </Link>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-indigo-600 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-indigo-700 transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-12 sm:py-20 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-white via-indigo-50/30 to-slate-50 border-b border-slate-200">
          <div className="mx-auto max-w-4xl space-y-6">
            {user ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-800 shadow-xs">
                <UserCheck className="h-4 w-4 text-emerald-600" />
                Signed in as {displayName} ({role})
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700 shadow-xs">
                <Sparkles className="h-3.5 w-3.5" />
                Modern Academic Learning Management System
              </div>
            )}

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Empowering Academic <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Learning &amp; Faculty Instruction
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-600 leading-relaxed">
              A unified, role-based platform connecting students, faculty instructors, and academic administrators. Access curriculum syllabi, download lecture notes, view real-time noticeboards, and manage course enrollments.
            </p>

            {/* Conditional Call to Action Buttons */}
            {user ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-indigo-700 transition"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Open My Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/dashboard/courses"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Browse Course Catalog</span>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-indigo-700 transition"
                >
                  <span>Register as Student</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition"
                >
                  Sign In to Portal
                </Link>
              </div>
            )}

            <div className="pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Role-Based Workspaces
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Supabase Storage Integration
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Instant Course Feeds
              </span>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Complete Academic Infrastructure
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              Engineered with modern Next.js App Router, Tailwind CSS, and Supabase PostgreSQL.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {highlights.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 hover:shadow-sm transition"
                >
                  <div className={`inline-flex rounded-xl p-3 border ${item.color} mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Role Portals Showcase */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200">
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Tailored for Every Academic Role
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-500">
                Designed to deliver tailored capabilities for students, faculty instructors, and administration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {roles.map((r) => {
                const isCurrentRole = user && r.roleKey === role
                return (
                  <div
                    key={r.role}
                    className={`rounded-2xl border p-6 flex flex-col justify-between transition ${
                      isCurrentRole
                        ? 'border-indigo-400 bg-indigo-50/40 shadow-sm ring-1 ring-indigo-400'
                        : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-block rounded-md bg-white border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs">
                          {r.badge}
                        </span>
                        {isCurrentRole && (
                          <span className="rounded-full bg-indigo-600 text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                            Your Role
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {r.role}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
                        {r.description}
                      </p>
                    </div>

                    <Link
                      href={r.link}
                      className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold shadow-2xs transition ${
                        isCurrentRole
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <span>{r.btnText}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-100 py-8 px-4 sm:px-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-[10px] font-bold text-white">
              L
            </span>
            <span className="font-semibold text-slate-800">Academic LMS Portal</span>
            <span>&bull; Academic MVP v1.0</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            {user ? (
              <Link href="/dashboard" className="hover:text-slate-600 transition font-semibold text-indigo-600">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="hover:text-slate-600 transition">Sign In</Link>
                <span>&bull;</span>
                <Link href="/register" className="hover:text-slate-600 transition">Register</Link>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
