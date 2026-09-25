-- 1. Create storage bucket for student assignment submissions
INSERT INTO storage.buckets (id, name, public)
VALUES ('assignment-submissions', 'assignment-submissions', false)
ON CONFLICT (id) DO NOTHING;

-- Storage object policies for submissions
DROP POLICY IF EXISTS "Authenticated users can upload submissions" ON storage.objects;
CREATE POLICY "Authenticated users can upload submissions"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'assignment-submissions');

DROP POLICY IF EXISTS "Authenticated users can read submissions" ON storage.objects;
CREATE POLICY "Authenticated users can read submissions"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'assignment-submissions');

DROP POLICY IF EXISTS "Users can delete own submissions from storage" ON storage.objects;
CREATE POLICY "Users can delete own submissions from storage"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'assignment-submissions');

-- 2. Create assignments table
CREATE TABLE IF NOT EXISTS public.assignments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  due_date timestamptz NOT NULL,
  max_marks integer DEFAULT 100 NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create submissions table
CREATE TABLE IF NOT EXISTS public.submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id uuid NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_size bigint,
  submitted_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  marks integer,
  feedback text,
  graded_at timestamptz,
  graded_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  CONSTRAINT unique_assignment_student UNIQUE (assignment_id, student_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_assignments_course_id ON public.assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_assignments_teacher_id ON public.assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON public.assignments(due_date);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment_id ON public.submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student_id ON public.submissions(student_id);

-- Enable RLS
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Assignments RLS Policies
DROP POLICY IF EXISTS "Enrolled students, instructors, and admins can view assignments" ON public.assignments;
CREATE POLICY "Enrolled students, instructors, and admins can view assignments"
ON public.assignments FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.courses
    WHERE courses.id = assignments.course_id
    AND (
      courses.teacher_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.enrollments
        WHERE enrollments.course_id = courses.id
        AND enrollments.student_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
      )
    )
  )
);

DROP POLICY IF EXISTS "Instructors and admins can create assignments" ON public.assignments;
CREATE POLICY "Instructors and admins can create assignments"
ON public.assignments FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.courses
    WHERE courses.id = assignments.course_id
    AND (
      courses.teacher_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
      )
    )
  )
);

DROP POLICY IF EXISTS "Instructors and admins can update assignments" ON public.assignments;
CREATE POLICY "Instructors and admins can update assignments"
ON public.assignments FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.courses
    WHERE courses.id = assignments.course_id
    AND (
      courses.teacher_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
      )
    )
  )
);

DROP POLICY IF EXISTS "Instructors and admins can delete assignments" ON public.assignments;
CREATE POLICY "Instructors and admins can delete assignments"
ON public.assignments FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.courses
    WHERE courses.id = assignments.course_id
    AND (
      courses.teacher_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
      )
    )
  )
);

-- Submissions RLS Policies
DROP POLICY IF EXISTS "Students, instructors, and admins can view submissions" ON public.submissions;
CREATE POLICY "Students, instructors, and admins can view submissions"
ON public.submissions FOR SELECT
TO authenticated
USING (
  student_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.assignments
    JOIN public.courses ON courses.id = assignments.course_id
    WHERE assignments.id = submissions.assignment_id
    AND (
      courses.teacher_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
      )
    )
  )
);

DROP POLICY IF EXISTS "Enrolled students can create submissions" ON public.submissions;
CREATE POLICY "Enrolled students can create submissions"
ON public.submissions FOR INSERT
TO authenticated
WITH CHECK (
  student_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.assignments
    JOIN public.enrollments ON enrollments.course_id = assignments.course_id
    WHERE assignments.id = submissions.assignment_id
    AND enrollments.student_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Students can update their submissions, instructors can grade" ON public.submissions;
CREATE POLICY "Students can update their submissions, instructors can grade"
ON public.submissions FOR UPDATE
TO authenticated
USING (
  student_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.assignments
    JOIN public.courses ON courses.id = assignments.course_id
    WHERE assignments.id = submissions.assignment_id
    AND (
      courses.teacher_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
      )
    )
  )
);

DROP POLICY IF EXISTS "Students and instructors can delete submissions" ON public.submissions;
CREATE POLICY "Students and instructors can delete submissions"
ON public.submissions FOR DELETE
TO authenticated
USING (
  student_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.assignments
    JOIN public.courses ON courses.id = assignments.course_id
    WHERE assignments.id = submissions.assignment_id
    AND (
      courses.teacher_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
      )
    )
  )
);
