'use client'

import { useState } from 'react'
import { submitAssignment } from '@/app/dashboard/assignments/actions'
import { X, UploadCloud, FileCheck, CheckCircle2, AlertCircle } from 'lucide-react'

interface SubmitAssignmentModalProps {
  assignmentId: string
  assignmentTitle: string
  dueDate: string
  existingFileName?: string
  isOpen: boolean
  onClose: () => void
}

export function SubmitAssignmentModal({
  assignmentId,
  assignmentTitle,
  dueDate,
  existingFileName,
  isOpen,
  onClose,
}: SubmitAssignmentModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const isPastDue = new Date(dueDate).getTime() < Date.now()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 25 * 1024 * 1024) {
        setError('Selected file exceeds the 25 MB academic limit.')
        setSelectedFile(null)
        return
      }
      setError(null)
      setSelectedFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      setError('Please choose a file to submit.')
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const res = await submitAssignment(assignmentId, formData)

      if (res.error) {
        setError(res.error)
      } else {
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
          setSelectedFile(null)
          onClose()
        }, 1200)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit assignment')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {existingFileName ? 'Resubmit Assignment' : 'Submit Assignment'}
              </h2>
              <p className="text-xs text-slate-500 truncate max-w-[220px]">
                {assignmentTitle}
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

        {isPastDue && (
          <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-xs text-amber-800">
            Note: The deadline has passed. This will be recorded as a late submission.
          </div>
        )}

        {existingFileName && (
          <div className="mt-3 rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-600 flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="truncate">Current submission: <strong>{existingFileName}</strong></span>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 animate-bounce" />
            <h3 className="text-base font-semibold text-slate-900">Work Submitted Successfully!</h3>
            <p className="text-xs text-slate-500">Your instructor can now view and review your work.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="rounded-xl border-2 border-dashed border-slate-200 p-6 text-center hover:border-emerald-400 transition bg-slate-50/50">
              <UploadCloud className="mx-auto h-8 w-8 text-slate-400" />
              <label
                htmlFor="submission-file"
                className="mt-2 block text-xs font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
              >
                Choose file to upload
              </label>
              <input
                id="submission-file"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                PDF, DOCX, ZIP, or Code archives (Max 25 MB)
              </p>
              {selectedFile && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
                  <FileCheck className="h-3.5 w-3.5" />
                  <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                  <span className="text-[10px] text-emerald-600">
                    ({(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)
                  </span>
                </div>
              )}
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
                disabled={isSubmitting || !selectedFile}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition disabled:opacity-50"
              >
                {isSubmitting ? 'Uploading...' : existingFileName ? 'Update Submission' : 'Submit Assignment'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
