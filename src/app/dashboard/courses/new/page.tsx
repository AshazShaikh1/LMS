import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CourseForm } from './CourseForm'

export default async function NewCoursePage() {
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

  if (!profile || (profile.role !== 'teacher' && profile.role !== 'admin')) {
    redirect('/dashboard/courses')
  }

  return (
    <div className="py-2">
      <CourseForm />
    </div>
  )
}
