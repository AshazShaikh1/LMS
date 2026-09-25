'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createAnnouncement(
  courseId: string,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const title = (formData.get('title') as string)?.trim()
  const content = (formData.get('content') as string)?.trim()

  if (!title) {
    return { error: 'Announcement title is required.' }
  }

  if (!content) {
    return { error: 'Announcement content cannot be empty.' }
  }

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'You must be logged in to post an announcement.' }
    }

    // Verify course ownership or admin role
    const { data: course } = await supabase
      .from('courses')
      .select('teacher_id')
      .eq('id', courseId)
      .single()

    if (!course) {
      return { error: 'Course not found.' }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isInstructor = course.teacher_id === user.id
    const isAdmin = profile?.role === 'admin'

    if (!isInstructor && !isAdmin) {
      return { error: 'Only the course instructor or an administrator can publish announcements.' }
    }

    const { error: dbError } = await supabase.from('announcements').insert({
      course_id: courseId,
      teacher_id: user.id,
      title,
      content,
    })

    if (dbError) {
      return { error: dbError.message }
    }

    revalidatePath('/dashboard', 'layout')
    revalidatePath('/dashboard/announcements')
    revalidatePath(`/dashboard/courses/${courseId}`)
    return { success: true }
  } catch (err: any) {
    console.error('Create announcement error:', err)
    return { error: err.message || 'An unexpected error occurred.' }
  }
}

export async function deleteAnnouncement(
  announcementId: string
): Promise<{ error?: string; success?: boolean }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized.' }
    }

    const { data: announcement } = await supabase
      .from('announcements')
      .select('course_id, teacher_id')
      .eq('id', announcementId)
      .single()

    if (!announcement) {
      return { error: 'Announcement not found.' }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (announcement.teacher_id !== user.id && profile?.role !== 'admin') {
      return { error: 'Permission denied.' }
    }

    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', announcementId)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/dashboard', 'layout')
    revalidatePath('/dashboard/announcements')
    revalidatePath(`/dashboard/courses/${announcement.course_id}`)
    return { success: true }
  } catch (err: any) {
    console.error('Delete announcement error:', err)
    return { error: err.message || 'Failed to delete announcement.' }
  }
}
