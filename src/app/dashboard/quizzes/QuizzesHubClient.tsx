'use client'

import { useState } from 'react'
import { Quiz, QuizAttempt, UserRole } from '@/types'
import { QuizzesList } from '@/components/dashboard/quizzes/QuizzesList'
import {
  HelpCircle,
  Award,
  CheckCircle2,
  Clock,
  Search,
  BookOpen
} from 'lucide-react'

interface QuizzesHubClientProps {
  quizzes: (Quiz & {
    userAttempt?: QuizAttempt | null
  })[]
  role: UserRole
}

export function QuizzesHubClient({ quizzes, role }: QuizzesHubClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'completed'>('all')

  const isStudent = role === 'student'
  const canManage = role === 'teacher' || role === 'admin'

  const totalQuizzes = quizzes.length
  const completedAttempts = isStudent
    ? quizzes.filter((q) => !!q.userAttempt).length
    : quizzes.reduce((sum, q) => sum + (q.attempts?.length || 0), 0)

  const passedAttempts = isStudent
    ? quizzes.filter((q) => q.userAttempt?.passed).length
    : quizzes.reduce((sum, q) => sum + (q.attempts?.filter((att) => att.passed).length || 0), 0)

  const passRate = completedAttempts > 0 ? Math.round((passedAttempts / completedAttempts) * 100) : 0

  const filteredQuizzes = quizzes.filter((q) => {
    const titleMatch = q.title.toLowerCase().includes(searchQuery.toLowerCase())
    const courseMatch = q.course?.title.toLowerCase().includes(searchQuery.toLowerCase()) || false
    if (!titleMatch && !courseMatch) return false

    if (isStudent) {
      if (filterTab === 'pending') return !q.userAttempt
      if (filterTab === 'completed') return !!q.userAttempt
    }
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs">
            <HelpCircle className="h-5 w-5" />
          </div>
          Quizzes & Knowledge Checks
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {isStudent
            ? 'Test your understanding, attempt semester quizzes, and review immediate performance results'
            : 'Publish MCQ quizzes, manage time limits, and inspect student attempt metrics'}
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {canManage ? 'Published Quizzes' : 'Available Quizzes'}
            </span>
            <HelpCircle className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{totalQuizzes}</div>
          <div className="mt-1 text-[11px] text-slate-400">Across enrolled subjects</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {canManage ? 'Total Attempts' : 'Completed Tests'}
            </span>
            <Clock className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{completedAttempts}</div>
          <div className="mt-1 text-[11px] text-slate-400">Submitted evaluations</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600">Passed Tests</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600">{passedAttempts}</div>
          <div className="mt-1 text-[11px] text-emerald-700/70">Met passing score</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600">Pass Rate</span>
            <Award className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-600">{passRate}%</div>
          <div className="mt-1 text-[11px] text-amber-700/70">Success percentage</div>
        </div>
      </div>

      {/* Search and Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {isStudent && (
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setFilterTab('all')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filterTab === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              All ({totalQuizzes})
            </button>
            <button
              onClick={() => setFilterTab('pending')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filterTab === 'pending'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Ready to Take ({totalQuizzes - completedAttempts})
            </button>
            <button
              onClick={() => setFilterTab('completed')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filterTab === 'completed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Completed ({completedAttempts})
            </button>
          </div>
        )}

        <div className="relative w-full sm:w-64 ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search quizzes or courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Quizzes List */}
      <QuizzesList
        quizzes={filteredQuizzes}
        canManage={canManage}
        isEnrolled={true}
      />
    </div>
  )
}
