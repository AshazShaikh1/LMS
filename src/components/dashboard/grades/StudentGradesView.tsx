'use client'

import { useState } from 'react'
import { calculateGrade } from '@/lib/grades'
import { getSubmissionDownloadUrl } from '@/app/dashboard/assignments/actions'
import {
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  Download
} from 'lucide-react'

interface StudentGradesViewProps {
  coursesWithGrades: {
    course: {
      id: string
      title: string
      category: string
      teacher?: { full_name: string | null; email: string }
    }
    assignments: {
      id: string
      title: string
      due_date: string
      max_marks: number
      submission: {
        id: string
        file_name: string
        submitted_at: string
        marks: number | null
        feedback: string | null
        graded_at: string | null
      } | null
    }[]
  }[]
}

export function StudentGradesView({ coursesWithGrades }: StudentGradesViewProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  // Overall Stats
  let totalEarnedMarks = 0
  let totalPossibleMarks = 0
  let totalGradedAssignments = 0
  let totalPendingEvaluation = 0

  coursesWithGrades.forEach(({ assignments }) => {
    assignments.forEach((a) => {
      if (a.submission?.marks !== null && a.submission?.marks !== undefined) {
        totalEarnedMarks += a.submission.marks
        totalPossibleMarks += a.max_marks
        totalGradedAssignments += 1
      } else if (a.submission) {
        totalPendingEvaluation += 1
      }
    })
  })

  const overall = totalPossibleMarks > 0
    ? calculateGrade(totalEarnedMarks, totalPossibleMarks)
    : null

  const handleDownload = async (subId: string, fallbackName: string) => {
    setDownloadingId(subId)
    setDownloadError(null)
    try {
      const res = await getSubmissionDownloadUrl(subId)
      if (res.error) {
        setDownloadError(res.error)
      } else if (res.downloadUrl) {
        const a = document.createElement('a')
        a.href = res.downloadUrl
        a.download = res.fileName || fallbackName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    } catch (err: any) {
      setDownloadError(err.message || 'Download failed')
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
            <GraduationCap className="h-5 w-5" />
          </div>
          My Academic Grades & Performance
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review graded coursework, instructor feedback, score breakdowns, and cumulative GPA
        </p>
      </div>

      {downloadError && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{downloadError}</span>
        </div>
      )}

      {/* Cumulative GPA / Metrics Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Cumulative GPA</span>
            <Award className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {overall ? `${overall.gpa.toFixed(1)} / 4.0` : '—'}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {overall ? `Grade ${overall.letter} (${overall.percentage}%)` : 'No graded work yet'}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Marks</span>
            <BookOpen className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {totalEarnedMarks} <span className="text-xs font-normal text-slate-400">/ {totalPossibleMarks}</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Cumulative points earned</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600">Graded Tasks</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600">
            {totalGradedAssignments}
          </div>
          <div className="mt-1 text-[11px] text-emerald-700/70">Completed evaluations</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600">Awaiting Grade</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-600">
            {totalPendingEvaluation}
          </div>
          <div className="mt-1 text-[11px] text-amber-700/70">Submitted to instructor</div>
        </div>
      </div>

      {/* Courses Breakdown */}
      {coursesWithGrades.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 p-12 text-center bg-slate-50/50">
          <GraduationCap className="mx-auto h-10 w-10 text-slate-300 mb-2" />
          <h3 className="text-sm font-semibold text-slate-700">No enrolled courses with coursework</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Enroll in academic courses to view assignments, submit deliverables, and track grades.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {coursesWithGrades.map(({ course, assignments }) => {
            let courseEarned = 0
            let coursePossible = 0

            assignments.forEach((a) => {
              if (a.submission?.marks !== null && a.submission?.marks !== undefined) {
                courseEarned += a.submission.marks
                coursePossible += a.max_marks
              }
            })

            const courseGrade = coursePossible > 0 ? calculateGrade(courseEarned, coursePossible) : null

            return (
              <div
                key={course.id}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs"
              >
                {/* Course Header */}
                <div className="bg-slate-50/70 border-b border-slate-200 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 border border-indigo-100">
                        {course.category}
                      </span>
                      <h2 className="text-base font-bold text-slate-900">{course.title}</h2>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Instructor: {course.teacher?.full_name || course.teacher?.email || 'Faculty'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {courseGrade ? (
                      <div className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-3 py-1.5 shadow-2xs">
                        <span className="text-xs text-slate-500">Course Average:</span>
                        <span className="text-sm font-bold text-slate-900">
                          {courseEarned} / {coursePossible} ({courseGrade.percentage}%)
                        </span>
                        <span
                          className={`rounded-md px-2 py-0.5 text-xs font-bold border ${courseGrade.color}`}
                        >
                          {courseGrade.letter}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">No grades recorded yet</span>
                    )}
                  </div>
                </div>

                {/* Assignments List */}
                <div className="divide-y divide-slate-100">
                  {assignments.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No assignments published in this course yet.
                    </div>
                  ) : (
                    assignments.map((assignment) => {
                      const sub = assignment.submission
                      const isGraded = sub?.marks !== null && sub?.marks !== undefined
                      const grade = isGraded ? calculateGrade(sub!.marks!, assignment.max_marks) : null

                      return (
                        <div key={assignment.id} className="p-5 hover:bg-slate-50/50 transition space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="space-y-1">
                              <h3 className="text-sm font-bold text-slate-900">
                                {assignment.title}
                              </h3>
                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Due {new Date(assignment.due_date).toLocaleDateString()}
                                </span>
                                <span>&bull;</span>
                                <span>Max Marks: {assignment.max_marks}</span>
                              </div>
                            </div>

                            {/* Grade / Status badge */}
                            <div className="flex items-center gap-3">
                              {isGraded ? (
                                <div className="flex items-center gap-2">
                                  <div className="text-right">
                                    <div className="text-sm font-bold text-slate-900">
                                      {sub!.marks} / {assignment.max_marks}
                                    </div>
                                    <div className="text-[10px] text-slate-400">
                                      Graded on {new Date(sub!.graded_at!).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <span
                                    className={`rounded-lg px-2.5 py-1 text-xs font-bold border ${grade!.color}`}
                                  >
                                    {grade!.letter} ({grade!.percentage}%)
                                  </span>
                                </div>
                              ) : sub ? (
                                <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                                  <Clock className="h-3.5 w-3.5" />
                                  Pending Evaluation
                                </span>
                              ) : (
                                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                                  Not Submitted
                                </span>
                              )}

                              {sub && (
                                <button
                                  onClick={() => handleDownload(sub.id, sub.file_name)}
                                  disabled={downloadingId === sub.id}
                                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition disabled:opacity-50"
                                  title="Download your submission"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                  {downloadingId === sub.id ? 'Loading...' : 'Submission'}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Instructor Comments Bubble */}
                          {sub?.feedback && (
                            <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-xs text-slate-700 flex items-start gap-2.5">
                              <MessageSquare className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <div className="font-semibold text-slate-800 text-[11px]">Instructor Feedback:</div>
                                <p className="italic text-slate-600 whitespace-pre-line leading-relaxed">
                                  &ldquo;{sub.feedback}&rdquo;
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
