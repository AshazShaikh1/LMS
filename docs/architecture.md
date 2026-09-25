# LMS — Architecture

## High-Level Architecture

```text
                 ┌─────────────────────┐
                 │      Students       │
                 ├─────────────────────┤
                 │      Teachers       │
                 ├─────────────────────┤
                 │       Admin         │
                 └──────────┬──────────┘
                            │
                            v
                 ┌─────────────────────┐
                 │       Next.js       │
                 │ React + TypeScript  │
                 │     Tailwind CSS    │
                 └──────────┬──────────┘
                            │
             ┌──────────────┼──────────────┐
             │              │              │
             v              v              v
      ┌────────────┐ ┌──────────────┐ ┌──────────────┐
      │ Supabase   │ │ PostgreSQL   │ │  Supabase    │
      │    Auth    │ │  Database    │ │   Storage    │
      └────────────┘ └──────────────┘ └──────────────┘
```

## Application Areas
- Authentication
- Student portal
- Teacher portal
- Admin portal
- Courses
- Enrollment
- Materials
- Announcements
- Assignments
- Submissions
- Grading
- Quizzes
- Results

## Architectural Principle
This is a modular web application, not a microservices project. Keep deployment and development simple unless requirements change.
