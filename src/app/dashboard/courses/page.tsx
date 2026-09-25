import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CoursesClient } from './CoursesClient'

export default async function CoursesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get current user profile for role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role || 'student'

  // Fetch all courses with teacher profile
  const { data: coursesData } = await supabase
    .from('courses')
    .select(`
      *,
      teacher:profiles!courses_teacher_id_fkey(id, full_name, email)
    `)
    .order('created_at', { ascending: false })

  // Fetch all enrollments to count per course
  const { data: enrollmentsData } = await supabase
    .from('enrollments')
    .select('course_id, student_id')

  const enrollmentsByCourse = (enrollmentsData || []).reduce((acc: Record<string, number>, item) => {
    acc[item.course_id] = (acc[item.course_id] || 0) + 1
    return acc
  }, {})

  const userEnrolledIds = (enrollmentsData || [])
    .filter((item) => item.student_id === user.id)
    .map((item) => item.course_id)

  const coursesWithCounts = (coursesData || []).map((course) => ({
    ...course,
    enrollmentCount: enrollmentsByCourse[course.id] || 0,
  }))

  return (
    <CoursesClient
      role={role}
      userId={user.id}
      allCourses={coursesWithCounts}
      enrolledCourseIds={userEnrolledIds}
    />
  )
}
