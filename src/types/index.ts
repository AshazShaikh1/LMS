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
