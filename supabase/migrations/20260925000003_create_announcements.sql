-- Create announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_announcements_course_id ON public.announcements(course_id);
CREATE INDEX IF NOT EXISTS idx_announcements_teacher_id ON public.announcements(teacher_id);

-- Enable RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Announcements RLS Policies
DROP POLICY IF EXISTS "Enrolled students, instructors, and admins can view announcements" ON public.announcements;
CREATE POLICY "Enrolled students, instructors, and admins can view announcements"
ON public.announcements FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.courses
    WHERE courses.id = announcements.course_id
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

DROP POLICY IF EXISTS "Instructors and admins can create announcements" ON public.announcements;
CREATE POLICY "Instructors and admins can create announcements"
ON public.announcements FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.courses
    WHERE courses.id = announcements.course_id
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

DROP POLICY IF EXISTS "Instructors and admins can update announcements" ON public.announcements;
CREATE POLICY "Instructors and admins can update announcements"
ON public.announcements FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.courses
    WHERE courses.id = announcements.course_id
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

DROP POLICY IF EXISTS "Instructors and admins can delete announcements" ON public.announcements;
CREATE POLICY "Instructors and admins can delete announcements"
ON public.announcements FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.courses
    WHERE courses.id = announcements.course_id
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
