'use client'

import { useState } from 'react'
import { Submission, Assignment } from '@/types'
import { gradeSubmission } from '@/app/dashboard/grades/actions'
import { getSubmissionDownloadUrl } from '@/app/dashboard/assignments/actions'
import { X, Award, MessageSquare, Download, CheckCircle2, AlertCircle } from 'lucide-react'

interface GradeSubmissionModalProps {
  submission: Submission & {
    student?: { full_name: string | null; email: string }
    assignment?: Assignment
  }
  maxMarks: number
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function GradeSubmissionModal({
  submission,
  maxMarks,
  isOpen,
  onClose,
  onSuccess,
}: GradeSubmissionModalProps) {
  const [marks, setMarks] = useState<string>(
    submission.marks !== null && submission.marks !== undefined ? submission.marks.toString() : ''
  )
  const [feedback, setFeedback] = useState<string>(submission.feedback || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const handleDownload = async () => {
    setDownloading(true)
    setError(null)
    try {
      const res = await getSubmissionDownloadUrl(submission.id)
      if (res.error) {
        setError(res.error)
      } else if (res.downloadUrl) {
        const a = document.createElement('a')
        a.href = res.downloadUrl
        a.download = res.fileName || submission.file_name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    } catch (err: any) {
      setError(err.message || 'Download failed')
    } finally {
      setDownloading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const numMarks = parseFloat(marks)
    if (isNaN(numMarks) || numMarks < 0) {
      setError('Please provide a valid non-negative mark.')
      return
    }

    if (numMarks > maxMarks) {
      setError(`Marks cannot exceed the maximum of ${maxMarks}.`)
      return
    }

    setIsSubmitting(true)
    try {
      const res = await gradeSubmission(submission.id, Math.round(numMarks), feedback)
      if (res.error) {
        setError(res.error)
      } else {
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
          onSuccess?.()
          onClose()
        }, 1200)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit grade')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {submission.marks !== null ? 'Update Grade' : 'Grade Submission'}
              </h2>
              <p className="text-xs text-slate-500 truncate max-w-[220px]">
                {submission.student?.full_name || submission.student?.email || 'Student'}
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

        {/* Submitted file preview & download button */}
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 flex items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5 truncate">
            <div className="font-semibold text-slate-800 truncate">{submission.file_name}</div>
            <div className="text-[11px] text-slate-400">
              Submitted on {new Date(submission.submitted_at).toLocaleDateString()}
            </div>
          </div>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-semibold text-slate-700 hover:bg-slate-100 transition shrink-0 disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" />
            {downloading ? 'Loading...' : 'Download File'}
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 animate-bounce" />
            <h3 className="text-base font-semibold text-slate-900">Grade & Feedback Saved!</h3>
            <p className="text-xs text-slate-500">Student can now view their evaluation in their gradebook.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Score / Marks (out of {maxMarks}) <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  required
                  min="0"
                  max={maxMarks}
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  placeholder={`0 - ${maxMarks}`}
                  className="w-32 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 focus:border-amber-500 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
                <span className="text-sm font-semibold text-slate-500">/ {maxMarks}</span>
                {marks && !isNaN(parseFloat(marks)) && (
                  <span className="ml-auto text-xs font-bold text-amber-600">
                    {Math.round((parseFloat(marks) / maxMarks) * 100)}%
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                Instructor Feedback & Comments
              </label>
              <textarea
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Constructive feedback, rubric notes, areas of improvement..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
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
                disabled={isSubmitting || marks === ''}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-amber-700 transition disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Publish Grade'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
