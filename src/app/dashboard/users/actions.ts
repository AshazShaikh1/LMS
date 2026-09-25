'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { UserRole } from '@/types'

export async function updateUserRole(
  userId: string,
  newRole: UserRole
): Promise<{ error?: string; success?: boolean }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized.' }
    }

    // Verify admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return { error: 'Only administrators have authority to modify user roles.' }
    }

    if (user.id === userId && newRole !== 'admin') {
      return { error: 'You cannot remove your own administrator status.' }
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (updateError) {
      return { error: updateError.message }
    }

    revalidatePath('/dashboard/users')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    console.error('Update role error:', err)
    return { error: err.message || 'Failed to update user role.' }
  }
}

export async function deleteUser(
  userId: string
): Promise<{ error?: string; success?: boolean }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized.' }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return { error: 'Only administrators have permission to delete accounts.' }
    }

    if (user.id === userId) {
      return { error: 'You cannot delete your own administrative account.' }
    }

    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (deleteError) {
      return { error: deleteError.message }
    }

    revalidatePath('/dashboard/users')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    console.error('Delete user error:', err)
    return { error: err.message || 'Failed to delete user.' }
  }
}

export async function reassignCourseInstructor(
  courseId: string,
  newTeacherId: string
): Promise<{ error?: string; success?: boolean }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized.' }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return { error: 'Administrative permission required.' }
    }

    const { error: updateError } = await supabase
      .from('courses')
      .update({
        teacher_id: newTeacherId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', courseId)

    if (updateError) {
      return { error: updateError.message }
    }

    revalidatePath('/dashboard/courses')
    revalidatePath(`/dashboard/courses/${courseId}`)
    return { success: true }
  } catch (err: any) {
    console.error('Reassign instructor error:', err)
    return { error: err.message || 'Failed to reassign course instructor.' }
  }
}
