'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024 // 25 MB

export async function createAssignment(
  courseId: string,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const title = (formData.get('title') as string)?.trim()
  const description = (formData.get('description') as string)?.trim() || ''
  const dueDateStr = formData.get('due_date') as string
  const maxMarksStr = formData.get('max_marks') as string

  if (!title) {
    return { error: 'Assignment title is required.' }
  }

  if (!dueDateStr) {
    return { error: 'Submission deadline is required.' }
  }

  const dueDate = new Date(dueDateStr)
  if (isNaN(dueDate.getTime())) {
    return { error: 'Invalid due date format.' }
  }

  const maxMarks = parseInt(maxMarksStr || '100', 10)
  if (isNaN(maxMarks) || maxMarks <= 0) {
    return { error: 'Maximum marks must be a positive integer.' }
  }

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'You must be logged in to create assignments.' }
    }

    // Verify course ownership or admin role
    const { data: course } = await supabase
      .from('courses')
      .select('teacher_id')
      .eq('id', courseId)
      .single()

    if (!course) {
      return { error: 'Target course not found.' }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isInstructor = course.teacher_id === user.id
    const isAdmin = profile?.role === 'admin'

    if (!isInstructor && !isAdmin) {
      return { error: 'Only the course instructor or an administrator can publish assignments.' }
    }

    const { error: insertError } = await supabase.from('assignments').insert({
      course_id: courseId,
      teacher_id: user.id,
      title,
      description,
      due_date: dueDate.toISOString(),
      max_marks: maxMarks,
    })

    if (insertError) {
      return { error: `Failed to create assignment: ${insertError.message}` }
    }

    revalidatePath(`/dashboard/courses/${courseId}`)
    revalidatePath('/dashboard/assignments')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    console.error('Assignment creation error:', err)
    return { error: err.message || 'An unexpected error occurred.' }
  }
}

export async function submitAssignment(
  assignmentId: string,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const file = formData.get('file') as File | null

  if (!file || file.size === 0) {
    return { error: 'Please select a file to submit.' }
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { error: 'Submission file size exceeds the 25 MB limit.' }
  }

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'You must be logged in to submit assignments.' }
    }

    // Verify assignment exists and student is enrolled in the course
    const { data: assignment, error: assignmentError } = await supabase
      .from('assignments')
      .select('id, course_id, due_date')
      .eq('id', assignmentId)
      .single()

    if (assignmentError || !assignment) {
      return { error: 'Assignment not found.' }
    }

    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('course_id', assignment.course_id)
      .eq('student_id', user.id)
      .maybeSingle()

    if (!enrollment) {
      return { error: 'You must be enrolled in this course to submit assignments.' }
    }

    // Check if an existing submission exists to clean old file
    const { data: existingSubmission } = await supabase
      .from('submissions')
      .select('id, file_path')
      .eq('assignment_id', assignmentId)
      .eq('student_id', user.id)
      .maybeSingle()

    // Sanitize file name and construct storage path
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const storagePath = `${assignmentId}/${user.id}_${Date.now()}_${sanitizedName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage bucket 'assignment-submissions'
    const { error: uploadError } = await supabase.storage
      .from('assignment-submissions')
      .upload(storagePath, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      })

    if (uploadError) {
      return { error: `Storage upload failed: ${uploadError.message}` }
    }

    // Insert or update submissions table
    if (existingSubmission) {
      // Clean up previous file
      if (existingSubmission.file_path) {
        await supabase.storage.from('assignment-submissions').remove([existingSubmission.file_path])
      }

      const { error: updateError } = await supabase
        .from('submissions')
        .update({
          file_path: storagePath,
          file_name: file.name,
          file_size: file.size,
          submitted_at: new Date().toISOString(),
        })
        .eq('id', existingSubmission.id)

      if (updateError) {
        await supabase.storage.from('assignment-submissions').remove([storagePath])
        return { error: `Submission update failed: ${updateError.message}` }
      }
    } else {
      const { error: insertError } = await supabase.from('submissions').insert({
        assignment_id: assignmentId,
        student_id: user.id,
        file_path: storagePath,
        file_name: file.name,
        file_size: file.size,
      })

      if (insertError) {
        await supabase.storage.from('assignment-submissions').remove([storagePath])
        return { error: `Submission save failed: ${insertError.message}` }
      }
    }

    revalidatePath(`/dashboard/courses/${assignment.course_id}`)
    revalidatePath('/dashboard/assignments')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    console.error('Assignment submission error:', err)
    return { error: err.message || 'An unexpected error occurred during submission.' }
  }
}

export async function getSubmissionDownloadUrl(
  submissionId: string
): Promise<{ error?: string; downloadUrl?: string; fileName?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Please log in to download submissions.' }
    }

    // Fetch submission with assignment and course details
    const { data: submission, error: subError } = await supabase
      .from('submissions')
      .select(`
        *,
        assignment:assignments!submissions_assignment_id_fkey(
          id,
          course_id,
          course:courses!assignments_course_id_fkey(
            teacher_id
          )
        )
      `)
      .eq('id', submissionId)
      .single()

    if (subError || !submission) {
      return { error: 'Submission not found or access denied.' }
    }

    const isStudentOwner = submission.student_id === user.id
    const isTeacher = submission.assignment?.course?.teacher_id === user.id

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'

    if (!isStudentOwner && !isTeacher && !isAdmin) {
      return { error: 'You are not authorized to view or download this submission.' }
    }

    // Generate signed download URL (1 hour)
    const { data: signedData, error: signError } = await supabase.storage
      .from('assignment-submissions')
      .createSignedUrl(submission.file_path, 3600, {
        download: submission.file_name,
      })

    if (signError || !signedData?.signedUrl) {
      return { error: 'Failed to generate secure download link.' }
    }

    return { downloadUrl: signedData.signedUrl, fileName: submission.file_name }
  } catch (err: any) {
    console.error('Submission download URL error:', err)
    return { error: err.message || 'Failed to download submission.' }
  }
}

export async function deleteAssignment(
  assignmentId: string
): Promise<{ error?: string; success?: boolean }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized.' }
    }

    const { data: assignment } = await supabase
      .from('assignments')
      .select('course_id, teacher_id, course:courses!assignments_course_id_fkey(teacher_id)')
      .eq('id', assignmentId)
      .single()

    if (!assignment) {
      return { error: 'Assignment not found.' }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const courseTeacher = Array.isArray(assignment.course)
      ? (assignment.course[0] as any)?.teacher_id
      : (assignment.course as any)?.teacher_id
    const isInstructor = courseTeacher === user.id || assignment.teacher_id === user.id
    const isAdmin = profile?.role === 'admin'

    if (!isInstructor && !isAdmin) {
      return { error: 'Permission denied.' }
    }

    // Fetch all submissions to remove files from storage
    const { data: submissions } = await supabase
      .from('submissions')
      .select('file_path')
      .eq('assignment_id', assignmentId)

    if (submissions && submissions.length > 0) {
      const paths = submissions.map((s) => s.file_path).filter(Boolean)
      if (paths.length > 0) {
        await supabase.storage.from('assignment-submissions').remove(paths)
      }
    }

    // Delete assignment row (cascades to submissions)
    const { error: deleteError } = await supabase
      .from('assignments')
      .delete()
      .eq('id', assignmentId)

    if (deleteError) {
      return { error: deleteError.message }
    }

    revalidatePath(`/dashboard/courses/${assignment.course_id}`)
    revalidatePath('/dashboard/assignments')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    console.error('Delete assignment error:', err)
    return { error: err.message || 'Failed to delete assignment.' }
  }
}
