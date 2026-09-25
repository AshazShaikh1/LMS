'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Course, UserRole } from '@/types'
import {
  BookOpen,
  Search,
  PlusCircle,
  Users,
  CheckCircle2,
  ArrowRight,
  Filter,
  GraduationCap
} from 'lucide-react'

interface CoursesClientProps {
  role: UserRole
  userId: string
  allCourses: (Course & { enrollmentCount: number })[]
  enrolledCourseIds: string[]
}

export function CoursesClient({
  role,
  userId,
  allCourses,
  enrolledCourseIds,
}: CoursesClientProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [activeTab, setActiveTab] = useState<'enrolled' | 'catalog'>(
    role === 'student' && enrolledCourseIds.length > 0 ? 'enrolled' : 'catalog'
  )

  const categories = ['All', ...Array.from(new Set(allCourses.map((c) => c.category)))]

  // Filter courses based on search and category
  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (course.teacher?.full_name && course.teacher.full_name.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory

    if (role === 'student' && activeTab === 'enrolled') {
      return matchesSearch && matchesCategory && enrolledCourseIds.includes(course.id)
    }

    if (role === 'teacher' && activeTab === 'enrolled') {
      return matchesSearch && matchesCategory && course.teacher_id === userId
    }

    return matchesSearch && matchesCategory
  })

  const isTeacherOrAdmin = role === 'teacher' || role === 'admin'
  const enrolledCount = allCourses.filter((c) => enrolledCourseIds.includes(c.id)).length
  const teachingCount = allCourses.filter((c) => c.teacher_id === userId).length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {role === 'student' ? 'Course Catalog & Enrollments' : 'Course Management'}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            {role === 'student'
              ? 'Browse institutional academic courses and access your enrolled learning modules.'
              : 'Create, oversee, and manage academic curriculum offerings.'}
          </p>
        </div>

        {isTeacherOrAdmin && (
          <div className="flex shrink-0">
            <Link
              href="/dashboard/courses/new"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-indigo-700 transition"
            >
              <PlusCircle className="h-4 w-4" />
              Create Course
            </Link>
          </div>
        )}
      </div>

      {/* Tabs for Students and Teachers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {role === 'student' ? (
          <div className="grid grid-cols-2 sm:flex rounded-lg bg-slate-100 p-1 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('enrolled')}
              className={`rounded-md px-3 py-2 text-xs font-semibold transition text-center ${
                activeTab === 'enrolled'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Courses ({enrolledCount})
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`rounded-md px-3 py-2 text-xs font-semibold transition text-center ${
                activeTab === 'catalog'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Catalog ({allCourses.length})
            </button>
          </div>
        ) : role === 'teacher' ? (
          <div className="grid grid-cols-2 sm:flex rounded-lg bg-slate-100 p-1 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('enrolled')}
              className={`rounded-md px-3 py-2 text-xs font-semibold transition text-center ${
                activeTab === 'enrolled'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Teaching ({teachingCount})
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`rounded-md px-3 py-2 text-xs font-semibold transition text-center ${
                activeTab === 'catalog'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Courses ({allCourses.length})
            </button>
          </div>
        ) : (
          <div className="text-xs sm:text-sm font-semibold text-slate-700">
            Total Institution Offerings: {allCourses.length}
          </div>
        )}

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses or faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-300 pl-8 pr-3 py-2 text-xs text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Courses Cards Grid */}
      {filteredCourses.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white p-8 sm:p-12 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">
            No courses found
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            {role === 'student' && activeTab === 'enrolled'
              ? 'You are not enrolled in any courses matching your filter criteria. Switch to Course Catalog to enroll.'
              : 'No courses match your search or filter criteria.'}
          </p>
          {role === 'student' && activeTab === 'enrolled' && (
            <button
              onClick={() => setActiveTab('catalog')}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3.5 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition"
            >
              Browse Course Catalog &rarr;
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredCourses.map((course) => {
            const isEnrolled = enrolledCourseIds.includes(course.id)
            const isInstructor = course.teacher_id === userId

            return (
              <div
                key={course.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs hover:border-slate-300 hover:shadow-sm transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-100">
                      {course.category}
                    </span>

                    {isEnrolled && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        Enrolled
                      </span>
                    )}

                    {isInstructor && (
                      <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                        Instructor
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                    {course.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {course.description || 'No detailed syllabus description provided yet.'}
                  </p>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-3.5 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2 truncate">
                    <GraduationCap className="h-4 w-4 shrink-0 text-slate-400" />
                    <span className="truncate">
                      {course.teacher?.full_name || 'Faculty Instructor'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 text-slate-400">
                    <Users className="h-3.5 w-3.5" />
                    <span>{course.enrollmentCount}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2">
                  <Link
                    href={`/dashboard/courses/${course.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition min-h-[40px]"
                  >
                    <span>View Course Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
