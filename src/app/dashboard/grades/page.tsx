import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StudentGradesView } from '@/components/dashboard/grades/StudentGradesView'
import { TeacherGradebookView } from '@/components/dashboard/grades/TeacherGradebookView'

export default async function GradesPage() {
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

  // Student Flow: Fetch enrolled courses, assignments, and student's personal submissions
  if (role === 'student') {
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select(`
        course:courses!enrollments_course_id_fkey(
          id,
          title,
          category,
          teacher:profiles!courses_teacher_id_fkey(id, full_name, email)
        )
      `)
      .eq('student_id', user.id)

    const enrolledCourses = (enrollments || [])
      .map((e: any) => e.course)
      .filter(Boolean)

    const courseIds = enrolledCourses.map((c: any) => c.id)

    let coursesWithGrades: any[] = []

    if (courseIds.length > 0) {
      // Fetch all assignments for these courses
      const { data: assignments } = await supabase
        .from('assignments')
        .select(`
          id,
          course_id,
          title,
          due_date,
          max_marks,
          submissions:submissions(
            id,
            student_id,
            file_name,
            submitted_at,
            marks,
            feedback,
            graded_at
          )
        `)
        .in('course_id', courseIds)
        .order('due_date', { ascending: true })

      coursesWithGrades = enrolledCourses.map((course: any) => {
        const courseAssignments = (assignments || [])
          .filter((a: any) => a.course_id === course.id)
          .map((a: any) => {
            const studentSub = a.submissions?.find((s: any) => s.student_id === user.id) || null
            return {
              id: a.id,
              title: a.title,
              due_date: a.due_date,
              max_marks: a.max_marks,
              submission: studentSub,
            }
          })

        return {
          course,
          assignments: courseAssignments,
        }
      })
    }

    return <StudentGradesView coursesWithGrades={coursesWithGrades} />
  }

  // Teacher / Admin Flow: Fetch courses, enrolled students, assignments, and all submissions for Gradebook
  let teachingCourseQuery = supabase
    .from('courses')
    .select('id, title, category')
    .order('created_at', { ascending: false })

  if (role === 'teacher') {
    teachingCourseQuery = teachingCourseQuery.eq('teacher_id', user.id)
  }

  const { data: courses } = await teachingCourseQuery
  const teacherCourses = courses || []

  let gradebookData: any[] = []

  if (teacherCourses.length > 0) {
    const courseIds = teacherCourses.map((c) => c.id)

    // 1. Fetch enrollments for all courses
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select(`
        course_id,
        student:profiles!enrollments_student_id_fkey(id, full_name, email)
      `)
      .in('course_id', courseIds)

    // 2. Fetch assignments
    const { data: assignments } = await supabase
      .from('assignments')
      .select('id, course_id, title, max_marks, due_date')
      .in('course_id', courseIds)
      .order('due_date', { ascending: true })

    // 3. Fetch submissions
    const assignmentIds = (assignments || []).map((a) => a.id)
    let submissions: any[] = []

    if (assignmentIds.length > 0) {
      const { data: subs } = await supabase
        .from('submissions')
        .select('id, assignment_id, student_id, file_name, submitted_at, marks, feedback, graded_at')
        .in('assignment_id', assignmentIds)

      submissions = subs || []
    }

    gradebookData = teacherCourses.map((course) => {
      const courseStudents = (enrollments || [])
        .filter((e) => e.course_id === course.id && e.student)
        .map((e: any) => e.student)

      const courseAssignments = (assignments || []).filter((a) => a.course_id === course.id)
      const courseSubmissions = submissions.filter((s) =>
        courseAssignments.some((a) => a.id === s.assignment_id)
      )

      return {
        course,
        students: courseStudents,
        assignments: courseAssignments,
        submissions: courseSubmissions,
      }
    })
  }

  return <TeacherGradebookView gradebookData={gradebookData} />
}
