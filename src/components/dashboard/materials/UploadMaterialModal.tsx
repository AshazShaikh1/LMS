'use client'

import { useState, useTransition } from 'react'
import { uploadMaterial } from '@/app/dashboard/materials/actions'
import { Upload, X, AlertCircle, FileUp } from 'lucide-react'

interface UploadMaterialModalProps {
  courseId: string
  isOpen: boolean
  onClose: () => void
}

export function UploadMaterialModal({
  courseId,
  isOpen,
  onClose,
}: UploadMaterialModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 25 * 1024 * 1024) {
      setError('File exceeds the 25 MB limit.')
      setSelectedFile(null)
      return
    }

    setError('')
    setSelectedFile(file)
    if (!title) {
      // Auto-populate title with file name without extension
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '')
      setTitle(nameWithoutExt)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedFile) {
      setError('Please choose a file to upload.')
      return
    }

    setError('')
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('file', selectedFile)

    startTransition(async () => {
      const res = await uploadMaterial(courseId, formData)
      if (res?.error) {
        setError(res.error)
      } else {
        setTitle('')
        setDescription('')
        setSelectedFile(null)
        onClose()
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Upload className="h-5 w-5 text-indigo-600" />
            Upload Course Material
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-800 border border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="file" className="block text-xs font-semibold text-slate-700 mb-1">
              Select Document or Slide File <span className="text-red-500">*</span>
            </label>
            <div className="rounded-lg border-2 border-dashed border-slate-200 p-4 text-center hover:border-indigo-400 transition bg-slate-50">
              <input
                id="file"
                type="file"
                required
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="file" className="cursor-pointer flex flex-col items-center">
                <FileUp className="h-8 w-8 text-slate-400 mb-2" />
                <span className="text-xs font-semibold text-indigo-600 hover:underline">
                  {selectedFile ? selectedFile.name : 'Click to select file'}
                </span>
                <span className="text-[11px] text-slate-400 mt-1">
                  PDF, Word, PowerPoint, ZIP, or Text (Max 25 MB)
                </span>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="title" className="block text-xs font-semibold text-slate-700 mb-1">
              Material Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Week 1: Algorithm Complexity Lecture Notes"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-semibold text-slate-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary or reading instructions for students..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="border-t border-slate-100 pt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {isPending ? 'Uploading...' : 'Upload Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
