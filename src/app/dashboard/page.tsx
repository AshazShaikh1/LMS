import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Profile } from '@/types'
import { StudentDashboard } from '@/components/dashboard/StudentDashboard'
import { TeacherDashboard } from '@/components/dashboard/TeacherDashboard'
import { AdminDashboard } from '@/components/dashboard/AdminDashboard'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const profile: Profile = profileData || {
    id: user.id,
    email: user.email || '',
    full_name: user.user_metadata?.full_name || null,
    role: 'student',
    created_at: user.created_at,
    updated_at: user.created_at,
  }

  // If Student: fetch their enrolled courses and relevant announcements
  if (profile.role === 'student') {
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select(`
        course:courses(
          id,
          title,
          description,
          category,
          teacher_id,
          created_at,
          updated_at,
          teacher:profiles!courses_teacher_id_fkey(id, full_name, email)
        )
      `)
      .eq('student_id', user.id)

    const enrolledCourses = (enrollments || [])
      .map((item: any) => item.course)
      .filter(Boolean)

    const enrolledCourseIds = enrolledCourses.map((c: any) => c.id)

    let announcements: any[] = []
    if (enrolledCourseIds.length > 0) {
      const { data: annData } = await supabase
        .from('announcements')
        .select(`
          *,
          teacher:profiles!announcements_teacher_id_fkey(id, full_name, email)
        `)
        .in('course_id', enrolledCourseIds)
        .order('created_at', { ascending: false })
        .limit(5)

      announcements = annData || []
    }

    return (
      <StudentDashboard
        profile={profile}
        enrolledCourses={enrolledCourses}
        announcements={announcements}
      />
    )
  }

  // If Teacher: fetch courses they instruct
  if (profile.role === 'teacher') {
    const { data: teachingCourses } = await supabase
      .from('courses')
      .select(`
        *,
        teacher:profiles!courses_teacher_id_fkey(id, full_name, email)
      `)
      .eq('teacher_id', user.id)
      .order('created_at', { ascending: false })

    // Count enrollments per teaching course
    const { data: allEnrollments } = await supabase
      .from('enrollments')
      .select('course_id')

    const counts = (allEnrollments || []).reduce((acc: Record<string, number>, curr) => {
      acc[curr.course_id] = (acc[curr.course_id] || 0) + 1
      return acc
    }, {})

    const coursesWithCounts = (teachingCourses || []).map((c) => ({
      ...c,
      enrollmentCount: counts[c.id] || 0,
    }))

    return <TeacherDashboard profile={profile} teachingCourses={coursesWithCounts} />
  }

  // Admin Dashboard
  return <AdminDashboard profile={profile} />
}
