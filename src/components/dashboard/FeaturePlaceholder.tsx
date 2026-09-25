import Link from 'next/link'
import { ArrowLeft, Clock } from 'lucide-react'

interface FeaturePlaceholderProps {
  title: string
  description: string
  phaseNumber: number
}

export function FeaturePlaceholder({
  title,
  description,
  phaseNumber,
}: FeaturePlaceholderProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-xs">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mb-4">
        <Clock className="h-6 w-6" />
      </div>
      <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 mb-3">
        Phase {phaseNumber} Roadmap Feature
      </div>
      <h2 className="text-xl font-bold tracking-tight text-slate-900">
        {title}
      </h2>
      <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
        {description}
      </p>
      <div className="mt-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 shadow-xs hover:bg-slate-50 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
