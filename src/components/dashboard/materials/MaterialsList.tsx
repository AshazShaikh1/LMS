'use client'

import { useState, useTransition } from 'react'
import { Material } from '@/types'
import { getMaterialDownloadUrl, deleteMaterial } from '@/app/dashboard/materials/actions'
import {
  FileText,
  FileSpreadsheet,
  FileCode,
  FileArchive,
  File,
  Download,
  Trash2,
  Calendar,
  User,
  AlertCircle
} from 'lucide-react'

interface MaterialsListProps {
  materials: Material[]
  canManage: boolean
  isEnrolled: boolean
}

export function MaterialsList({
  materials,
  canManage,
  isEnrolled,
}: MaterialsListProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [, startTransition] = useTransition()

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileIcon = (fileType: string | null) => {
    if (!fileType) return File
    if (fileType.includes('pdf')) return FileText
    if (fileType.includes('word') || fileType.includes('document')) return FileText
    if (fileType.includes('sheet') || fileType.includes('excel')) return FileSpreadsheet
    if (fileType.includes('zip') || fileType.includes('tar') || fileType.includes('rar')) return FileArchive
    if (fileType.includes('text') || fileType.includes('code')) return FileCode
    return File
  }

  const handleDownload = async (materialId: string, title: string) => {
    setError('')
    setDownloadingId(materialId)

    try {
      const res = await getMaterialDownloadUrl(materialId)
      if (res?.error) {
        setError(res.error)
      } else if (res?.downloadUrl) {
        // Trigger browser download via dynamic link
        const a = document.createElement('a')
        a.href = res.downloadUrl
        a.download = res.fileName || title
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    } catch (err: any) {
      setError(err.message || 'Download failed.')
    } finally {
      setDownloadingId(null)
    }
  }

  const handleDelete = (materialId: string) => {
    if (!confirm('Are you sure you want to permanently delete this material?')) {
      return
    }

    setDeletingId(materialId)
    startTransition(async () => {
      const res = await deleteMaterial(materialId)
      if (res?.error) {
        setError(res.error)
      }
      setDeletingId(null)
    })
  }

  if (materials.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-slate-200 py-10 px-4 text-center">
        <FileText className="mx-auto h-8 w-8 text-slate-300 mb-2" />
        <h4 className="text-xs font-semibold text-slate-700">No learning materials uploaded yet</h4>
        <p className="mt-1 text-[11px] text-slate-400 max-w-sm mx-auto">
          {canManage
            ? 'Use the Upload Material button above to post lecture notes, slides, and syllabus files for students.'
            : 'Your instructor has not uploaded any learning materials for this course yet.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-2.5 text-xs text-red-800 border border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        {materials.map((item) => {
          const Icon = getFileIcon(item.file_type)
          const isDownloading = downloadingId === item.id
          const isDeleting = deletingId === item.id

          return (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 hover:bg-slate-50 transition"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600 border border-indigo-100 shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="mt-1 text-xs text-slate-500">
                      {item.description}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                    <span className="font-medium text-slate-600">
                      {formatFileSize(item.file_size)}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    {item.uploader && (
                      <>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {item.uploader.full_name || 'Instructor'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {isEnrolled || canManage ? (
                  <button
                    onClick={() => handleDownload(item.id, item.title)}
                    disabled={isDownloading}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition disabled:opacity-50"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>{isDownloading ? 'Preparing...' : 'Download'}</span>
                  </button>
                ) : (
                  <span className="text-[11px] font-medium text-slate-400 italic">
                    Enroll to access
                  </span>
                )}

                {canManage && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={isDeleting}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50"
                    title="Delete Material"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
