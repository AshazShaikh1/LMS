# Academic Learning Management System (LMS)

A modern, high-performance, academic Learning Management System built strictly to deliver a unified portal for Students, Faculty Instructors, and Administrators.

---

## 🏛️ System Architecture & Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) with React 19 and Turbopack
- **Language**: TypeScript (strict mode, zero build warnings)
- **Styling**: Tailwind CSS with mobile-first responsive touch targets
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL 15+, Supabase Auth, Row-Level Security)
- **Storage**: Supabase Storage with encrypted private buckets and secure 1-hour signed download URLs
- **Design Philosophy**: High aesthetics, dark-mode accents, glassmorphic UI, responsive sidebars, zero-dependency simplicity.

---

## 🚀 Key Feature Catalog

### 1. Role-Based Access Control (RBAC)
- **Students**: Self-service registration, browse course catalog, 1-click enrollment, view lecture materials, track notices, submit assignments (up to 25 MB), take interactive MCQ quizzes, and inspect letter grades / GPA.
- **Faculty / Instructors**: Course creation & curriculum syllabus management, upload lecture notes/PDFs, issue urgent announcements, publish coursework with deadlines, grade submissions with marks & written feedback, author multiple-choice quizzes with automated evaluation.
- **Administrators**: Global user directory oversight, promote/demote user roles (Student ⇄ Teacher ⇄ Admin), curriculum course oversight, database security status audits.

### 2. Learning Modules
| Module | Features |
|---|---|
| **Authentication** | Supabase Auth with automated profile provisioning trigger and role assignment |
| **Courses & Catalog** | Multi-category browsing, student roster inspection, enrollment tracking |
| **Course Materials** | Private encrypted storage (`course-materials`), file-size validation (25 MB), time-limited signed URLs |
| **Announcements** | Central noticeboard feed, pinned course bulletins, real-time unread badges |
| **Assignments** | Deadline countdowns, student file uploads, on-time vs late indicators, resubmission |
| **Grading & GPA** | Cumulative GPA (4.0 scale), percentage calculations, letter badges (A+, A, B, etc.), teacher feedback notes |
| **Quizzes** | Timed and untimed MCQ quizzes, instant automated scoring, question-by-question review |
| **User Directory** | Administrative role promotion, account deletion, user searching and filtering |

---

## 🔒 Security & Row-Level Security (RLS)

Every table in PostgreSQL is protected by strict Row-Level Security:
- `profiles`: Users can view all profiles; users edit own profile; admins manage all.
- `courses`: Authenticated users browse; instructors edit own; admins oversee all.
- `enrollments`: Students enroll/unenroll; instructors view student rosters.
- `materials`: Only enrolled students and instructors can download signed files.
- `announcements`: Enrolled students view; course instructors publish/delete.
- `assignments`: Enrolled students view; instructors publish/manage.
- `submissions`: Enrolled students submit and view own; instructors view and grade.
- `quizzes`: Enrolled students view and attempt; instructors author questions.
- `quiz_attempts`: Students attempt once and view own results; instructors review metrics.

---

## 🛠️ Getting Started Locally

### Prerequisites
- Node.js 18+ (tested on Node v20/v24)
- npm or yarn

### 1. Clone & Install
```bash
git clone https://github.com/AshazShaikh1/LMS.git
cd LMS
npm install
```

### 2. Configure Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🌐 Deploy to Vercel

1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com/), click **Add New** > **Project** and import `AshazShaikh1/LMS`.
3. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**. Vercel will build and deploy the application automatically.
