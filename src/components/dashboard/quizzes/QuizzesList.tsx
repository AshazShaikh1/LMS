'use client'

import { useState } from 'react'
import { Quiz, QuizAttempt } from '@/types'
import { QuizPlayerModal } from './QuizPlayerModal'
import { deleteQuiz } from '@/app/dashboard/quizzes/actions'
import {
  HelpCircle,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Trash2,
  Users,
  AlertCircle
} from 'lucide-react'

interface QuizzesListProps {
  quizzes: (Quiz & {
    userAttempt?: QuizAttempt | null
  })[]
  canManage: boolean
  isEnrolled: boolean
}

export function QuizzesList({ quizzes, canManage, isEnrolled }: QuizzesListProps) {
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async (quizId: string) => {
    if (!confirm('Are you sure you want to delete this quiz and all student attempts?')) {
      return
    }

    setDeletingId(quizId)
    setError(null)
    try {
      const res = await deleteQuiz(quizId)
      if (res.error) {
        setError(res.error)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete quiz')
    } finally {
      setDeletingId(null)
    }
  }

  if (quizzes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center bg-slate-50/50">
        <HelpCircle className="mx-auto h-9 w-9 text-slate-300 mb-2" />
        <h3 className="text-sm font-semibold text-slate-700">No quizzes available</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          {canManage
            ? 'Publish interactive multiple-choice evaluations and knowledge-checks for your students.'
            : 'Your instructor has not scheduled any quizzes for this course yet.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {quizzes.map((quiz) => {
        const attempt = quiz.userAttempt
        const questionCount = quiz.questions?.length || 0

        return (
          <div
            key={quiz.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{quiz.title}</h3>
                  <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[11px] font-semibold text-purple-700 border border-purple-100">
                    {questionCount} Questions
                  </span>
                  {quiz.time_limit_minutes > 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                      <Clock className="h-3 w-3" /> {quiz.time_limit_minutes} mins
                    </span>
                  ) : (
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                      Untimed
                    </span>
                  )}
                  {quiz.course && (
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 border border-indigo-100">
                      {quiz.course.title}
                    </span>
                  )}
                </div>

                {quiz.description && (
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {quiz.description}
                  </p>
                )}
              </div>

              <div className="sm:text-right shrink-0">
                <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
                  <Award className="h-3.5 w-3.5 text-amber-500" />
                  Pass: {quiz.passing_score}%
                </span>
              </div>
            </div>

            {/* Footer with status & actions */}
            <div className="border-t border-slate-100 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                {canManage ? (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span>
                      <strong>{quiz.attempts?.length || 0}</strong> Student Attempts Recorded
                    </span>
                  </div>
                ) : isEnrolled ? (
                  attempt ? (
                    <div className="flex items-center gap-2">
                      {attempt.passed ? (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Passed ({attempt.percentage}%)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                          <XCircle className="h-3.5 w-3.5" /> Not Passed ({attempt.percentage}%)
                        </span>
                      )}
                      <span className="text-slate-400">
                        Score: {attempt.score} / {attempt.total_points} pts
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-500 font-medium">Ready to attempt</span>
                  )
                ) : (
                  <span className="text-slate-400">Enroll to take quizzes</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {canManage ? (
                  <button
                    onClick={() => handleDelete(quiz.id)}
                    disabled={deletingId === quiz.id}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition disabled:opacity-50"
                    title="Delete Quiz"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                ) : isEnrolled ? (
                  <button
                    onClick={() => setActiveQuiz(quiz)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold text-white transition ${
                      attempt
                        ? 'bg-slate-700 hover:bg-slate-800'
                        : 'bg-purple-600 hover:bg-purple-700 shadow-xs'
                    }`}
                  >
                    <PlayCircle className="h-3.5 w-3.5" />
                    {attempt ? 'Review / Retake' : 'Take Quiz'}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        )
      })}

      {/* Quiz Player Modal */}
      {activeQuiz && (
        <QuizPlayerModal
          quiz={activeQuiz}
          existingAttempt={activeQuiz.userAttempt}
          isOpen={!!activeQuiz}
          onClose={() => setActiveQuiz(null)}
        />
      )}
    </div>
  )
}
