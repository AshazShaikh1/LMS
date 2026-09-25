import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { OfflineClient } from './OfflineClient'

export const metadata: Metadata = {
  title: '503 - Service Temporarily Unavailable',
  description: 'The server is temporarily unavailable due to scheduled maintenance or administrative suspension.',
}

const OWNER_EMAIL = 'ashazshaikh111@gmail.com'

export default async function SystemOfflinePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isOwner = user?.email?.toLowerCase() === OWNER_EMAIL.toLowerCase()

  return <OfflineClient isOwner={isOwner} ownerEmail={user?.email || null} />
}
