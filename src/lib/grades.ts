export interface GradeCalculation {
  percentage: number
  letter: string
  gpa: number
  color: string
}

export function calculateGrade(marks: number, maxMarks: number): GradeCalculation {
  if (maxMarks <= 0) {
    return { percentage: 0, letter: 'N/A', gpa: 0, color: 'text-slate-500 bg-slate-100 border-slate-200' }
  }

  const percentage = Math.round((marks / maxMarks) * 100)

  if (percentage >= 90) {
    return { percentage, letter: 'A+', gpa: 4.0, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
  } else if (percentage >= 80) {
    return { percentage, letter: 'A', gpa: 3.7, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' }
  } else if (percentage >= 70) {
    return { percentage, letter: 'B', gpa: 3.0, color: 'text-blue-700 bg-blue-50 border-blue-200' }
  } else if (percentage >= 60) {
    return { percentage, letter: 'C', gpa: 2.0, color: 'text-amber-700 bg-amber-50 border-amber-200' }
  } else if (percentage >= 50) {
    return { percentage, letter: 'D', gpa: 1.0, color: 'text-orange-700 bg-orange-50 border-orange-200' }
  } else {
    return { percentage, letter: 'F', gpa: 0.0, color: 'text-rose-700 bg-rose-50 border-rose-200' }
  }
}
