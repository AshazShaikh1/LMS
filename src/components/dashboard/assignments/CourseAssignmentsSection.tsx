'use client'

import { useState } from 'react'
import { Assignment, Submission } from '@/types'
import { AssignmentsList } from './AssignmentsList'
import { CreateAssignmentModal } from './CreateAssignmentModal'
import { FileCheck, Plus } from 'lucide-react'

interface CourseAssignmentsSectionProps {
  courseId: string
  assignments: (Assignment & {
    submissions?: Submission[]
    userSubmission?: Submission | null
  })[]
  canManage: boolean
  isEnrolled: boolean
  currentUserId?: string
}

export function CourseAssignmentsSection({
  courseId,
  assignments,
  canManage,
  isEnrolled,
  currentUserId,
}: CourseAssignmentsSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-indigo-600" />
            Coursework & Assignments ({assignments.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit homework, view project guidelines, and track deadlines
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            New Assignment
          </button>
        )}
      </div>

      <AssignmentsList
        assignments={assignments}
        canManage={canManage}
        isEnrolled={isEnrolled}
        currentUserId={currentUserId}
      />

      <CreateAssignmentModal
        courseId={courseId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
