import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { MaterialsList } from '@/components/dashboard/materials/MaterialsList'
import { FolderArchive, BookOpen, ArrowRight } from 'lucide-react'

export default async function MaterialsPage() {
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

  // Fetch materials with course and uploader info
  let query = supabase
    .from('materials')
    .select(`
      *,
      course:courses!materials_course_id_fkey(id, title, category, teacher_id),
      uploader:profiles!materials_uploaded_by_fkey(id, full_name, email)
    `)
    .order('created_at', { ascending: false })

  const { data: allMaterials } = await query

  // Group materials by course
  const materialsByCourse = (allMaterials || []).reduce((acc: Record<string, any>, item: any) => {
    const courseId = item.course_id
    if (!acc[courseId]) {
      acc[courseId] = {
        course: item.course,
        items: [],
      }
    }
    acc[courseId].items.push(item)
    return acc
  }, {})

  const courseGroups = Object.values(materialsByCourse)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <FolderArchive className="h-7 w-7 text-indigo-600" />
            Learning Materials Repository
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {role === 'student'
              ? 'Access and download lecture slides, syllabi, and reading notes for your courses.'
              : 'Central repository of instructional documents, lecture decks, and course handouts.'}
          </p>
        </div>

        <Link
          href="/dashboard/courses"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition self-start sm:self-auto"
        >
          <BookOpen className="h-4 w-4" />
          Browse Courses
        </Link>
      </div>

      {courseGroups.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white p-12 text-center shadow-xs">
          <FolderArchive className="mx-auto h-10 w-10 text-slate-300 mb-3" />
          <h3 className="text-sm font-semibold text-slate-800">
            No materials uploaded yet
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            {role === 'teacher'
              ? 'Open any of your courses to upload syllabi, presentations, and lecture readings.'
              : 'Materials uploaded by your instructors for enrolled courses will appear here.'}
          </p>
          <Link
            href="/dashboard/courses"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition"
          >
            Go to Courses &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {courseGroups.map((group: any) => (
            <div
              key={group.course?.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {group.course?.category || 'Academic'}
                  </span>
                  <h2 className="text-base font-bold text-slate-900 mt-1">
                    {group.course?.title}
                  </h2>
                </div>
                <Link
                  href={`/dashboard/courses/${group.course?.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  <span>Course Hub</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <MaterialsList
                materials={group.items}
                canManage={role === 'teacher' || role === 'admin'}
                isEnrolled={true}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
