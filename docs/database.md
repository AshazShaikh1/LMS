# LMS — Database Design

## Core Tables

### profiles
- id
- user_id
- full_name
- email
- role
- created_at
- updated_at

### courses
- id
- title
- description
- category
- teacher_id
- created_at
- updated_at

### enrollments
- id
- course_id
- student_id
- enrolled_at
- status

### materials
- id
- course_id
- uploaded_by
- title
- description
- file_path
- file_type
- file_size
- created_at

### announcements
- id
- course_id
- teacher_id
- title
- content
- created_at
- updated_at

### assignments
- id
- course_id
- teacher_id
- title
- description
- due_date
- max_marks
- created_at
- updated_at

### submissions
- id
- assignment_id
- student_id
- file_path
- submitted_at
- marks
- feedback
- graded_at
- graded_by

### quizzes
- id
- course_id
- teacher_id
- title
- description
- total_marks
- created_at

### questions
- id
- quiz_id
- question_text
- option_a
- option_b
- option_c
- option_d
- correct_option
- marks

### quiz_attempts
- id
- quiz_id
- student_id
- score
- attempted_at

## Relationships

```text
Teacher ──< Courses
Student ──< Enrollments >── Courses

Course ──< Materials
Course ──< Announcements
Course ──< Assignments
Assignment ──< Submissions

Course ──< Quizzes
Quiz ──< Questions
Quiz ──< Quiz Attempts
Student ──< Quiz Attempts
```

## Database Rules
- Use UUIDs where appropriate.
- Use foreign keys.
- Add unique constraints for enrollment duplication.
- Add indexes for frequently queried foreign keys.
- Enable RLS on exposed tables.
- Create policies based on authenticated user and role.
- Never bypass authorization from client code.
