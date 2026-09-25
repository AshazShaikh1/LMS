'use client'

import { useState } from 'react'
import { Assignment, Submission, UserRole } from '@/types'
import { AssignmentsList } from '@/components/dashboard/assignments/AssignmentsList'
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  GraduationCap
} from 'lucide-react'

interface AssignmentsHubClientProps {
  assignments: (Assignment & {
    submissions?: Submission[]
    userSubmission?: Submission | null
  })[]
  role: UserRole
  currentUserId: string
}

export function AssignmentsHubClient({
  assignments,
  role,
  currentUserId,
}: AssignmentsHubClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'submitted' | 'overdue'>('all')

  const isStudent = role === 'student'
  const canManage = role === 'teacher' || role === 'admin'

  // Calculate statistics
  const totalCount = assignments.length

  const submittedCount = isStudent
    ? assignments.filter((a) => !!a.userSubmission).length
    : assignments.reduce((acc, a) => acc + (a.submissions?.length || 0), 0)

  const pendingCount = isStudent
    ? assignments.filter((a) => !a.userSubmission && new Date(a.due_date).getTime() >= Date.now()).length
    : assignments.filter((a) => new Date(a.due_date).getTime() >= Date.now()).length

  const overdueCount = isStudent
    ? assignments.filter((a) => !a.userSubmission && new Date(a.due_date).getTime() < Date.now()).length
    : assignments.filter((a) => new Date(a.due_date).getTime() < Date.now()).length

  // Filtered items
  const filteredAssignments = assignments.filter((a) => {
    // Search match
    const titleMatch = a.title.toLowerCase().includes(searchQuery.toLowerCase())
    const courseMatch = a.course?.title.toLowerCase().includes(searchQuery.toLowerCase()) || false
    if (!titleMatch && !courseMatch) return false

    // Tab match
    const isPast = new Date(a.due_date).getTime() < Date.now()

    if (isStudent) {
      if (filterTab === 'submitted') return !!a.userSubmission
      if (filterTab === 'pending') return !a.userSubmission && !isPast
      if (filterTab === 'overdue') return !a.userSubmission && isPast
    } else {
      if (filterTab === 'overdue') return isPast
      if (filterTab === 'pending') return !isPast
    }

    return true
  })

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
              <FileText className="h-5 w-5" />
            </div>
            Assignments & Submissions Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isStudent
              ? 'Track deadlines, review project guidelines, and upload your coursework submissions'
              : 'Monitor active coursework tasks, due dates, and inspect student submissions'}
          </p>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {canManage ? 'Published Tasks' : 'Total Coursework'}
            </span>
            <FileText className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{totalCount}</div>
          <div className="mt-1 text-[11px] text-slate-400">Across enrolled subjects</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600">
              {canManage ? 'Active Deadlines' : 'Pending Work'}
            </span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-600">{pendingCount}</div>
          <div className="mt-1 text-[11px] text-amber-700/70">Awaiting submission</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600">
              {canManage ? 'Total Submissions' : 'Completed Work'}
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600">{submittedCount}</div>
          <div className="mt-1 text-[11px] text-emerald-700/70">Turned in on time</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-600">Past Due</span>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-600">{overdueCount}</div>
          <div className="mt-1 text-[11px] text-rose-700/70">Deadline passed</div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterTab('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition shrink-0 ${
              filterTab === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setFilterTab('pending')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition shrink-0 ${
              filterTab === 'pending'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Pending ({pendingCount})
          </button>
          {isStudent && (
            <button
              onClick={() => setFilterTab('submitted')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition shrink-0 ${
                filterTab === 'submitted'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Submitted ({submittedCount})
            </button>
          )}
          <button
            onClick={() => setFilterTab('overdue')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition shrink-0 ${
              filterTab === 'overdue'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Past Due ({overdueCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search assignments or courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Assignments List */}
      <AssignmentsList
        assignments={filteredAssignments}
        canManage={canManage}
        isEnrolled={true}
        currentUserId={currentUserId}
      />
    </div>
  )
}
