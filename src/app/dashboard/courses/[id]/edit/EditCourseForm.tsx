'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateCourse, deleteCourse } from '../../actions'
import { Course } from '@/types'
import { ArrowLeft, AlertCircle, Trash2, Save } from 'lucide-react'
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

interface EditCourseFormProps {
  course: Course
}

export function EditCourseForm({ course }: EditCourseFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(course.title)
  const [category, setCategory] = useState(course.category)
  const [description, setDescription] = useState(course.description || '')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const formData = new FormData()
    formData.append('title', title)
    formData.append('category', category)
    formData.append('description', description)

    startTransition(async () => {
      const res = await updateCourse(course.id, formData)
      if (res?.error) {
        setError(res.error)
      } else {
        router.push(`/dashboard/courses/${course.id}`)
      }
    })
  }

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this course? This will remove all enrollments and associated data.')) {
      return
    }

    startDeleteTransition(async () => {
      const res = await deleteCourse(course.id)
      if (res?.error) {
        setError(res.error)
      } else {
        router.push('/dashboard/courses')
      }
    })
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs max-w-3xl">
      <div className="mb-6 border-b border-slate-100 pb-4 flex items-center justify-between">
        <div>
          <Link
            href={`/dashboard/courses/${course.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Course
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Edit Course
          </h1>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting || isPending}
          className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
          {isDeleting ? 'Deleting...' : 'Delete Course'}
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-800 border border-red-200">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-slate-800 mb-1">
            Course Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-slate-800 mb-1">
            Academic Category
          </label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {PRESET_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-slate-800 mb-1">
            Course Description &amp; Syllabus
          </label>
          <textarea
            id="description"
            name="description"
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="border-t border-slate-100 pt-5 flex items-center justify-end gap-3">
          <Link
            href={`/dashboard/courses/${course.id}`}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-700 transition disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
