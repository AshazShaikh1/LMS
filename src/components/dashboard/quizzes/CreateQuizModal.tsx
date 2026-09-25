'use client'

import { useState } from 'react'
import { createQuiz, QuestionInput } from '@/app/dashboard/quizzes/actions'
import {
  X,
  HelpCircle,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Award
} from 'lucide-react'

interface CreateQuizModalProps {
  courseId: string
  isOpen: boolean
  onClose: () => void
}

export function CreateQuizModal({ courseId, isOpen, onClose }: CreateQuizModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [timeLimit, setTimeLimit] = useState('0')
  const [passingScore, setPassingScore] = useState('60')
  const [questions, setQuestions] = useState<QuestionInput[]>([
    {
      question_text: '',
      options: ['', '', '', ''],
      correct_option_index: 0,
      points: 1,
    },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: '',
        options: ['', '', '', ''],
        correct_option_index: 0,
        points: 1,
      },
    ])
  }

  const handleRemoveQuestion = (qIndex: number) => {
    if (questions.length <= 1) {
      setError('Quiz must contain at least one question.')
      return
    }
    setQuestions(questions.filter((_, i) => i !== qIndex))
  }

  const handleQuestionTextChange = (qIndex: number, text: string) => {
    const updated = [...questions]
    updated[qIndex].question_text = text
    setQuestions(updated)
  }

  const handleOptionChange = (qIndex: number, optIndex: number, text: string) => {
    const updated = [...questions]
    updated[qIndex].options[optIndex] = text
    setQuestions(updated)
  }

  const handleCorrectOptionChange = (qIndex: number, optIndex: number) => {
    const updated = [...questions]
    updated[qIndex].correct_option_index = optIndex
    setQuestions(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!title.trim()) {
      setError('Please provide a quiz title.')
      return
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.question_text.trim()) {
        setError(`Question #${i + 1} text is empty.`)
        return
      }
      for (let o = 0; o < q.options.length; o++) {
        if (!q.options[o].trim()) {
          setError(`Question #${i + 1}, Option ${String.fromCharCode(65 + o)} is empty.`)
          return
        }
      }
    }

    setIsSubmitting(true)
    try {
      const res = await createQuiz(courseId, {
        title: title.trim(),
        description: description.trim(),
        time_limit_minutes: parseInt(timeLimit, 10) || 0,
        passing_score: parseInt(passingScore, 10) || 60,
        questions,
      })

      if (res.error) {
        setError(res.error)
      } else {
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
          setTitle('')
          setDescription('')
          setTimeLimit('0')
          setPassingScore('60')
          setQuestions([
            {
              question_text: '',
              options: ['', '', '', ''],
              correct_option_index: 0,
              points: 1,
            },
          ])
          onClose()
        }, 1200)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create quiz')
    } finally {
      setIsSubmitting(false)
    }
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
              <h2 className="text-base font-bold text-slate-900">Create New Course Quiz</h2>
              <p className="text-xs text-slate-500">Configure questions, options, and passing threshold</p>
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

        {success ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 animate-bounce" />
            <h3 className="text-base font-semibold text-slate-900">Quiz Published Successfully!</h3>
            <p className="text-xs text-slate-500">Students can now attempt this evaluation.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1">
            {/* Title & Description */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quiz Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Chapter 3: Dynamic Programming Concepts"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Instructions / Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Instructions for students (e.g. Select the single best answer for each question)..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-400" />
                    Time Limit (Minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="180"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(e.target.value)}
                    placeholder="0 = Untimed"
                    className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-purple-500 focus:outline-hidden"
                  />
                  <span className="text-[10px] text-slate-400">Set 0 for untimed quiz</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Award className="h-3 w-3 text-slate-400" />
                    Passing Score (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={passingScore}
                    onChange={(e) => setPassingScore(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-purple-500 focus:outline-hidden"
                  />
                  <span className="text-[10px] text-slate-400">Minimum percentage to pass</span>
                </div>
              </div>
            </div>

            {/* Questions Section */}
            <div className="border-t border-slate-100 pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Questions ({questions.length})
                </h3>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="inline-flex items-center gap-1 rounded-lg bg-purple-50 border border-purple-200 px-2.5 py-1 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition"
                >
                  <Plus className="h-3 w-3" />
                  Add Question
                </button>
              </div>

              {questions.map((q, qIndex) => (
                <div
                  key={qIndex}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-700">
                      Question #{qIndex + 1}
                    </span>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIndex)}
                        className="text-slate-400 hover:text-rose-600 transition"
                        title="Remove question"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Type question prompt here..."
                      value={q.question_text}
                      onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:outline-hidden"
                    />
                  </div>

                  {/* Options */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-semibold text-slate-500">
                      Options (Select the correct answer):
                    </div>
                    {q.options.map((opt, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct_${qIndex}`}
                          checked={q.correct_option_index === optIndex}
                          onChange={() => handleCorrectOptionChange(qIndex, optIndex)}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 cursor-pointer"
                        />
                        <span className="w-5 text-xs font-bold text-slate-400">
                          {String.fromCharCode(65 + optIndex)}.
                        </span>
                        <input
                          type="text"
                          required
                          placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                          value={opt}
                          onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                          className={`flex-1 rounded-lg border px-3 py-1.5 text-xs text-slate-900 focus:outline-hidden ${
                            q.correct_option_index === optIndex
                              ? 'border-purple-300 bg-purple-50/30'
                              : 'border-slate-200 bg-white'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-slate-100 pt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-purple-700 transition disabled:opacity-50"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Quiz'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
