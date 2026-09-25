'use client'

import { useState, useTransition } from 'react'
import { Announcement } from '@/types'
import { deleteAnnouncement } from '@/app/dashboard/announcements/actions'
import { Bell, Trash2, Calendar, User, AlertCircle } from 'lucide-react'

interface AnnouncementsListProps {
  announcements: Announcement[]
  canManage: boolean
}

export function AnnouncementsList({
  announcements,
  canManage,
}: AnnouncementsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [, startTransition] = useTransition()

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) {
      return
    }

    setDeletingId(id)
    startTransition(async () => {
      const res = await deleteAnnouncement(id)
      if (res?.error) {
        setError(res.error)
      }
      setDeletingId(null)
    })
  }

  if (announcements.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-slate-200 py-10 px-4 text-center">
        <Bell className="mx-auto h-8 w-8 text-slate-300 mb-2" />
        <h4 className="text-xs font-semibold text-slate-700">No announcements published yet</h4>
        <p className="mt-1 text-[11px] text-slate-400 max-w-sm mx-auto">
          {canManage
            ? 'Use the button above to publish notices and semester updates for your enrolled students.'
            : 'Your instructor has not posted any announcements for this course yet.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-2.5 text-xs text-red-800 border border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-3">
        {announcements.map((item) => {
          const isDeleting = deletingId === item.id
          const formattedDate = new Date(item.created_at).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })

          return (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-slate-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-amber-50 p-2 text-amber-600 border border-amber-100 shrink-0 mt-0.5">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 font-medium text-slate-600">
                        <User className="h-3 w-3" />
                        {item.teacher?.full_name || 'Course Instructor'}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formattedDate}
                      </span>
                      {item.course?.title && (
                        <>
                          <span>&bull;</span>
                          <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-semibold text-slate-600">
                            {item.course.title}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {canManage && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={isDeleting}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50 shrink-0"
                    title="Delete Announcement"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="mt-3.5 pl-10 text-xs text-slate-600 leading-relaxed whitespace-pre-line border-t border-slate-50 pt-3">
                {item.content}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
