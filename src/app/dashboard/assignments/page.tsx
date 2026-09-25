import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Profile, Assignment, Submission } from '@/types'
import { AssignmentsHubClient } from './AssignmentsHubClient'

export default async function AssignmentsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch current user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const role = profile?.role || 'student'

  let assignments: any[] = []

  if (role === 'student') {
    // 1. Fetch student's enrolled course IDs
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('course_id')
      .eq('student_id', user.id)

    const courseIds = (enrollments || []).map((e) => e.course_id)

    if (courseIds.length > 0) {
      // 2. Fetch assignments for enrolled courses with user's submissions
      const { data: assignmentsData } = await supabase
        .from('assignments')
        .select(`
          *,
          course:courses!assignments_course_id_fkey(id, title, category),
          teacher:profiles!assignments_teacher_id_fkey(id, full_name, email),
          submissions:submissions(
            id,
            assignment_id,
            student_id,
            file_path,
            file_name,
            file_size,
            submitted_at,
            marks,
            feedback
          )
        `)
        .in('course_id', courseIds)
        .order('due_date', { ascending: true })

      assignments = (assignmentsData || []).map((a: any) => ({
        ...a,
        userSubmission: a.submissions?.find((s: any) => s.student_id === user.id) || null,
      }))
    }
  } else if (role === 'teacher') {
    // Teacher: fetch assignments for courses they instruct
    const { data: teachingCourses } = await supabase
      .from('courses')
      .select('id')
      .eq('teacher_id', user.id)

    const courseIds = (teachingCourses || []).map((c) => c.id)

    if (courseIds.length > 0) {
      const { data: assignmentsData } = await supabase
        .from('assignments')
        .select(`
          *,
          course:courses!assignments_course_id_fkey(id, title, category),
          teacher:profiles!assignments_teacher_id_fkey(id, full_name, email),
          submissions:submissions(
            id,
            assignment_id,
            student_id,
            file_path,
            file_name,
            file_size,
            submitted_at,
            marks,
            feedback,
            student:profiles!submissions_student_id_fkey(id, full_name, email)
          )
        `)
        .in('course_id', courseIds)
        .order('due_date', { ascending: true })

      assignments = assignmentsData || []
    }
  } else {
    // Admin: fetch all assignments across the system
    const { data: assignmentsData } = await supabase
      .from('assignments')
      .select(`
        *,
        course:courses!assignments_course_id_fkey(id, title, category),
        teacher:profiles!assignments_teacher_id_fkey(id, full_name, email),
        submissions:submissions(
          id,
          assignment_id,
          student_id,
          file_path,
          file_name,
          file_size,
          submitted_at,
          marks,
          feedback,
          student:profiles!submissions_student_id_fkey(id, full_name, email)
        )
      `)
      .order('due_date', { ascending: true })

    assignments = assignmentsData || []
  }

  return (
    <AssignmentsHubClient
      assignments={assignments}
      role={role}
      currentUserId={user.id}
    />
  )
}
