export type UserRole = 'student' | 'teacher' | 'admin'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  title: string
  description: string | null
  category: string
  teacher_id: string
  created_at: string
  updated_at: string
  teacher?: {
    id: string
    full_name: string | null
    email: string
  }
}

export interface Enrollment {
  id: string
  course_id: string
  student_id: string
  enrolled_at: string
  status: string
  course?: Course
}

export interface Material {
  id: string
  course_id: string
  uploaded_by: string
  title: string
  description: string | null
  file_path: string
  file_type: string | null
  file_size: number | null
  created_at: string
  uploader?: {
    id: string
    full_name: string | null
    email: string
  }
}

export interface Announcement {
  id: string
  course_id: string
  teacher_id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  course?: {
    id: string
    title: string
    category: string
  }
  teacher?: {
    id: string
    full_name: string | null
    email: string
  }
}

export interface Assignment {
  id: string
  course_id: string
  teacher_id: string
  title: string
  description: string | null
  due_date: string
  max_marks: number
  created_at: string
  updated_at: string
  course?: {
    id: string
    title: string
    category?: string
  }
  teacher?: {
    id: string
    full_name: string | null
    email: string
  }
  submissions?: Submission[]
  submission_count?: number
  userSubmission?: Submission | null
}

export interface Submission {
  id: string
  assignment_id: string
  student_id: string
  file_path: string
  file_name: string
  file_size: number | null
  submitted_at: string
  marks: number | null
  feedback: string | null
  graded_at: string | null
  graded_by: string | null
  student?: {
    id: string
    full_name: string | null
    email: string
  }
  assignment?: Assignment
}

export interface QuizQuestion {
  id: string
  quiz_id: string
  question_text: string
  options: string[]
  correct_option_index: number
  points: number
  order_index: number
  created_at: string
}

export interface QuizAttempt {
  id: string
  quiz_id: string
  student_id: string
  started_at: string
  completed_at: string | null
  score: number
  total_points: number
  percentage: number
  passed: boolean
  answers: Record<string, number>
  student?: {
    id: string
    full_name: string | null
    email: string
  }
}

export interface Quiz {
  id: string
  course_id: string
  teacher_id: string
  title: string
  description: string | null
  time_limit_minutes: number
  passing_score: number
  created_at: string
  updated_at: string
  course?: {
    id: string
    title: string
    category?: string
  }
  teacher?: {
    id: string
    full_name: string | null
    email: string
  }
  questions?: QuizQuestion[]
  attempts?: QuizAttempt[]
  userAttempt?: QuizAttempt | null
}

