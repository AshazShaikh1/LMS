'use client'

import { useState, useTransition } from 'react'
import { createAnnouncement } from '@/app/dashboard/announcements/actions'
import { Bell, X, AlertCircle, Send } from 'lucide-react'

interface CreateAnnouncementModalProps {
  courseId: string
  isOpen: boolean
  onClose: () => void
}

export function CreateAnnouncementModal({
  courseId,
  isOpen,
  onClose,
}: CreateAnnouncementModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    const formData = new FormData()
    formData.append('title', title)
    formData.append('content', content)

    startTransition(async () => {
      const res = await createAnnouncement(courseId, formData)
      if (res?.error) {
        setError(res.error)
      } else {
        setTitle('')
        setContent('')
        onClose()
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Bell className="h-5 w-5 text-amber-500" />
            Publish Course Announcement
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-800 border border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-xs font-semibold text-slate-700 mb-1">
              Announcement Subject / Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Midterm Examination Schedule & Format"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-xs font-semibold text-slate-700 mb-1">
              Message Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              rows={5}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write detailed announcements, syllabus updates, or room change notices..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="border-t border-slate-100 pt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-amber-700 transition disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              {isPending ? 'Publishing...' : 'Publish Announcement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
