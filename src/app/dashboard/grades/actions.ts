'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function gradeSubmission(
  submissionId: string,
  marks: number,
  feedback: string
): Promise<{ error?: string; success?: boolean }> {
  if (isNaN(marks) || marks < 0) {
    return { error: 'Marks must be a non-negative number.' }
  }

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'You must be logged in to grade submissions.' }
    }

    // Verify submission exists and fetch assignment max_marks & course teacher_id
    const { data: submission, error: subError } = await supabase
      .from('submissions')
      .select(`
        id,
        assignment_id,
        student_id,
        assignment:assignments!submissions_assignment_id_fkey(
          id,
          max_marks,
          course_id,
          course:courses!assignments_course_id_fkey(
            teacher_id
          )
        )
      `)
      .eq('id', submissionId)
      .single()

    if (subError || !submission) {
      return { error: 'Submission not found.' }
    }

    const assignment = submission.assignment as any
    if (!assignment) {
      return { error: 'Associated assignment not found.' }
    }

    if (marks > assignment.max_marks) {
      return { error: `Marks cannot exceed the maximum of ${assignment.max_marks}.` }
    }

    // Check permission: must be course instructor or admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const courseTeacherId = Array.isArray(assignment.course)
      ? assignment.course[0]?.teacher_id
      : assignment.course?.teacher_id

    const isInstructor = courseTeacherId === user.id
    const isAdmin = profile?.role === 'admin'

    if (!isInstructor && !isAdmin) {
      return { error: 'Only the course instructor or an administrator can grade submissions.' }
    }

    // Update submission record with marks, feedback, and graded metadata
    const { error: updateError } = await supabase
      .from('submissions')
      .update({
        marks,
        feedback: feedback?.trim() || null,
        graded_at: new Date().toISOString(),
        graded_by: user.id,
      })
      .eq('id', submissionId)

    if (updateError) {
      return { error: `Failed to record grade: ${updateError.message}` }
    }

    revalidatePath(`/dashboard/courses/${assignment.course_id}`)
    revalidatePath('/dashboard/assignments')
    revalidatePath('/dashboard/grades')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    console.error('Grade submission error:', err)
    return { error: err.message || 'An unexpected error occurred while grading.' }
  }
}
