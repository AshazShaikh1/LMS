'use client'

import { useState, useTransition } from 'react'
import { enrollInCourse, unenrollFromCourse } from '../actions'
import { Check, UserPlus, UserMinus, AlertCircle } from 'lucide-react'

interface EnrollButtonProps {
  courseId: string
  isEnrolled: boolean
}

export function EnrollButton({ courseId, isEnrolled }: EnrollButtonProps) {
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleEnroll = () => {
    setError('')
    startTransition(async () => {
      const res = await enrollInCourse(courseId)
      if (res?.error) {
        setError(res.error)
      }
    })
  }

  const handleUnenroll = () => {
    if (!confirm('Are you sure you want to unenroll from this course?')) {
      return
    }
    setError('')
    startTransition(async () => {
      const res = await unenrollFromCourse(courseId)
      if (res?.error) {
        setError(res.error)
      }
    })
  }

  return (
    <div className="flex flex-col items-end gap-1">
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>{error}</span>
        </div>
      )}

      {isEnrolled ? (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <Check className="h-3.5 w-3.5" />
            Enrolled
          </span>
          <button
            onClick={handleUnenroll}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition disabled:opacity-50"
          >
            <UserMinus className="h-3.5 w-3.5" />
            {isPending ? 'Updating...' : 'Unenroll'}
          </button>
        </div>
      ) : (
        <button
          onClick={handleEnroll}
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-700 transition disabled:opacity-50"
        >
          <UserPlus className="h-4 w-4" />
          {isPending ? 'Enrolling...' : 'Enroll Now'}
        </button>
      )}
    </div>
  )
}
