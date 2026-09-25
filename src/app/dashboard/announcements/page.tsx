import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AnnouncementsList } from '@/components/dashboard/announcements/AnnouncementsList'
import { Bell, BookOpen, ArrowRight } from 'lucide-react'

export default async function AnnouncementsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role || 'student'

  // Fetch announcements with course and teacher details
  const { data: announcementsData } = await supabase
    .from('announcements')
    .select(`
      *,
      course:courses!announcements_course_id_fkey(id, title, category, teacher_id),
      teacher:profiles!announcements_teacher_id_fkey(id, full_name, email)
    `)
    .order('created_at', { ascending: false })

  const announcements = announcementsData || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <Bell className="h-7 w-7 text-amber-500" />
            Course Announcements &amp; Noticeboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {role === 'student'
              ? 'Stay updated on schedule changes, syllabus notices, and faculty communications.'
              : 'Institutional noticeboard for class updates, exam notices, and student broadcasts.'}
          </p>
        </div>

        <Link
          href="/dashboard/courses"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition self-start sm:self-auto"
        >
          <BookOpen className="h-4 w-4" />
          Browse Courses
        </Link>
      </div>

      <div className="max-w-4xl">
        <AnnouncementsList
          announcements={announcements}
          canManage={role === 'teacher' || role === 'admin'}
        />
      </div>
    </div>
  )
}
