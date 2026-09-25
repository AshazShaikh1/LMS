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
    let pendingAssignmentsCount = 0
    let averageGrade = '—'

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

      // Fetch assignments to calculate pending assignments
      const { data: courseAssignments } = await supabase
        .from('assignments')
        .select('id, max_marks, due_date')
        .in('course_id', enrolledCourseIds)

      if (courseAssignments && courseAssignments.length > 0) {
        const assignmentIds = courseAssignments.map((a) => a.id)
        const { data: userSubs } = await supabase
          .from('submissions')
          .select('assignment_id, marks')
          .eq('student_id', user.id)
          .in('assignment_id', assignmentIds)

        const submittedIds = new Set((userSubs || []).map((s) => s.assignment_id))
        pendingAssignmentsCount = courseAssignments.filter((a) => !submittedIds.has(a.id)).length

        // Compute average grade
        const gradedSubs = (userSubs || []).filter((s) => s.marks !== null && s.marks !== undefined)
        if (gradedSubs.length > 0) {
          const assignMap = new Map(courseAssignments.map((a) => [a.id, a.max_marks]))
          let earned = 0
          let possible = 0
          gradedSubs.forEach((s) => {
            const max = assignMap.get(s.assignment_id) || 100
            earned += s.marks!
            possible += max
          })
          if (possible > 0) {
            const pct = Math.round((earned / possible) * 100)
            const letter = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'D'
            averageGrade = `${pct}% (${letter})`
          }
        }
      }
    }

    return (
      <StudentDashboard
        profile={profile}
        enrolledCourses={enrolledCourses}
        announcements={announcements}
        pendingAssignmentsCount={pendingAssignmentsCount}
        averageGrade={averageGrade}
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

    // Count pending ungraded submissions across teacher's assignments
    const teacherCourseIds = (teachingCourses || []).map((c) => c.id)
    let pendingGradingCount = 0

    if (teacherCourseIds.length > 0) {
      const { data: teacherAssignments } = await supabase
        .from('assignments')
        .select('id')
        .in('course_id', teacherCourseIds)

      if (teacherAssignments && teacherAssignments.length > 0) {
        const assignIds = teacherAssignments.map((a) => a.id)
        const { count } = await supabase
          .from('submissions')
          .select('*', { count: 'exact', head: true })
          .in('assignment_id', assignIds)
          .is('marks', null)

        pendingGradingCount = count || 0
      }
    }

    // Count published quizzes across teacher's courses
    let activeQuizzesCount = 0
    if (teacherCourseIds.length > 0) {
      const { count: quizCount } = await supabase
        .from('quizzes')
        .select('*', { count: 'exact', head: true })
        .in('course_id', teacherCourseIds)

      activeQuizzesCount = quizCount || 0
    }

    return (
      <TeacherDashboard
        profile={profile}
        teachingCourses={coursesWithCounts}
        pendingSubmissionsCount={pendingGradingCount}
        activeQuizzesCount={activeQuizzesCount}
      />
    )
  }

  // Admin Dashboard: Fetch institutional metrics
  const [{ count: studentCount }, { count: teacherCount }, { count: courseCount }, { data: recentProfiles }] =
    await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'teacher'),
      supabase.from('courses').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(5),
    ])

  return (
    <AdminDashboard
      profile={profile}
      studentCount={studentCount || 0}
      teacherCount={teacherCount || 0}
      courseCount={courseCount || 0}
      recentUsers={recentProfiles || []}
    />
  )
}
