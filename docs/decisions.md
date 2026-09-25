# LMS — Architecture Decisions

## Decision 1: Next.js instead of plain HTML
Use Next.js because the project requires multiple authenticated dashboards, reusable components, routing, server-side capabilities, and a maintainable React application.

## Decision 2: Tailwind instead of Bootstrap
Use Tailwind CSS for consistent custom UI and easier component-level styling.

## Decision 3: Supabase instead of a separate Flask + MySQL backend
Use Supabase to reduce infrastructure complexity by providing PostgreSQL, authentication, storage, and database APIs in one platform.

## Decision 4: No Microservices
The academic project does not need microservices, Redis, message queues, or an API gateway. A modular monolithic Next.js application is sufficient.

## Decision 5: Documentation Must Match Implementation
The project documentation should describe the actual implemented architecture. Do not claim services or technologies that are not actually used.
