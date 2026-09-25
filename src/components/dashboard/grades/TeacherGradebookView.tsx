'use client'

import { useState } from 'react'
import { calculateGrade } from '@/lib/grades'
import { GradeSubmissionModal } from './GradeSubmissionModal'
import {
  Award,
  Users,
  BookOpen,
  ClipboardList,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  Search,
  Filter
} from 'lucide-react'

interface StudentData {
  id: string
  full_name: string | null
  email: string
}

interface AssignmentData {
  id: string
  title: string
  max_marks: number
  due_date: string
}

interface SubmissionData {
  id: string
  assignment_id: string
  student_id: string
  file_name: string
  submitted_at: string
  marks: number | null
  feedback: string | null
  graded_at: string | null
}

interface CourseGradebookData {
  course: {
    id: string
    title: string
    category: string
  }
  students: StudentData[]
  assignments: AssignmentData[]
  submissions: SubmissionData[]
}

interface TeacherGradebookViewProps {
  gradebookData: CourseGradebookData[]
}

export function TeacherGradebookView({ gradebookData }: TeacherGradebookViewProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    gradebookData[0]?.course.id || ''
  )
  const [searchStudent, setSearchStudent] = useState('')
  const [activeModalData, setActiveModalData] = useState<{
    submission: any
    maxMarks: number
  } | null>(null)

  const activeCourseData = gradebookData.find((g) => g.course.id === selectedCourseId) || gradebookData[0]

  if (!activeCourseData || gradebookData.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 p-12 text-center bg-slate-50/50">
        <ClipboardList className="mx-auto h-10 w-10 text-slate-300 mb-2" />
        <h3 className="text-sm font-semibold text-slate-700">No active instructional courses</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Create a course and publish assignments to track student evaluations and academic gradebooks.
        </p>
      </div>
    )
  }

  const { course, students, assignments, submissions } = activeCourseData

  // Submissions map: `${assignment_id}_${student_id}` -> SubmissionData
  const submissionMap = new Map<string, SubmissionData>()
  submissions.forEach((s) => {
    submissionMap.set(`${s.assignment_id}_${s.student_id}`, s)
  })

  // Calculate Course Metrics
  const totalPossibleCourseMarks = assignments.reduce((sum, a) => sum + a.max_marks, 0)
  const totalSubmissions = submissions.length
  const gradedSubmissions = submissions.filter((s) => s.marks !== null).length
  const gradingProgress = totalSubmissions > 0 ? Math.round((gradedSubmissions / totalSubmissions) * 100) : 0

  // Filter students by search
  const filteredStudents = students.filter(
    (s) =>
      (s.full_name || '').toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.email.toLowerCase().includes(searchStudent.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
              <ClipboardList className="h-5 w-5" />
            </div>
            Faculty Gradebook & Evaluation Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish marks, write constructive feedback, and review overall course academic standing
          </p>
        </div>

        {/* Course Selector Dropdown */}
        {gradebookData.length > 1 && (
          <div className="w-full sm:w-auto">
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full sm:w-64 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-xs focus:border-amber-500 focus:outline-hidden"
            >
              {gradebookData.map((g) => (
                <option key={g.course.id} value={g.course.id}>
                  {g.course.title} ({g.course.category})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Course KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Enrolled Students</span>
            <Users className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{students.length}</div>
          <div className="mt-1 text-[11px] text-slate-400">Class roster size</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Assignments</span>
            <BookOpen className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{assignments.length}</div>
          <div className="mt-1 text-[11px] text-slate-400">Total {totalPossibleCourseMarks} max marks</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600">Graded Work</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600">
            {gradedSubmissions} <span className="text-xs text-slate-400 font-normal">/ {totalSubmissions}</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-700/70">{gradingProgress}% completed</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600">Ungraded Submissions</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-600">
            {totalSubmissions - gradedSubmissions}
          </div>
          <div className="mt-1 text-[11px] text-amber-700/70">Awaiting teacher marks</div>
        </div>
      </div>

      {/* Gradebook Table Card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Gradebook Roster: <span className="text-amber-700">{course.title}</span>
            </h2>
            <p className="text-xs text-slate-500">Click any student score or action to review or update grades</p>
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Table Content */}
        {students.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No students are currently enrolled in this course.
          </div>
        ) : assignments.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No assignments have been published for this course yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="py-3 px-4 min-w-[200px]">Student Name</th>
                  {assignments.map((assignment) => (
                    <th key={assignment.id} className="py-3 px-4 min-w-[130px] text-center">
                      <div className="truncate max-w-[120px] font-bold text-slate-900">
                        {assignment.title}
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        Max {assignment.max_marks} pts
                      </div>
                    </th>
                  ))}
                  <th className="py-3 px-4 text-center min-w-[120px] font-bold text-slate-900">
                    Total Score
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => {
                  let studentEarnedMarks = 0

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/70 transition">
                      {/* Student info */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">
                          {student.full_name || 'Enrolled Student'}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                          {student.email}
                        </div>
                      </td>

                      {/* Assignment scores */}
                      {assignments.map((assignment) => {
                        const sub = submissionMap.get(`${assignment.id}_${student.id}`)
                        if (sub && sub.marks !== null && sub.marks !== undefined) {
                          studentEarnedMarks += sub.marks
                        }

                        return (
                          <td key={assignment.id} className="py-3 px-4 text-center">
                            {sub ? (
                              sub.marks !== null && sub.marks !== undefined ? (
                                <button
                                  onClick={() =>
                                    setActiveModalData({
                                      submission: { ...sub, student },
                                      maxMarks: assignment.max_marks,
                                    })
                                  }
                                  className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 font-bold text-amber-800 border border-amber-200 hover:bg-amber-100 transition"
                                  title="Click to edit grade"
                                >
                                  {sub.marks} / {assignment.max_marks}
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    setActiveModalData({
                                      submission: { ...sub, student },
                                      maxMarks: assignment.max_marks,
                                    })
                                  }
                                  className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 font-semibold text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition"
                                  title="Submitted, awaiting grade"
                                >
                                  Grade Work
                                </button>
                              )
                            ) : (
                              <span className="text-slate-300 font-mono">—</span>
                            )}
                          </td>
                        )
                      })}

                      {/* Student Total Score */}
                      <td className="py-3 px-4 text-center">
                        {totalPossibleCourseMarks > 0 ? (
                          (() => {
                            const grade = calculateGrade(studentEarnedMarks, totalPossibleCourseMarks)
                            return (
                              <div className="inline-flex items-center gap-1.5 font-bold">
                                <span>{studentEarnedMarks}</span>
                                <span className={`rounded-md px-1.5 py-0.5 text-[10px] border ${grade.color}`}>
                                  {grade.letter} ({grade.percentage}%)
                                </span>
                              </div>
                            )
                          })()
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Grade Submission Modal */}
      {activeModalData && (
        <GradeSubmissionModal
          submission={activeModalData.submission}
          maxMarks={activeModalData.maxMarks}
          isOpen={!!activeModalData}
          onClose={() => setActiveModalData(null)}
          onSuccess={() => setActiveModalData(null)}
        />
      )}
    </div>
  )
}
