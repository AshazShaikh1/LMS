'use client'

import { useState } from 'react'
import { Quiz, QuizAttempt, QuizQuestion } from '@/types'
import { submitQuizAttempt } from '@/app/dashboard/quizzes/actions'
import {
  X,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  Clock,
  AlertCircle,
  RotateCcw
} from 'lucide-react'

interface QuizPlayerModalProps {
  quiz: Quiz
  isOpen: boolean
  onClose: () => void
  existingAttempt?: QuizAttempt | null
}

export function QuizPlayerModal({
  quiz,
  isOpen,
  onClose,
  existingAttempt,
}: QuizPlayerModalProps) {
  const questions = quiz.questions || []
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>(
    existingAttempt?.answers || {}
  )
  const [attemptResult, setAttemptResult] = useState<QuizAttempt | null>(existingAttempt || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isReviewMode, setIsReviewMode] = useState<boolean>(!!existingAttempt)

  if (!isOpen) return null

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isReviewMode) return
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Check if all questions answered
    const unanswered = questions.filter((q) => selectedAnswers[q.id] === undefined)
    if (unanswered.length > 0) {
      if (
        !confirm(
          `You have ${unanswered.length} unanswered question(s). Are you sure you want to submit?`
        )
      ) {
        return
      }
    }

    setIsSubmitting(true)
    try {
      const res = await submitQuizAttempt(quiz.id, selectedAnswers)
      if (res.error) {
        setError(res.error)
      } else {
        const attempt: QuizAttempt = {
          id: 'temp',
          quiz_id: quiz.id,
          student_id: '',
          started_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
          score: res.score || 0,
          total_points: res.totalPoints || 0,
          percentage: res.percentage || 0,
          passed: !!res.passed,
          answers: selectedAnswers,
        }
        setAttemptResult(attempt)
        setIsReviewMode(true)
      }
    } catch (err: any) {
      setError(err.message || 'Submission failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetake = () => {
    setSelectedAnswers({})
    setAttemptResult(null)
    setIsReviewMode(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl border border-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{quiz.title}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{questions.length} Questions</span>
                <span>&bull;</span>
                <span>Pass: {quiz.passing_score}%</span>
                {quiz.time_limit_minutes > 0 && (
                  <>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {quiz.time_limit_minutes} mins
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Results Banner (Review Mode) */}
        {isReviewMode && attemptResult && (
          <div
            className={`mt-4 rounded-xl border p-4 text-center space-y-1 ${
              attemptResult.passed
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 font-bold text-base">
              {attemptResult.passed ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  Quiz Passed!
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-rose-600" />
                  Quiz Not Passed
                </>
              )}
            </div>
            <p className="text-xs">
              You scored{' '}
              <strong>
                {attemptResult.score} / {attemptResult.total_points}
              </strong>{' '}
              ({attemptResult.percentage}%) &bull; Passing requirement: {quiz.passing_score}%
            </p>
          </div>
        )}

        {/* Questions Form or Review */}
        <form onSubmit={handleSubmit} className="mt-4 flex-1 overflow-y-auto space-y-5 pr-1">
          {questions.map((q, qIndex) => {
            const studentChoice = selectedAnswers[q.id]
            const isCorrect = isReviewMode && studentChoice === q.correct_option_index

            return (
              <div
                key={q.id}
                className={`rounded-xl border p-4 space-y-3 transition ${
                  isReviewMode
                    ? isCorrect
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-rose-200 bg-rose-50/20'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold text-xs sm:text-sm text-slate-900">
                    <span className="text-purple-600 mr-1.5">Q{qIndex + 1}.</span>
                    {q.question_text}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                    {q.points || 1} pt
                  </span>
                </div>

                {/* Options List */}
                <div className="space-y-2">
                  {q.options.map((opt, optIndex) => {
                    const isSelected = studentChoice === optIndex
                    const isTheCorrectAnswer = q.correct_option_index === optIndex

                    let optionStyle = 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
                    if (isReviewMode) {
                      if (isTheCorrectAnswer) {
                        optionStyle = 'border-emerald-300 bg-emerald-50 text-emerald-900 font-semibold'
                      } else if (isSelected && !isTheCorrectAnswer) {
                        optionStyle = 'border-rose-300 bg-rose-50 text-rose-900 font-semibold line-through'
                      } else {
                        optionStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60'
                      }
                    } else if (isSelected) {
                      optionStyle = 'border-purple-500 bg-purple-50 text-purple-900 font-medium'
                    }

                    return (
                      <label
                        key={optIndex}
                        onClick={() => handleSelectOption(q.id, optIndex)}
                        className={`flex items-center gap-2.5 rounded-lg border p-2.5 text-xs transition cursor-pointer ${optionStyle}`}
                      >
                        <input
                          type="radio"
                          name={`q_${q.id}`}
                          disabled={isReviewMode}
                          checked={isSelected}
                          onChange={() => handleSelectOption(q.id, optIndex)}
                          className="h-3.5 w-3.5 text-purple-600 border-slate-300 focus:ring-purple-500 cursor-pointer"
                        />
                        <span className="font-bold text-[11px] text-slate-400">
                          {String.fromCharCode(65 + optIndex)}.
                        </span>
                        <span className="flex-1">{opt}</span>

                        {isReviewMode && isTheCorrectAnswer && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 rounded px-1.5 py-0.5">
                            Correct Answer
                          </span>
                        )}
                        {isReviewMode && isSelected && !isTheCorrectAnswer && (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-100 rounded px-1.5 py-0.5">
                            Your Choice
                          </span>
                        )}
                      </label>
                    )
                  })}
                </div>
              </div>
            )
          })}

          <div className="sticky bottom-0 bg-white border-t border-slate-100 pt-3 flex items-center justify-between">
            {isReviewMode ? (
              <button
                type="button"
                onClick={handleRetake}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Retake Quiz
              </button>
            ) : (
              <span className="text-xs text-slate-400">
                {Object.keys(selectedAnswers).length} of {questions.length} answered
              </span>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                {isReviewMode ? 'Done' : 'Cancel'}
              </button>

              {!isReviewMode && (
                <button
                  type="submit"
                  disabled={isSubmitting || questions.length === 0}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Evaluating...' : 'Submit Answers'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
