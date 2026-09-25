import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { Profile } from '@/types'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile from database
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

  return <DashboardShell profile={profile}>{children}</DashboardShell>
}
