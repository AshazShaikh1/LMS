'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createCourse } from '../actions'
import { BookPlus, ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const PRESET_CATEGORIES = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Engineering',
  'Literature',
  'History',
  'Economics',
  'Business',
  'General',
]

export function CourseForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const res = await createCourse(formData)
      if (res?.error) {
        setError(res.error)
      } else if (res?.courseId) {
        router.push(`/dashboard/courses/${res.courseId}`)
      } else {
        router.push('/dashboard/courses')
      }
    })
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs max-w-3xl">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <Link
          href="/dashboard/courses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <BookPlus className="h-6 w-6 text-indigo-600" />
          Create New Course
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Establish an academic course module, define subject taxonomy, and configure course overview.
        </p>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-800 border border-red-200">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-slate-800 mb-1">
            Course Code &amp; Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="e.g. CS101: Introduction to Algorithms"
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <p className="mt-1 text-xs text-slate-400">
            Include a descriptive academic course code and subject name.
          </p>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-slate-800 mb-1">
            Academic Discipline / Category
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              id="category"
              name="category"
              defaultValue="Computer Science"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {PRESET_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-slate-800 mb-1">
            Course Syllabus &amp; Overview
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            placeholder="Provide learning objectives, prerequisites, and semester syllabus details..."
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="border-t border-slate-100 pt-5 flex items-center justify-end gap-3">
          <Link
            href="/dashboard/courses"
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isPending ? 'Publishing Course...' : 'Publish Course'}
          </button>
        </div>
      </form>
    </div>
  )
}
