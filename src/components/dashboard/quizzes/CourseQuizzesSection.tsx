'use client'

import { useState } from 'react'
import { Quiz, QuizAttempt } from '@/types'
import { QuizzesList } from './QuizzesList'
import { CreateQuizModal } from './CreateQuizModal'
import { HelpCircle, Plus } from 'lucide-react'

interface CourseQuizzesSectionProps {
  courseId: string
  quizzes: (Quiz & {
    userAttempt?: QuizAttempt | null
  })[]
  canManage: boolean
  isEnrolled: boolean
}

export function CourseQuizzesSection({
  courseId,
  quizzes,
  canManage,
  isEnrolled,
}: CourseQuizzesSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-purple-600" />
            Quizzes & Evaluations ({quizzes.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Test comprehension, attempt timed tests, and review performance results
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-purple-700 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            New Quiz
          </button>
        )}
      </div>

      <QuizzesList
        quizzes={quizzes}
        canManage={canManage}
        isEnrolled={isEnrolled}
      />

      <CreateQuizModal
        courseId={courseId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
