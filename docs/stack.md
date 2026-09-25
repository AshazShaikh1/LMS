# LMS — Technology Stack

## Primary Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend / Platform
- Supabase

### Database
- Supabase PostgreSQL

### Authentication
- Supabase Auth

### File Storage
- Supabase Storage

### Deployment
- Next.js-compatible hosting
- Supabase hosted backend

## Architecture

```text
Browser
  |
  v
Next.js + React + TypeScript + Tailwind
  |
  +---- Supabase Auth
  |
  +---- Supabase Database (PostgreSQL)
  |
  +---- Supabase Storage
```

## Important Decision
The original project document mentions HTML/CSS/JavaScript + Bootstrap + Flask + MySQL in its feasibility section. The updated implementation uses Next.js + Tailwind CSS + Supabase instead.

Do not introduce Flask, PHP, MongoDB, Redis, microservices, or an API gateway unless a later requirement explicitly requires them.

## Principles
- Prefer simple architecture over unnecessary infrastructure.
- Use Supabase features directly where appropriate.
- Use TypeScript throughout application code.
- Keep database access secure with Supabase Row Level Security.
- Do not expose service-role credentials to the browser.
