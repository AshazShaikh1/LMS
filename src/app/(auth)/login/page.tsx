'use client'

import { login } from '@/app/auth/actions'
import Link from 'next/link'
import { useState, useTransition } from 'react'
import { ArrowLeft, Lock, Mail, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        const result = await login(formData)
        if (result?.error) {
          setError(result.error)
        }
      } catch (err: any) {
        if (err?.message !== 'NEXT_REDIRECT') {
          setError(err.message || 'Something went wrong')
        }
      }
    })
  }

  return (
    <div className="flex min-h-screen flex-col justify-center px-4 py-8 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mb-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="flex justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 font-bold text-white shadow-md text-xl">
            L
          </span>
        </div>

        <h2 className="mt-4 text-center text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Sign In to LMS Portal
        </h2>
        <p className="mt-1 text-center text-xs sm:text-sm text-slate-500">
          Enter your institutional credentials to access your courses
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs sm:text-sm text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">
                Institutional Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="student@university.edu"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-base sm:text-sm text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-base sm:text-sm text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-xs hover:bg-indigo-700 transition disabled:opacity-50 min-h-[48px]"
            >
              {isPending ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <p className="text-xs sm:text-sm text-slate-600">
              Don't have a student account?{' '}
              <Link href="/register" className="font-semibold text-indigo-600 hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
