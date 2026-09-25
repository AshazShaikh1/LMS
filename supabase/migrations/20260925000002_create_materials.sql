-- 1. Create storage bucket for course-materials if it does not exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-materials', 'course-materials', false)
ON CONFLICT (id) DO NOTHING;

-- Storage object policies
DROP POLICY IF EXISTS "Authenticated users can upload course materials" ON storage.objects;
CREATE POLICY "Authenticated users can upload course materials"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'course-materials');

DROP POLICY IF EXISTS "Authenticated users can read course materials" ON storage.objects;
CREATE POLICY "Authenticated users can read course materials"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'course-materials');

DROP POLICY IF EXISTS "Instructors can delete course materials" ON storage.objects;
CREATE POLICY "Instructors can delete course materials"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'course-materials');

-- 2. Create materials table
CREATE TABLE IF NOT EXISTS public.materials (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  uploaded_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  file_path text NOT NULL,
  file_type text,
  file_size bigint,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_materials_course_id ON public.materials(course_id);
CREATE INDEX IF NOT EXISTS idx_materials_uploaded_by ON public.materials(uploaded_by);

-- Enable RLS
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

-- Materials RLS Policies
DROP POLICY IF EXISTS "Enrolled students, instructors, and admins can view materials" ON public.materials;
CREATE POLICY "Enrolled students, instructors, and admins can view materials"
ON public.materials FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.courses
    WHERE courses.id = materials.course_id
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

DROP POLICY IF EXISTS "Instructors and admins can upload materials" ON public.materials;
CREATE POLICY "Instructors and admins can upload materials"
ON public.materials FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.courses
    WHERE courses.id = materials.course_id
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

DROP POLICY IF EXISTS "Instructors and admins can delete materials" ON public.materials;
CREATE POLICY "Instructors and admins can delete materials"
ON public.materials FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.courses
    WHERE courses.id = materials.course_id
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
