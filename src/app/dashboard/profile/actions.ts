'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const fullName = (formData.get('full_name') as string)?.trim()

  if (!fullName) {
    return { error: 'Full name cannot be empty.' }
  }

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized.' }
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (error) {
      return { error: error.message }
    }

    // Also update auth user metadata for consistency
    await supabase.auth.updateUser({
      data: { full_name: fullName },
    })

    revalidatePath('/dashboard', 'layout')
    return { success: true }
  } catch (err: any) {
    console.error('Update profile exception:', err)
    return { error: err.message || 'Failed to update profile.' }
  }
}
