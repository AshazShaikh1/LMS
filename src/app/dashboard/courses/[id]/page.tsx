import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { EnrollButton } from './EnrollButton'
import { CourseMaterialsSection } from '@/components/dashboard/materials/CourseMaterialsSection'
import { CourseAnnouncementsSection } from '@/components/dashboard/announcements/CourseAnnouncementsSection'
import {
  ArrowLeft,
  BookOpen,
  Users,
  Calendar,
  FileText,
  Bell,
  Edit3
} from 'lucide-react'

interface CourseDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch current user profile
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Fetch course details with teacher profile
  const { data: course, error } = await supabase
    .from('courses')
    .select(`
      *,
      teacher:profiles!courses_teacher_id_fkey(id, full_name, email)
    `)
    .eq('id', id)
    .single()

  if (error || !course) {
    notFound()
  }

  // Count total enrollments
  const { count: enrollmentCount } = await supabase
    .from('enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('course_id', id)

  // Check if current user is enrolled
  const { data: userEnrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('course_id', id)
    .eq('student_id', user.id)
    .maybeSingle()

  const isEnrolled = !!userEnrollment
  const isInstructor = course.teacher_id === user.id
  const isAdmin = currentProfile?.role === 'admin'
  const canManage = isInstructor || isAdmin

  // If teacher or admin, fetch enrolled students roster
  let enrolledStudents: any[] = []
  if (canManage) {
    const { data: studentsData } = await supabase
      .from('enrollments')
      .select(`
        id,
        enrolled_at,
        student:profiles!enrollments_student_id_fkey(id, full_name, email)
      `)
      .eq('course_id', id)
      .order('enrolled_at', { ascending: false })

    enrolledStudents = studentsData || []
  }

  // Fetch course learning materials
  const { data: materialsData } = await supabase
    .from('materials')
    .select(`
      *,
      uploader:profiles!materials_uploaded_by_fkey(id, full_name, email)
    `)
    .eq('course_id', id)
    .order('created_at', { ascending: false })

  const materials = materialsData || []

  // Fetch course announcements (Phase 5)
  const { data: announcementsData } = await supabase
    .from('announcements')
    .select(`
      *,
      teacher:profiles!announcements_teacher_id_fkey(id, full_name, email)
    `)
    .eq('course_id', id)
    .order('created_at', { ascending: false })

  const announcements = announcementsData || []

  const formattedDate = new Date(course.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/dashboard/courses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Link>
      </div>

      {/* Course Hero Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100">
                {course.category}
              </span>
              <span className="text-xs text-slate-400">&bull;</span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Users className="h-3.5 w-3.5" />
                {enrollmentCount || 0} Students Enrolled
              </span>
              <span className="text-xs text-slate-400">&bull;</span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Calendar className="h-3.5 w-3.5" />
                Created {formattedDate}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {course.title}
            </h1>

            <div className="flex items-center gap-2 pt-1 text-sm text-slate-600">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                {(course.teacher?.full_name || course.teacher?.email || 'T')[0].toUpperCase()}
              </div>
              <span>
                Instructor:{' '}
                <strong className="text-slate-800">
                  {course.teacher?.full_name || course.teacher?.email || 'Faculty'}
                </strong>
              </span>
              <span className="text-xs text-slate-400">({course.teacher?.email})</span>
            </div>
          </div>

          {/* Action Area */}
          <div className="flex items-center gap-3 shrink-0">
            {canManage ? (
              <Link
                href={`/dashboard/courses/${course.id}/edit`}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition"
              >
                <Edit3 className="h-4 w-4" />
                Edit Course
              </Link>
            ) : (
              <EnrollButton courseId={course.id} isEnrolled={isEnrolled} />
            )}
          </div>
        </div>
      </div>

      {/* Grid: Course Content & Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Syllabus, Announcements, & Learning Materials */}
        <div className="lg:col-span-2 space-y-6">
          {/* Syllabus Section */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              Course Syllabus &amp; Overview
            </h2>
            <div className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {course.description || 'No detailed syllabus has been published for this course yet.'}
            </div>
          </div>

          {/* Integrated Course Announcements Section (Phase 5) */}
          <CourseAnnouncementsSection
            courseId={course.id}
            announcements={announcements}
            canManage={canManage}
            isEnrolled={isEnrolled}
          />

          {/* Integrated Course Materials Section (Phase 4) */}
          <CourseMaterialsSection
            courseId={course.id}
            materials={materials}
            canManage={canManage}
            isEnrolled={isEnrolled}
          />

          {/* Phase 6 Placeholder */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-xs">
            <FileText className="mx-auto h-6 w-6 text-emerald-500 mb-2" />
            <div className="text-sm font-semibold text-slate-800">Assignments Hub</div>
            <p className="text-xs text-slate-400 mt-1">Instructor assignment tasks, deadlines, student submissions &amp; grades</p>
            <span className="mt-3 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600">
              Phase 6
            </span>
          </div>
        </div>

        {/* Right Column: Instructor / Roster View */}
        <div className="space-y-6">
          {canManage ? (
            /* Enrolled Students Roster for Teacher/Admin */
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-400" />
                  Enrolled Students ({enrolledStudents.length})
                </h3>
              </div>

              {enrolledStudents.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No students have enrolled in this course yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {enrolledStudents.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-800">
                          {item.student?.full_name || 'Enrolled Student'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {item.student?.email}
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(item.enrolled_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Student Enrollment Status Card */
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">
                Enrollment Status
              </h3>
              {isEnrolled ? (
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800 space-y-1">
                  <div className="font-semibold">You are actively enrolled</div>
                  <p className="text-emerald-700">
                    You have full access to download lecture materials, receive announcements, and participate in course assignments.
                  </p>
                </div>
              ) : (
                <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-xs text-slate-600 space-y-2">
                  <p>
                    Enroll in this course to receive course announcements, download materials, and participate in assignments.
                  </p>
                  <EnrollButton courseId={course.id} isEnrolled={false} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
