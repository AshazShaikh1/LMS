'use client'

import { register } from '@/app/auth/actions'
import Link from 'next/link'
import { useState, useTransition } from 'react'

export default function RegisterPage() {
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        const result = await register(formData)
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
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col space-y-4 border p-6 rounded-md shadow-sm bg-white">
        <h1 className="text-2xl font-bold text-center">Student Registration</h1>
        
        {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded border border-red-200">{error}</p>}
        
        <div className="flex flex-col space-y-1">
          <label htmlFor="full_name" className="text-sm font-medium">Full Name</label>
          <input id="full_name" name="full_name" type="text" required className="border p-2 rounded focus:outline-blue-500" />
        </div>

        <div className="flex flex-col space-y-1">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input id="email" name="email" type="email" required className="border p-2 rounded focus:outline-blue-500" />
        </div>
        
        <div className="flex flex-col space-y-1">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <input id="password" name="password" type="password" required className="border p-2 rounded focus:outline-blue-500" minLength={6} />
        </div>
        
        <button type="submit" disabled={isPending} className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition disabled:opacity-50 font-medium">
          {isPending ? 'Registering...' : 'Register'}
        </button>

        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login here</Link>
        </p>
      </form>
    </div>
  )
}
