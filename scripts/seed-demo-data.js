const { Client } = require('pg');

const client = new Client({
  host: 'aws-0-ap-south-1.pooler.supabase.com',
  port: 6543,
  user: 'postgres.lagagkxsdyoyobqhbkyr',
  password: 'gahX5r8uKIIM1rP3',
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
});

async function seed() {
  console.log('--- SEEDING ACADEMIC DEMO DATA FOR PRESENTATION ---');
  await client.connect();

  try {
    // 1. Get teacher id
    const teacherRes = await client.query("SELECT id FROM profiles WHERE role = 'teacher' LIMIT 1;");
    if (teacherRes.rows.length === 0) {
      console.log('No teacher found.');
      return;
    }
    const teacherId = teacherRes.rows[0].id;

    // 2. Get courses
    const coursesRes = await client.query("SELECT id, title FROM courses LIMIT 2;");
    if (coursesRes.rows.length === 0) {
      console.log('No courses found.');
      return;
    }
    const csCourse = coursesRes.rows[0];

    // 3. Ensure students are enrolled
    const studentsRes = await client.query("SELECT id FROM profiles WHERE role = 'student';");
    for (const s of studentsRes.rows) {
      await client.query(`
        INSERT INTO enrollments (course_id, student_id)
        VALUES ($1, $2)
        ON CONFLICT (course_id, student_id) DO NOTHING;
      `, [csCourse.id, s.id]);
    }
    console.log(`Enrolled ${studentsRes.rows.length} students into ${csCourse.title}`);

    // 4. Create sample assignment if none exists
    const assignCheck = await client.query("SELECT id FROM assignments WHERE course_id = $1;", [csCourse.id]);
    if (assignCheck.rows.length === 0) {
      const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      await client.query(`
        INSERT INTO assignments (course_id, teacher_id, title, description, due_date, max_marks)
        VALUES ($1, $2, $3, $4, $5, 100);
      `, [
        csCourse.id,
        teacherId,
        'Midterm Lab 1: Binary Search Tree Implementation',
        'Implement an AVL or balanced Binary Search Tree in Python, Java, or C++. Submit your source code archive with a README detailing time complexity analysis.',
        dueDate
      ]);
      console.log('Created sample assignment: Midterm Lab 1');
    }

    // 5. Create sample quiz if none exists
    const quizCheck = await client.query("SELECT id FROM quizzes WHERE course_id = $1;", [csCourse.id]);
    if (quizCheck.rows.length === 0) {
      const quizRes = await client.query(`
        INSERT INTO quizzes (course_id, teacher_id, title, description, time_limit_minutes, passing_score)
        VALUES ($1, $2, $3, $4, 15, 60)
        RETURNING id;
      `, [
        csCourse.id,
        teacherId,
        'Quiz 1: Algorithm Complexity & Asymptotic Notation',
        'Test your understanding of Big-O notations, recursion tree depth, and sorting lower bounds.'
      ]);
      const quizId = quizRes.rows[0].id;

      // Add 3 MCQ questions
      await client.query(`
        INSERT INTO quiz_questions (quiz_id, question_text, options, correct_option_index, points, order_index)
        VALUES
          ($1, 'What is the worst-case time complexity of QuickSort?', '["O(n log n)", "O(n^2)", "O(log n)", "O(n)"]'::jsonb, 1, 1, 0),
          ($1, 'Which data structure follows the Last-In First-Out (LIFO) principle?', '["Queue", "Stack", "Binary Tree", "Linked List"]'::jsonb, 1, 1, 1),
          ($1, 'What is the optimal comparison-based sorting lower bound?', '["O(n)", "O(n log n)", "O(n^2)", "O(1)"]'::jsonb, 1, 1, 2);
      `, [quizId]);

      console.log('Created sample quiz: Quiz 1 with 3 MCQ questions');
    }

    // 6. Create sample announcement if none exists
    const annCheck = await client.query("SELECT id FROM announcements WHERE course_id = $1;", [csCourse.id]);
    if (annCheck.rows.length === 0) {
      await client.query(`
        INSERT INTO announcements (course_id, teacher_id, title, content)
        VALUES ($1, $2, $3, $4);
      `, [
        csCourse.id,
        teacherId,
        'Welcome to the Semester & Office Hours Schedule',
        'Welcome everyone to the course! Lecture slides and assignment guidelines are posted weekly. Faculty office hours are held Tuesdays & Thursdays 3:00 PM - 5:00 PM.'
      ]);
      console.log('Created sample announcement');
    }

    console.log('Demo data seeded successfully!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await client.end();
  }
}

seed();
