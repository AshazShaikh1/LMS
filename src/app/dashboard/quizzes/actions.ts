'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface QuestionInput {
  question_text: string
  options: string[]
  correct_option_index: number
  points?: number
}

export async function createQuiz(
  courseId: string,
  data: {
    title: string
    description?: string
    time_limit_minutes?: number
    passing_score?: number
    questions: QuestionInput[]
  }
): Promise<{ error?: string; quizId?: string; success?: boolean }> {
  const { title, description, time_limit_minutes = 0, passing_score = 50, questions } = data

  if (!title?.trim()) {
    return { error: 'Quiz title is required.' }
  }

  if (!questions || questions.length === 0) {
    return { error: 'Please add at least one question to the quiz.' }
  }

  // Validate questions
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i]
    if (!q.question_text?.trim()) {
      return { error: `Question #${i + 1} text is required.` }
    }
    if (!q.options || q.options.length < 2) {
      return { error: `Question #${i + 1} must have at least 2 options.` }
    }
    if (
      q.correct_option_index === undefined ||
      q.correct_option_index < 0 ||
      q.correct_option_index >= q.options.length
    ) {
      return { error: `Question #${i + 1} must specify a valid correct option.` }
    }
  }

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'You must be logged in to create quizzes.' }
    }

    // Verify course ownership or admin
    const { data: course } = await supabase
      .from('courses')
      .select('teacher_id')
      .eq('id', courseId)
      .single()

    if (!course) {
      return { error: 'Course not found.' }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isInstructor = course.teacher_id === user.id
    const isAdmin = profile?.role === 'admin'

    if (!isInstructor && !isAdmin) {
      return { error: 'Only the course instructor or an administrator can publish quizzes.' }
    }

    // 1. Insert quiz
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        course_id: courseId,
        teacher_id: user.id,
        title: title.trim(),
        description: description?.trim() || null,
        time_limit_minutes: Number(time_limit_minutes) || 0,
        passing_score: Number(passing_score) || 50,
      })
      .select('id')
      .single()

    if (quizError || !quiz) {
      return { error: `Failed to create quiz: ${quizError?.message}` }
    }

    // 2. Insert questions
    const questionRows = questions.map((q, index) => ({
      quiz_id: quiz.id,
      question_text: q.question_text.trim(),
      options: q.options.map((opt) => opt.trim()),
      correct_option_index: q.correct_option_index,
      points: Number(q.points) || 1,
      order_index: index,
    }))

    const { error: questionsError } = await supabase
      .from('quiz_questions')
      .insert(questionRows)

    if (questionsError) {
      // Rollback quiz
      await supabase.from('quizzes').delete().eq('id', quiz.id)
      return { error: `Failed to save questions: ${questionsError.message}` }
    }

    revalidatePath(`/dashboard/courses/${courseId}`)
    revalidatePath('/dashboard/quizzes')
    revalidatePath('/dashboard')
    return { success: true, quizId: quiz.id }
  } catch (err: any) {
    console.error('Create quiz error:', err)
    return { error: err.message || 'An unexpected error occurred.' }
  }
}

export async function deleteQuiz(
  quizId: string
): Promise<{ error?: string; success?: boolean }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized.' }
    }

    const { data: quiz } = await supabase
      .from('quizzes')
      .select('course_id, teacher_id, course:courses!quizzes_course_id_fkey(teacher_id)')
      .eq('id', quizId)
      .single()

    if (!quiz) {
      return { error: 'Quiz not found.' }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const courseTeacher = Array.isArray(quiz.course)
      ? (quiz.course[0] as any)?.teacher_id
      : (quiz.course as any)?.teacher_id

    const isInstructor = courseTeacher === user.id || quiz.teacher_id === user.id
    const isAdmin = profile?.role === 'admin'

    if (!isInstructor && !isAdmin) {
      return { error: 'Permission denied.' }
    }

    const { error: deleteError } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', quizId)

    if (deleteError) {
      return { error: deleteError.message }
    }

    revalidatePath(`/dashboard/courses/${quiz.course_id}`)
    revalidatePath('/dashboard/quizzes')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    console.error('Delete quiz error:', err)
    return { error: err.message || 'Failed to delete quiz.' }
  }
}

export async function submitQuizAttempt(
  quizId: string,
  answers: Record<string, number>
): Promise<{
  error?: string
  success?: boolean
  score?: number
  totalPoints?: number
  percentage?: number
  passed?: boolean
}> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Please log in to submit quiz attempt.' }
    }

    // 1. Fetch quiz with questions
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select(`
        id,
        course_id,
        passing_score,
        questions:quiz_questions(
          id,
          correct_option_index,
          points
        )
      `)
      .eq('id', quizId)
      .single()

    if (quizError || !quiz) {
      return { error: 'Quiz not found.' }
    }

    // 2. Verify enrollment
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('course_id', quiz.course_id)
      .eq('student_id', user.id)
      .maybeSingle()

    if (!enrollment) {
      return { error: 'You must be enrolled in this course to take this quiz.' }
    }

    // 3. Calculate score
    const questions = quiz.questions || []
    let score = 0
    let totalPoints = 0

    questions.forEach((q: any) => {
      const pts = q.points || 1
      totalPoints += pts
      const studentChosenIndex = answers[q.id]
      if (studentChosenIndex !== undefined && studentChosenIndex === q.correct_option_index) {
        score += pts
      }
    })

    const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0
    const passed = percentage >= quiz.passing_score

    // 4. Upsert into quiz_attempts
    const { error: attemptError } = await supabase
      .from('quiz_attempts')
      .upsert(
        {
          quiz_id: quizId,
          student_id: user.id,
          completed_at: new Date().toISOString(),
          score,
          total_points: totalPoints,
          percentage,
          passed,
          answers,
        },
        { onConflict: 'quiz_id,student_id' }
      )

    if (attemptError) {
      return { error: `Failed to save quiz results: ${attemptError.message}` }
    }

    revalidatePath(`/dashboard/courses/${quiz.course_id}`)
    revalidatePath('/dashboard/quizzes')
    revalidatePath(`/dashboard/quizzes/${quizId}`)
    revalidatePath('/dashboard')

    return {
      success: true,
      score,
      totalPoints,
      percentage,
      passed,
    }
  } catch (err: any) {
    console.error('Quiz submission error:', err)
    return { error: err.message || 'An unexpected error occurred during quiz submission.' }
  }
}
