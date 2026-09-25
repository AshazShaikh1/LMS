import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getKillSwitchStatus } from '@/app/actions/kill-switch'
import { SystemControlClient } from './SystemControlClient'

export const metadata: Metadata = {
  title: 'Master System Control - Owner Clearance',
  description: 'Emergency kill switch control console for project owner.',
}

const OWNER_EMAIL = 'ashazshaikh111@gmail.com'

export default async function SystemControlPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isOwner = user?.email?.toLowerCase() === OWNER_EMAIL.toLowerCase()
  const initialStatus = await getKillSwitchStatus()

  return (
    <SystemControlClient
      isOwner={isOwner}
      currentEmail={user?.email || null}
      initialStatus={initialStatus}
    />
  )
}
