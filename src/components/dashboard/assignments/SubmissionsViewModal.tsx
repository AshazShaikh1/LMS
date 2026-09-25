'use client'

import { useState } from 'react'
import { Submission, Assignment } from '@/types'
import { getSubmissionDownloadUrl } from '@/app/dashboard/assignments/actions'
import { X, Users, Download, Clock, AlertTriangle, FileText, CheckCircle } from 'lucide-react'

interface SubmissionsViewModalProps {
  assignment: Assignment
  submissions: Submission[]
  isOpen: boolean
  onClose: () => void
}

export function SubmissionsViewModal({
  assignment,
  submissions,
  isOpen,
  onClose,
}: SubmissionsViewModalProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  if (!isOpen) return null

  const dueDate = new Date(assignment.due_date)

  const handleDownload = async (subId: string, fallbackName: string) => {
    setDownloadingId(subId)
    setDownloadError(null)

    try {
      const res = await getSubmissionDownloadUrl(subId)
      if (res.error) {
        setDownloadError(res.error)
      } else if (res.downloadUrl) {
        const a = document.createElement('a')
        a.href = res.downloadUrl
        a.download = res.fileName || fallbackName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    } catch (err: any) {
      setDownloadError(err.message || 'Download failed')
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl border border-slate-100 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Student Submissions</h2>
              <p className="text-xs text-slate-500 truncate max-w-md">
                {assignment.title} &bull; Max Marks: {assignment.max_marks}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {downloadError && (
          <div className="mt-3 rounded-lg bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-700">
            {downloadError}
          </div>
        )}

        {/* Submissions list */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1">
          {submissions.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <FileText className="mx-auto h-8 w-8 text-slate-300 mb-2" />
              <p className="text-sm font-medium text-slate-700">No submissions yet</p>
              <p className="text-xs text-slate-400">
                Enrolled students have not submitted work for this assignment yet.
              </p>
            </div>
          ) : (
            submissions.map((sub) => {
              const submittedDate = new Date(sub.submitted_at)
              const isLate = submittedDate.getTime() > dueDate.getTime()

              return (
                <div
                  key={sub.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition hover:bg-white hover:shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">
                          {sub.student?.full_name || 'Student'}
                        </span>
                        <span className="text-xs text-slate-400">
                          ({sub.student?.email})
                        </span>
                        {isLate ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200">
                            <Clock className="h-3 w-3" /> Late
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                            <CheckCircle className="h-3 w-3" /> On Time
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span className="font-mono text-slate-700">{sub.file_name}</span>
                        {sub.file_size && (
                          <span className="text-slate-400">
                            ({(sub.file_size / (1024 * 1024)).toFixed(2)} MB)
                          </span>
                        )}
                        <span>&bull;</span>
                        <span>
                          Submitted {submittedDate.toLocaleDateString()} at{' '}
                          {submittedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownload(sub.id, sub.file_name)}
                      disabled={downloadingId === sub.id}
                      className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg bg-indigo-50 border border-indigo-200 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition disabled:opacity-50"
                    >
                      <Download className="h-3.5 w-3.5" />
                      {downloadingId === sub.id ? 'Loading...' : 'Download File'}
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
          <span>Total Received: {submissions.length}</span>
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
