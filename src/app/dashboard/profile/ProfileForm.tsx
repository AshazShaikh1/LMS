'use client'

import { useState, useTransition } from 'react'
import { updateProfile } from './actions'
import { RoleBadge } from '@/components/dashboard/RoleBadge'
import { Profile } from '@/types'
import { CheckCircle2, AlertCircle, Save, User } from 'lucide-react'

interface ProfileFormProps {
  profile: Profile
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [fullName, setFullName] = useState(profile.full_name || '')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage(null)

    const formData = new FormData()
    formData.append('full_name', fullName)

    startTransition(async () => {
      const res = await updateProfile(formData)
      if (res?.error) {
        setMessage({ type: 'error', text: res.error })
      } else {
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
      }
    })
  }

  const initials = (fullName || profile.email || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  const formattedDate = new Date(profile.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
      {/* Profile Header Avatar */}
      <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 border border-indigo-100 text-lg font-bold text-indigo-700">
          {initials}
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {fullName || 'Academic User'}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-slate-500">{profile.email}</span>
            <span className="text-slate-300">&bull;</span>
            <RoleBadge role={profile.role} />
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`mb-6 flex items-center gap-3 rounded-lg p-3 text-sm border ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="full_name"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Full Name
          </label>
          <div className="relative">
            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. Jane Doe"
            />
          </div>
          <p className="mt-1 text-xs text-slate-400">
            This name will be visible to instructors and classmates across all courses.
          </p>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            disabled
            value={profile.email}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-500 shadow-xs cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-slate-400">
            Email is tied to your login identity and cannot be changed here.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            System Role
          </label>
          <div className="flex items-center gap-3">
            <RoleBadge role={profile.role} />
            <span className="text-xs text-slate-500">
              {profile.role === 'admin'
                ? 'Full administrative control over users, courses, and security.'
                : profile.role === 'teacher'
                ? 'Instructor permissions for course management, materials, and grading.'
                : 'Enrolled learner permissions for viewing materials and submitting assignments.'}
            </span>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Member since {formattedDate}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
