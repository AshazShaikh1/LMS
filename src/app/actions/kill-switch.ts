'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const OWNER_EMAIL = 'ashazshaikh111@gmail.com'

export interface KillSwitchStatus {
  active: boolean
  message: string
  updated_at?: string
  updated_by?: string
}

export async function getKillSwitchStatus(): Promise<KillSwitchStatus> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('system_settings')
      .select('value, updated_at, updated_by')
      .eq('key', 'kill_switch')
      .single()

    if (error || !data) {
      return {
        active: false,
        message: 'System operating normally.',
      }
    }

    return {
      active: !!data.value?.active,
      message: data.value?.message || 'Site is currently undergoing scheduled maintenance.',
      updated_at: data.updated_at,
      updated_by: data.updated_by,
    }
  } catch (err) {
    console.error('Failed to get kill switch status:', err)
    return {
      active: false,
      message: 'System operating normally.',
    }
  }
}

export async function toggleKillSwitch(enabled: boolean, customMessage?: string) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || user.email?.toLowerCase() !== OWNER_EMAIL.toLowerCase()) {
      return {
        error: `Access Denied: Only the owner (${OWNER_EMAIL}) has authority to operate the emergency kill switch.`,
      }
    }

    const value = {
      active: enabled,
      message:
        customMessage ||
        'The academic system is temporarily offline for unscheduled maintenance. Please check back later.',
    }

    const { error } = await supabase
      .from('system_settings')
      .upsert({
        key: 'kill_switch',
        value,
        updated_at: new Date().toISOString(),
        updated_by: user.email,
      })

    if (error) {
      console.error('Database error toggling kill switch:', error)
      return { error: error.message }
    }

    // Bust all Next.js caches so change applies instantly
    revalidatePath('/', 'layout')
    revalidatePath('/dashboard', 'layout')
    revalidatePath('/system-offline', 'page')

    return {
      success: true,
      active: enabled,
    }
  } catch (err: any) {
    return { error: err.message || 'Failed to toggle kill switch' }
  }
}
