'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCourse(formData: FormData): Promise<{ error?: string; courseId?: string }> {
  const title = (formData.get('title') as string)?.trim()
  const description = (formData.get('description') as string)?.trim() || ''
  const category = (formData.get('category') as string)?.trim() || 'General'

  if (!title) {
    return { error: 'Course title is required.' }
  }

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'You must be logged in to create a course.' }
    }

    // Verify role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || (profile.role !== 'teacher' && profile.role !== 'admin')) {
      return { error: 'Only teachers and administrators can create courses.' }
    }

    const { data, error } = await supabase
      .from('courses')
      .insert({
        title,
        description,
        category,
        teacher_id: user.id,
      })
      .select('id')
      .single()

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/dashboard', 'layout')
    revalidatePath('/dashboard/courses')
    return { courseId: data.id }
  } catch (err: any) {
    console.error('Create course error:', err)
    return { error: err.message || 'An unexpected error occurred while creating the course.' }
  }
}

export async function updateCourse(
  courseId: string,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const title = (formData.get('title') as string)?.trim()
  const description = (formData.get('description') as string)?.trim() || ''
  const category = (formData.get('category') as string)?.trim() || 'General'

  if (!title) {
    return { error: 'Course title is required.' }
  }

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized.' }
    }

    // Fetch course to verify ownership or admin
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

    if (course.teacher_id !== user.id && profile?.role !== 'admin') {
      return { error: 'You do not have permission to modify this course.' }
    }

    const { error } = await supabase
      .from('courses')
      .update({
        title,
        description,
        category,
        updated_at: new Date().toISOString(),
      })
      .eq('id', courseId)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/dashboard', 'layout')
    revalidatePath('/dashboard/courses')
    revalidatePath(`/dashboard/courses/${courseId}`)
    return { success: true }
  } catch (err: any) {
    console.error('Update course error:', err)
    return { error: err.message || 'An unexpected error occurred.' }
  }
}

export async function deleteCourse(courseId: string): Promise<{ error?: string; success?: boolean }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized.' }
    }

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/dashboard', 'layout')
    revalidatePath('/dashboard/courses')
    return { success: true }
  } catch (err: any) {
    console.error('Delete course error:', err)
    return { error: err.message || 'Failed to delete course.' }
  }
}

export async function enrollInCourse(courseId: string): Promise<{ error?: string; success?: boolean }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Please log in to enroll in courses.' }
    }

    // Insert enrollment
    const { error } = await supabase
      .from('enrollments')
      .insert({
        course_id: courseId,
        student_id: user.id,
      })

    if (error) {
      if (error.code === '23505') {
        return { error: 'You are already enrolled in this course.' }
      }
      return { error: error.message }
    }

    revalidatePath('/dashboard', 'layout')
    revalidatePath('/dashboard/courses')
    revalidatePath(`/dashboard/courses/${courseId}`)
    return { success: true }
  } catch (err: any) {
    console.error('Enrollment error:', err)
    return { error: err.message || 'Failed to enroll in course.' }
  }
}

export async function unenrollFromCourse(courseId: string): Promise<{ error?: string; success?: boolean }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized.' }
    }

    const { error } = await supabase
      .from('enrollments')
      .delete()
      .eq('course_id', courseId)
      .eq('student_id', user.id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/dashboard', 'layout')
    revalidatePath('/dashboard/courses')
    revalidatePath(`/dashboard/courses/${courseId}`)
    return { success: true }
  } catch (err: any) {
    console.error('Unenroll error:', err)
    return { error: err.message || 'Failed to unenroll.' }
  }
}
