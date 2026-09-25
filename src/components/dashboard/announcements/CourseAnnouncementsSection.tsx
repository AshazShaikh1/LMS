'use client'

import { useState } from 'react'
import { Announcement } from '@/types'
import { AnnouncementsList } from './AnnouncementsList'
import { CreateAnnouncementModal } from './CreateAnnouncementModal'
import { Bell, Plus } from 'lucide-react'

interface CourseAnnouncementsSectionProps {
  courseId: string
  announcements: Announcement[]
  canManage: boolean
  isEnrolled: boolean
}

export function CourseAnnouncementsSection({
  courseId,
  announcements,
  canManage,
  isEnrolled,
}: CourseAnnouncementsSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Bell className="h-5 w-5 text-amber-500" />
            Course Announcements ({announcements.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Important updates, deadline reminders, and lecture scheduling notices
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-amber-700 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            New Announcement
          </button>
        )}
      </div>

      <AnnouncementsList
        announcements={announcements}
        canManage={canManage}
      />

      <CreateAnnouncementModal
        courseId={courseId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
