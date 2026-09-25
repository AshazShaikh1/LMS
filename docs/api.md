# LMS — Application/API Conventions

The application may use Next.js server actions, route handlers, or Supabase client/server utilities depending on the implementation.

## Rules
- Keep privileged operations server-side.
- Validate input before database writes.
- Check authentication.
- Check role/ownership.
- Return predictable success/error states.
- Never expose service-role credentials.
- Avoid unnecessary custom APIs when Supabase/Next.js functionality is sufficient.

## Logical Operations

### Auth
- register
- login
- logout
- get current user

### Courses
- list courses
- create course
- update course
- delete/archive course
- enroll student
- list enrolled courses

### Materials
- upload material
- list materials
- access/download material
- delete material

### Assignments
- create assignment
- list assignments
- get assignment
- submit assignment
- list submissions
- grade submission

### Quizzes
- create quiz
- create questions
- attempt quiz
- calculate result
- view result

### Admin
- list users
- update user role/status
- manage courses
