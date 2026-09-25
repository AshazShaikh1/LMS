import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center space-y-6">
      <h1 className="text-4xl font-extrabold tracking-tight">Learning Management System</h1>
      <p className="text-lg text-gray-600 max-w-lg">
        A centralized platform for course materials, assignments, submissions, grading, and more.
      </p>
      
      <div className="flex space-x-4 mt-8">
        <Link href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          Login
        </Link>
        <Link href="/register" className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition">
          Register
        </Link>
      </div>
    </div>
  )
}
