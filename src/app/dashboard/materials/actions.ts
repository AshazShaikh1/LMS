'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024 // 25 MB

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'image/jpeg',
  'image/png',
  'application/zip',
]

export async function uploadMaterial(
  courseId: string,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const title = (formData.get('title') as string)?.trim()
  const description = (formData.get('description') as string)?.trim() || ''
  const file = formData.get('file') as File | null

  if (!title) {
    return { error: 'Material title is required.' }
  }

  if (!file || file.size === 0) {
    return { error: 'Please select a document or file to upload.' }
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { error: 'File size exceeds the 25 MB academic limit.' }
  }

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'You must be logged in to upload course materials.' }
    }

    // Verify course ownership or admin role
    const { data: course } = await supabase
      .from('courses')
      .select('teacher_id')
      .eq('id', courseId)
      .single()

    if (!course) {
      return { error: 'Target course not found.' }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isInstructor = course.teacher_id === user.id
    const isAdmin = profile?.role === 'admin'

    if (!isInstructor && !isAdmin) {
      return { error: 'Only the course instructor or an administrator can upload materials.' }
    }

    // Sanitize filename
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const storagePath = `${courseId}/${Date.now()}_${sanitizedName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('course-materials')
      .upload(storagePath, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      })

    if (uploadError) {
      return { error: `Storage upload failed: ${uploadError.message}` }
    }

    // Insert database record into public.materials
    const { error: dbError } = await supabase.from('materials').insert({
      course_id: courseId,
      uploaded_by: user.id,
      title,
      description,
      file_path: storagePath,
      file_type: file.type || 'application/octet-stream',
      file_size: file.size,
    })

    if (dbError) {
      // Cleanup storage file on db failure
      await supabase.storage.from('course-materials').remove([storagePath])
      return { error: `Database record creation failed: ${dbError.message}` }
    }

    revalidatePath(`/dashboard/courses/${courseId}`)
    revalidatePath('/dashboard/materials')
    return { success: true }
  } catch (err: any) {
    console.error('Material upload exception:', err)
    return { error: err.message || 'An unexpected error occurred during upload.' }
  }
}

export async function getMaterialDownloadUrl(
  materialId: string
): Promise<{ error?: string; downloadUrl?: string; fileName?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Please log in to access course materials.' }
    }

    // Fetch material and verify enrollment or ownership
    const { data: material, error } = await supabase
      .from('materials')
      .select(`
        *,
        course:courses!materials_course_id_fkey(
          id,
          teacher_id
        )
      `)
      .eq('id', materialId)
      .single()

    if (error || !material) {
      return { error: 'Material not found or access denied.' }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isInstructor = material.course.teacher_id === user.id
    const isAdmin = profile?.role === 'admin'

    if (!isInstructor && !isAdmin) {
      // Check if student is actively enrolled
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('course_id', material.course_id)
        .eq('student_id', user.id)
        .maybeSingle()

      if (!enrollment) {
        return { error: 'You must be enrolled in this course to download its learning materials.' }
      }
    }

    // Generate signed URL valid for 1 hour (3600s)
    const { data: signedData, error: signError } = await supabase.storage
      .from('course-materials')
      .createSignedUrl(material.file_path, 3600, {
        download: material.title,
      })

    if (signError || !signedData?.signedUrl) {
      return { error: 'Failed to generate secure download link.' }
    }

    return { downloadUrl: signedData.signedUrl, fileName: material.title }
  } catch (err: any) {
    console.error('Download URL error:', err)
    return { error: err.message || 'Failed to download file.' }
  }
}

export async function deleteMaterial(
  materialId: string
): Promise<{ error?: string; success?: boolean }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized.' }
    }

    const { data: material } = await supabase
      .from('materials')
      .select('*, course:courses!materials_course_id_fkey(teacher_id)')
      .eq('id', materialId)
      .single()

    if (!material) {
      return { error: 'Material not found.' }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (material.course.teacher_id !== user.id && profile?.role !== 'admin') {
      return { error: 'Permission denied.' }
    }

    // Remove from storage
    await supabase.storage.from('course-materials').remove([material.file_path])

    // Delete from database
    const { error } = await supabase
      .from('materials')
      .delete()
      .eq('id', materialId)

    if (error) {
      return { error: error.message }
    }

    revalidatePath(`/dashboard/courses/${material.course_id}`)
    revalidatePath('/dashboard/materials')
    return { success: true }
  } catch (err: any) {
    console.error('Delete material error:', err)
    return { error: err.message || 'Failed to delete material.' }
  }
}
