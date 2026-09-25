import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from './ProfileForm'
import { Profile } from '@/types'

export default async function ProfilePage() {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Account Profile
        </h1>
        <p className="text-sm text-slate-500">
          Manage your personal information, role status, and account credentials.
        </p>
      </div>

      <div className="max-w-2xl">
        <ProfileForm profile={profile} />
      </div>
    </div>
  )
}
