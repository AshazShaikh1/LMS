import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { QuizzesHubClient } from './QuizzesHubClient'

export default async function QuizzesPage() {
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
  let quizzes: any[] = []

  if (role === 'student') {
    // 1. Fetch student's enrolled courses
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('course_id')
      .eq('student_id', user.id)

    const courseIds = (enrollments || []).map((e) => e.course_id)

    if (courseIds.length > 0) {
      const { data: quizzesData } = await supabase
        .from('quizzes')
        .select(`
          *,
          course:courses!quizzes_course_id_fkey(id, title, category),
          teacher:profiles!quizzes_teacher_id_fkey(id, full_name, email),
          questions:quiz_questions(
            id,
            question_text,
            options,
            correct_option_index,
            points
          ),
          attempts:quiz_attempts(
            id,
            student_id,
            started_at,
            completed_at,
            score,
            total_points,
            percentage,
            passed,
            answers
          )
        `)
        .in('course_id', courseIds)
        .order('created_at', { ascending: false })

      quizzes = (quizzesData || []).map((q: any) => ({
        ...q,
        userAttempt: q.attempts?.find((att: any) => att.student_id === user.id) || null,
      }))
    }
  } else if (role === 'teacher') {
    const { data: teachingCourses } = await supabase
      .from('courses')
      .select('id')
      .eq('teacher_id', user.id)

    const courseIds = (teachingCourses || []).map((c) => c.id)

    if (courseIds.length > 0) {
      const { data: quizzesData } = await supabase
        .from('quizzes')
        .select(`
          *,
          course:courses!quizzes_course_id_fkey(id, title, category),
          teacher:profiles!quizzes_teacher_id_fkey(id, full_name, email),
          questions:quiz_questions(
            id,
            question_text,
            options,
            correct_option_index,
            points
          ),
          attempts:quiz_attempts(
            id,
            student_id,
            started_at,
            completed_at,
            score,
            total_points,
            percentage,
            passed,
            answers,
            student:profiles!quiz_attempts_student_id_fkey(id, full_name, email)
          )
        `)
        .in('course_id', courseIds)
        .order('created_at', { ascending: false })

      quizzes = quizzesData || []
    }
  } else {
    // Admin
    const { data: quizzesData } = await supabase
      .from('quizzes')
      .select(`
        *,
        course:courses!quizzes_course_id_fkey(id, title, category),
        teacher:profiles!quizzes_teacher_id_fkey(id, full_name, email),
        questions:quiz_questions(
          id,
          question_text,
          options,
          correct_option_index,
          points
        ),
        attempts:quiz_attempts(
          id,
          student_id,
          started_at,
          completed_at,
          score,
          total_points,
          percentage,
          passed,
          answers,
          student:profiles!quiz_attempts_student_id_fkey(id, full_name, email)
        )
      `)
      .order('created_at', { ascending: false })

    quizzes = quizzesData || []
  }

  return <QuizzesHubClient quizzes={quizzes} role={role} />
}
