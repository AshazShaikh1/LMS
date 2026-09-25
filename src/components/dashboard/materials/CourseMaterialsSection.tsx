'use client'

import { useState } from 'react'
import { Material } from '@/types'
import { MaterialsList } from './MaterialsList'
import { UploadMaterialModal } from './UploadMaterialModal'
import { FolderArchive, Plus } from 'lucide-react'

interface CourseMaterialsSectionProps {
  courseId: string
  materials: Material[]
  canManage: boolean
  isEnrolled: boolean
}

export function CourseMaterialsSection({
  courseId,
  materials,
  canManage,
  isEnrolled,
}: CourseMaterialsSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FolderArchive className="h-5 w-5 text-indigo-600" />
            Learning Materials &amp; Documents ({materials.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Lecture notes, syllabi, reading packets, and supplementary slides
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            Upload Material
          </button>
        )}
      </div>

      <MaterialsList
        materials={materials}
        canManage={canManage}
        isEnrolled={isEnrolled}
      />

      <UploadMaterialModal
        courseId={courseId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
