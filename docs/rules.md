# LMS — Development Rules

## 1. General
- Read all project documentation before implementing anything.
- Do not invent requirements.
- Do not add major features unless explicitly requested.
- Keep the project appropriate for an academic LMS.
- Prefer simple, understandable solutions over over-engineering.

## 2. Architecture
- Use Next.js with the App Router.
- Use TypeScript.
- Use Tailwind CSS for styling.
- Use Supabase for authentication, PostgreSQL database, and file storage.
- Avoid unnecessary microservices.
- Avoid introducing a separate backend server unless a requirement makes it necessary.

## 3. Authentication & Authorization
- Use Supabase Auth.
- Support Student, Teacher, and Admin roles.
- Every protected operation must verify authorization.
- Never trust a role supplied only by the client.
- Use Row Level Security (RLS) for database protection.
- Never expose Supabase service-role keys in client-side code.

## 4. Database
- Design relational tables carefully.
- Use primary keys and foreign keys.
- Add appropriate indexes.
- Store timestamps consistently.
- Avoid duplicated data.
- Create migrations for schema changes.
- RLS policies must be documented and tested.

## 5. File Uploads
- Use Supabase Storage.
- Validate file type and size.
- Keep student submissions and teacher materials logically separated.
- Do not expose private files publicly unless explicitly required.
- Use secure access patterns for protected files.

## 6. UI/UX
- Keep the UI clean and simple.
- Build responsive layouts.
- Use Tailwind consistently.
- Do not add excessive animations.
- Provide clear loading, empty, success, and error states.
- Forms must have validation and useful error messages.
- Dashboards should be role-specific.

## 7. Code Quality
- Use reusable components where appropriate.
- Keep business logic separate from UI components.
- Avoid giant components.
- Use clear naming.
- Do not duplicate logic unnecessarily.
- Handle errors explicitly.
- Keep secrets in environment variables.

## 8. Security
- Validate all user-controlled input.
- Enforce authorization server-side/database-side.
- Use RLS.
- Protect private storage objects.
- Never commit `.env` files or secrets.
- Do not log passwords, tokens, or sensitive credentials.

## 9. AI Agent Rule
Before making architectural changes:
1. Check the existing documentation.
2. Check the current implementation.
3. Explain the reason for a significant change.
4. Update the relevant documentation after the change.

Do not rewrite working features merely for stylistic reasons.

## 10. Testing
At minimum test:
- Authentication
- Role restrictions
- Course creation
- Enrollment
- Material upload/access
- Assignment submission
- Teacher grading
- Result visibility
- RLS policies
- File access

## 11. Completion Rule
A feature is not considered complete merely because the UI exists. It must work through the full flow, including database operations, authorization, error handling, and appropriate testing.
