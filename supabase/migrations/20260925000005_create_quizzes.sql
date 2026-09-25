-- Phase 8: Quizzes, Questions, and Student Attempts

-- 1. Create quizzes table
CREATE TABLE IF NOT EXISTS public.quizzes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  time_limit_minutes integer DEFAULT 0 NOT NULL,
  passing_score integer DEFAULT 50 NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create quiz_questions table
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id uuid NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  options jsonb NOT NULL, -- e.g. ["Option 1", "Option 2", "Option 3", "Option 4"]
  correct_option_index integer NOT NULL, -- 0-indexed
  points integer DEFAULT 1 NOT NULL,
  order_index integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create quiz_attempts table
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id uuid NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  started_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at timestamptz,
  score integer DEFAULT 0 NOT NULL,
  total_points integer DEFAULT 0 NOT NULL,
  percentage integer DEFAULT 0 NOT NULL,
  passed boolean DEFAULT false NOT NULL,
  answers jsonb DEFAULT '{}'::jsonb NOT NULL, -- { [question_id]: selected_option_index }
  CONSTRAINT unique_student_quiz_attempt UNIQUE (quiz_id, student_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_quizzes_course_id ON public.quizzes(course_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_teacher_id ON public.quizzes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON public.quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON public.quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student_id ON public.quiz_attempts(student_id);

-- Enable RLS
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Quizzes RLS
DROP POLICY IF EXISTS "Users can view course quizzes" ON public.quizzes;
CREATE POLICY "Users can view course quizzes"
ON public.quizzes FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.courses
    WHERE courses.id = quizzes.course_id
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

DROP POLICY IF EXISTS "Instructors can create quizzes" ON public.quizzes;
CREATE POLICY "Instructors can create quizzes"
ON public.quizzes FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.courses
    WHERE courses.id = quizzes.course_id
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

DROP POLICY IF EXISTS "Instructors can update quizzes" ON public.quizzes;
CREATE POLICY "Instructors can update quizzes"
ON public.quizzes FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.courses
    WHERE courses.id = quizzes.course_id
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

DROP POLICY IF EXISTS "Instructors can delete quizzes" ON public.quizzes;
CREATE POLICY "Instructors can delete quizzes"
ON public.quizzes FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.courses
    WHERE courses.id = quizzes.course_id
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

-- Quiz Questions RLS
DROP POLICY IF EXISTS "Users can view quiz questions" ON public.quiz_questions;
CREATE POLICY "Users can view quiz questions"
ON public.quiz_questions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.quizzes
    JOIN public.courses ON courses.id = quizzes.course_id
    WHERE quizzes.id = quiz_questions.quiz_id
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

DROP POLICY IF EXISTS "Instructors can manage quiz questions" ON public.quiz_questions;
CREATE POLICY "Instructors can manage quiz questions"
ON public.quiz_questions FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.quizzes
    JOIN public.courses ON courses.id = quizzes.course_id
    WHERE quizzes.id = quiz_questions.quiz_id
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

-- Quiz Attempts RLS
DROP POLICY IF EXISTS "Students and teachers can view quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Students and teachers can view quiz attempts"
ON public.quiz_attempts FOR SELECT
TO authenticated
USING (
  student_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.quizzes
    JOIN public.courses ON courses.id = quizzes.course_id
    WHERE quizzes.id = quiz_attempts.quiz_id
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

DROP POLICY IF EXISTS "Enrolled students can create attempts" ON public.quiz_attempts;
CREATE POLICY "Enrolled students can create attempts"
ON public.quiz_attempts FOR INSERT
TO authenticated
WITH CHECK (
  student_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.quizzes
    JOIN public.enrollments ON enrollments.course_id = quizzes.course_id
    WHERE quizzes.id = quiz_attempts.quiz_id
    AND enrollments.student_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Students can update their own attempt" ON public.quiz_attempts;
CREATE POLICY "Students can update their own attempt"
ON public.quiz_attempts FOR UPDATE
TO authenticated
USING (
  student_id = auth.uid()
);
