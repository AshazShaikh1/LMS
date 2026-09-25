'use client'

import { useState } from 'react'
import { Assignment, Submission } from '@/types'
import { SubmitAssignmentModal } from './SubmitAssignmentModal'
import { SubmissionsViewModal } from './SubmissionsViewModal'
import { deleteAssignment, getSubmissionDownloadUrl } from '@/app/dashboard/assignments/actions'
import {
  FileText,
  Calendar,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  Download,
  Trash2,
  Users
} from 'lucide-react'

interface AssignmentsListProps {
  assignments: (Assignment & {
    submissions?: Submission[]
    userSubmission?: Submission | null
  })[]
  canManage: boolean
  isEnrolled: boolean
  currentUserId?: string
}

export function AssignmentsList({
  assignments,
  canManage,
  isEnrolled,
  currentUserId,
}: AssignmentsListProps) {
  // Submission modal state
  const [activeSubmitAssignment, setActiveSubmitAssignment] = useState<Assignment | null>(null)
  // Teacher submissions review modal state
  const [activeReviewAssignment, setActiveReviewAssignment] = useState<Assignment | null>(null)

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [downloadingSubId, setDownloadingSubId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleDelete = async (assignmentId: string) => {
    if (!confirm('Are you sure you want to delete this assignment and all student submissions?')) {
      return
    }

    setDeletingId(assignmentId)
    setErrorMessage(null)
    try {
      const res = await deleteAssignment(assignmentId)
      if (res.error) {
        setErrorMessage(res.error)
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete assignment')
    } finally {
      setDeletingId(null)
    }
  }

  const handleDownloadStudentSubmission = async (subId: string, fallbackName: string) => {
    setDownloadingSubId(subId)
    setErrorMessage(null)
    try {
      const res = await getSubmissionDownloadUrl(subId)
      if (res.error) {
        setErrorMessage(res.error)
      } else if (res.downloadUrl) {
        const a = document.createElement('a')
        a.href = res.downloadUrl
        a.download = res.fileName || fallbackName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Download failed')
    } finally {
      setDownloadingSubId(null)
    }
  }

  if (assignments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center bg-slate-50/50">
        <FileText className="mx-auto h-9 w-9 text-slate-300 mb-2" />
        <h3 className="text-sm font-semibold text-slate-700">No assignments created yet</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          {canManage
            ? 'Publish coursework, homework tasks, or midterm projects for your students.'
            : 'Your instructor has not posted any coursework or assignments yet.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {assignments.map((assignment) => {
        const dueDate = new Date(assignment.due_date)
        const isPastDue = dueDate.getTime() < Date.now()
        const userSubmission = assignment.userSubmission

        return (
          <div
            key={assignment.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition space-y-4"
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    {assignment.title}
                  </h3>
                  <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 border border-slate-200">
                    <Award className="h-3 w-3 text-amber-500" />
                    {assignment.max_marks} Marks
                  </span>
                  {assignment.course && (
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 border border-indigo-100">
                      {assignment.course.title}
                    </span>
                  )}
                </div>

                {assignment.description && (
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {assignment.description}
                  </p>
                )}
              </div>

              {/* Deadline badge */}
              <div className="sm:text-right shrink-0">
                <div
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                    isPastDue
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    Due {dueDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} at{' '}
                    {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions / Status footer */}
            <div className="border-t border-slate-100 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              {/* Left: Status info */}
              <div>
                {canManage ? (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Users className="h-4 w-4 text-indigo-600" />
                    <span>
                      <strong>{assignment.submissions?.length || 0}</strong> Student Submissions
                    </span>
                  </div>
                ) : isEnrolled ? (
                  userSubmission ? (
                    <div className="flex items-center gap-2 text-emerald-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>
                        Submitted on{' '}
                        {new Date(userSubmission.submitted_at).toLocaleDateString()}{' '}
                        ({userSubmission.file_name})
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="h-4 w-4 text-amber-500" />
                      <span className={isPastDue ? 'text-rose-600 font-semibold' : ''}>
                        {isPastDue ? 'Past deadline (Late submission)' : 'Not submitted yet'}
                      </span>
                    </div>
                  )
                ) : (
                  <span className="text-slate-400">Enroll to submit work</span>
                )}
              </div>

              {/* Right: Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {canManage ? (
                  <>
                    <button
                      onClick={() => setActiveReviewAssignment(assignment)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 border border-indigo-200 px-3 py-1.5 font-semibold text-indigo-700 hover:bg-indigo-100 transition"
                    >
                      <Users className="h-3.5 w-3.5" />
                      View Submissions ({assignment.submissions?.length || 0})
                    </button>
                    <button
                      onClick={() => handleDelete(assignment.id)}
                      disabled={deletingId === assignment.id}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition disabled:opacity-50"
                      title="Delete assignment"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : isEnrolled ? (
                  <>
                    {userSubmission && (
                      <button
                        onClick={() =>
                          handleDownloadStudentSubmission(userSubmission.id, userSubmission.file_name)
                        }
                        disabled={downloadingSubId === userSubmission.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
                      >
                        <Download className="h-3.5 w-3.5" />
                        {downloadingSubId === userSubmission.id ? 'Loading...' : 'My Submission'}
                      </button>
                    )}
                    <button
                      onClick={() => setActiveSubmitAssignment(assignment)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold text-white transition ${
                        userSubmission
                          ? 'bg-slate-700 hover:bg-slate-800'
                          : 'bg-emerald-600 hover:bg-emerald-700 shadow-xs'
                      }`}
                    >
                      <UploadCloud className="h-3.5 w-3.5" />
                      {userSubmission ? 'Resubmit Work' : 'Submit Assignment'}
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        )
      })}

      {/* Student Submit Modal */}
      {activeSubmitAssignment && (
        <SubmitAssignmentModal
          assignmentId={activeSubmitAssignment.id}
          assignmentTitle={activeSubmitAssignment.title}
          dueDate={activeSubmitAssignment.due_date}
          existingFileName={activeSubmitAssignment.userSubmission?.file_name}
          isOpen={!!activeSubmitAssignment}
          onClose={() => setActiveSubmitAssignment(null)}
        />
      )}

      {/* Teacher Submissions Review Modal */}
      {activeReviewAssignment && (
        <SubmissionsViewModal
          assignment={activeReviewAssignment}
          submissions={activeReviewAssignment.submissions || []}
          isOpen={!!activeReviewAssignment}
          onClose={() => setActiveReviewAssignment(null)}
        />
      )}
    </div>
  )
}
