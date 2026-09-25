import { Metadata } from 'next'
import {
  BookOpen,
  GraduationCap,
  Users,
  ShieldCheck,
  FileText,
  HelpCircle,
  Award,
  Bell,
  CheckCircle2,
  FolderArchive,
  ArrowRight,
  HelpCircle as QuestionIcon,
  MessageSquare,
  Sparkles,
  Smartphone,
  Lock
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'LMS Project Guide & Viva Preparation',
  description: 'Comprehensive, non-technical explanation of the entire Learning Management System for academic viva and project presentation.',
}

export default function VivaGuidePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white pb-20">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white border-b border-indigo-900/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 text-xs font-semibold text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" />
            Complete Viva &amp; Presentation Cheat Sheet
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Academic Learning Management System (LMS)
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            This guide explains everything about your website in simple, everyday language. No confusing coding terms! Read this to easily explain what your project does and confidently answer any questions in your viva.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Quick Summary Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            What is this website in 1 sentence?
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            &ldquo;<strong>This is a modern college website where Students can enroll in subjects, download lecture notes, submit homework, take online quizzes, and see their report card, while Teachers upload study notes, give assignments, and grade students, and Administrators manage the whole college.</strong>&rdquo;
          </p>
        </div>

        {/* Section 1: The 3 Roles */}
        <div className="mt-10 space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="h-6 w-6 text-indigo-600" />
              1. The 3 User Roles (Who Uses the App?)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              There are three distinct types of accounts in this system. Each one sees a different screen tailored to their needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Student Card */}
            <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-blue-700">
                <GraduationCap className="h-6 w-6" />
                <h3 className="font-bold text-base">Student (Learner)</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Any student can sign up on their phone or laptop.
              </p>
              <div className="text-xs text-slate-700 space-y-1.5 pt-1">
                <div className="font-semibold text-slate-900">What a Student Can Do:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                  <li>Browse available college courses.</li>
                  <li>Click 1 button to enroll in any course.</li>
                  <li>Download lecture notes, slides, and PDFs.</li>
                  <li>Read announcements sent by teachers.</li>
                  <li>Upload homework and assignments (PDF/Word/ZIP).</li>
                  <li>Take online multiple-choice quizzes with instant scores.</li>
                  <li>View report card with grades (A+, A, B) and GPA.</li>
                  <li>Read personalized teacher feedback comments.</li>
                </ul>
              </div>
            </div>

            {/* Teacher Card */}
            <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-emerald-700">
                <Users className="h-6 w-6" />
                <h3 className="font-bold text-base">Teacher (Faculty)</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Teachers are appointed exclusively by College Administrators.
              </p>
              <div className="text-xs text-slate-700 space-y-1.5 pt-1">
                <div className="font-semibold text-slate-900">What a Teacher Can Do:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                  <li>Create new subjects and write the syllabus.</li>
                  <li>Upload lecture notes, textbooks, and PDF study guides.</li>
                  <li>Post notices and urgent alerts to the class.</li>
                  <li>Create homework tasks with due dates and max marks.</li>
                  <li>View and download submitted student assignments.</li>
                  <li>Check if a student submitted on time or late.</li>
                  <li>Give marks (e.g. 95/100) and write feedback notes.</li>
                  <li>Create online multiple-choice quizzes with timers.</li>
                  <li>View the full class gradebook sheet.</li>
                </ul>
              </div>
            </div>

            {/* Admin Card */}
            <div className="rounded-2xl border border-purple-200 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-purple-700">
                <ShieldCheck className="h-6 w-6" />
                <h3 className="font-bold text-base">Administrator</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                The Principal or IT head with complete system control.
              </p>
              <div className="text-xs text-slate-700 space-y-1.5 pt-1">
                <div className="font-semibold text-slate-900">What an Admin Can Do:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                  <li>See total registered students, faculty, and subjects.</li>
                  <li>Access the complete User Directory.</li>
                  <li>Promote any student to a Teacher or Admin.</li>
                  <li>Delete or deactivate accounts.</li>
                  <li>Edit or oversee any course across the entire college.</li>
                  <li>Inspect system security and database safety rules.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Every Page / Route Explained */}
        <div className="mt-12 space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FolderArchive className="h-6 w-6 text-indigo-600" />
              2. Every Page &amp; Screen Explained (URL by URL)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              If the examiner asks &ldquo;What happens on this page?&rdquo;, find the URL below to explain it.
            </p>
          </div>

          <div className="space-y-4">
            {/* Page 1: Landing */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-1 rounded">
                  URL: /
                </span>
                <span className="text-xs font-semibold text-indigo-600">Home Page</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Main Welcome &amp; Landing Page</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The front door of your website. It has a modern dark-blue hero banner, highlights key features for Students and Teachers, and has big buttons to <strong>Log In</strong> or <strong>Register</strong>. It is completely optimized for smartphones so it looks beautiful on mobile screens.
              </p>
            </div>

            {/* Page 2: Auth */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-1 rounded">
                  URL: /login &amp; /register
                </span>
                <span className="text-xs font-semibold text-indigo-600">Security</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Sign In &amp; Student Registration</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Students create their account here using their name, email, and password. The system checks passwords securely, shows clear error messages if credentials are wrong, and automatically sends users to their personalized dashboard once logged in.
              </p>
            </div>

            {/* Page 3: Dashboard Home */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-1 rounded">
                  URL: /dashboard
                </span>
                <span className="text-xs font-semibold text-indigo-600">Personal Command Center</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Role-Based Dashboard</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The home screen adapts based on who is logged in:
              </p>
              <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 pl-2">
                <li><strong>For Students:</strong> Shows live numbers for Enrolled Courses, Pending Homework due soon, Unread Notices, and Cumulative GPA.</li>
                <li><strong>For Teachers:</strong> Shows Active Courses, Homework Submissions Awaiting Grading, Enrolled Students count, and Active Quizzes.</li>
                <li><strong>For Admins:</strong> Shows Registered Students, Verified Faculty, Total Subjects, and recent user signups.</li>
              </ul>
            </div>

            {/* Page 4: Courses */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-1 rounded">
                  URL: /dashboard/courses
                </span>
                <span className="text-xs font-semibold text-indigo-600">Academic Catalog</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Course Catalog &amp; Enrollment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lists all academic subjects available in the college (e.g. Computer Science, Mathematics). Students can search or filter by category and click <strong>Enroll</strong> or <strong>Leave Course</strong>. Teachers can click <strong>New Course</strong> to create a new subject.
              </p>
            </div>

            {/* Page 5: Course Detail Hub */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-1 rounded">
                  URL: /dashboard/courses/[id]
                </span>
                <span className="text-xs font-semibold text-indigo-600">Classroom Hub</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Inside a Course Classroom</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                This is the actual online classroom for a subject. Everything about that course is grouped here in 4 sections:
              </p>
              <ol className="list-decimal list-inside text-xs text-slate-600 space-y-1 pl-2">
                <li><strong>Syllabus:</strong> Course summary and teacher contact info.</li>
                <li><strong>Noticeboard:</strong> Class announcements and exam reminders.</li>
                <li><strong>Study Materials:</strong> Downloadable PDF slides and documents.</li>
                <li><strong>Coursework &amp; Quizzes:</strong> Homework tasks to upload and MCQ quizzes to take.</li>
              </ol>
            </div>

            {/* Page 6: Materials */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-1 rounded">
                  URL: /dashboard/materials
                </span>
                <span className="text-xs font-semibold text-indigo-600">Digital Library</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Study Materials &amp; Lecture Notes</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                A central repository of all study resources across enrolled subjects. Files are stored securely. When a student clicks Download, the system generates a secure link valid for 1 hour so files cannot be stolen by outsiders.
              </p>
            </div>

            {/* Page 7: Announcements */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-1 rounded">
                  URL: /dashboard/announcements
                </span>
                <span className="text-xs font-semibold text-indigo-600">Noticeboard</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Campus Noticeboard Feed</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                A unified social-feed style noticeboard where students can read all announcements posted by their instructors, sorted chronologically with teacher names and timestamps.
              </p>
            </div>

            {/* Page 8: Assignments */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-1 rounded">
                  URL: /dashboard/assignments
                </span>
                <span className="text-xs font-semibold text-indigo-600">Homework Hub</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Assignments &amp; Submissions</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Students see homework due dates, max marks, and upload their files (up to 25 MB). If a student submits after the due date, it automatically tags the submission as <strong>Late</strong> so teachers know. Teachers can view all student submissions and download them with one click.
              </p>
            </div>

            {/* Page 9: Grades */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-1 rounded">
                  URL: /dashboard/grades
                </span>
                <span className="text-xs font-semibold text-indigo-600">Academic Standing</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Report Cards &amp; Teacher Gradebook</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>For Students:</strong> A complete report card showing their overall GPA on a 4.0 scale, letter grades (like A+, A, B, C), marks scored, and teacher written feedback.
                <br />
                <strong>For Teachers:</strong> A full class gradebook matrix where teachers can review all students side-by-side, input marks, and update evaluations.
              </p>
            </div>

            {/* Page 10: Quizzes */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-1 rounded">
                  URL: /dashboard/quizzes
                </span>
                <span className="text-xs font-semibold text-indigo-600">Online Exams</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Online Multiple-Choice Quizzes</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Students can click <strong>Take Quiz</strong> to open an interactive test. They answer questions with radio buttons, submit their test, and immediately see their score, whether they <strong>Passed</strong> or <strong>Failed</strong>, and a question-by-question review highlighting what they got right and wrong!
              </p>
            </div>

            {/* Page 11: Users (Admin) */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-1 rounded">
                  URL: /dashboard/users
                </span>
                <span className="text-xs font-semibold text-purple-600">Admin Only</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">User Directory &amp; Role Management</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Administrators can see every account in the college, search by email or name, change any student to a Teacher, or delete spam accounts. (Non-admins are automatically blocked from this page).
              </p>
            </div>

            {/* Page 12: Settings (Admin) */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-1 rounded">
                  URL: /dashboard/settings
                </span>
                <span className="text-xs font-semibold text-purple-600">Admin Only</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Security &amp; System Health</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Displays real-time database counts (total users, subjects, assignments, quizzes) and confirms that database security rules and file encryption are operating properly.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Top 10 Viva Questions & Exact Answers */}
        <div className="mt-12 space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <QuestionIcon className="h-6 w-6 text-indigo-600" />
              3. Top 10 Viva Questions &amp; Word-for-Word Answers
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Memorize or practice these exact answers. They address the most common questions professors ask during project evaluations.
            </p>
          </div>

          <div className="space-y-4">
            {/* Q1 */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
              <h3 className="font-bold text-sm text-indigo-900 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs">1</span>
                What is the purpose of this project and what problem does it solve?
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed pl-7">
                &ldquo;Our project is an Academic Learning Management System. In many colleges, lecture notes are sent on WhatsApp, homework is submitted by email, and grades are calculated manually on Excel. Our app unifies everything into one secure college website where students, teachers, and admins have dedicated portals to manage classes, assignments, tests, and grades in one place.&rdquo;
              </p>
            </div>

            {/* Q2 */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
              <h3 className="font-bold text-sm text-indigo-900 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs">2</span>
                Can a student access another student&rsquo;s submitted homework?
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed pl-7">
                &ldquo;No. The system uses strict database security called Row-Level Security. A student is only permitted to view and download their own submissions. Only the teacher who instructs that course or the college administrator has permission to view and grade student submissions.&rdquo;
              </p>
            </div>

            {/* Q3 */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
              <h3 className="font-bold text-sm text-indigo-900 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs">3</span>
                How does a teacher grade an assignment?
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed pl-7">
                &ldquo;When students upload homework, the teacher opens the assignment and clicks &lsquo;View Submissions&rsquo;. The teacher can download the student&rsquo;s file, inspect when it was submitted (and see if it was turned in on time or late), click &lsquo;Grade&rsquo;, enter marks out of the maximum score, and type written feedback comments. The student immediately sees their score and feedback in their gradebook.&rdquo;
              </p>
            </div>

            {/* Q4 */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
              <h3 className="font-bold text-sm text-indigo-900 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs">4</span>
                How do online quizzes work in your system?
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed pl-7">
                &ldquo;Teachers can create multiple-choice quizzes with custom questions, options, optional timers, and a passing percentage (e.g. 60%). Enrolled students can take the quiz by choosing radio options. As soon as the student clicks &lsquo;Submit Answers&rsquo;, the computer instantly calculates their score, declares whether they Passed or Failed, and provides a question-by-question review showing the correct answers.&rdquo;
              </p>
            </div>

            {/* Q5 */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
              <h3 className="font-bold text-sm text-indigo-900 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs">5</span>
                How are teacher accounts created? Can anyone register as a teacher?
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed pl-7">
                &ldquo;No, anyone who registers publicly is automatically registered as a Student. To prevent random users from pretending to be teachers, only an Administrator has the authority to promote a user to a Teacher through the User Management Directory.&rdquo;
              </p>
            </div>

            {/* Q6 */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
              <h3 className="font-bold text-sm text-indigo-900 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs">6</span>
                How are files like lecture notes and homework stored safely?
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed pl-7">
                &ldquo;Files are kept in private encrypted storage buckets. The file links are not public. When an authorized student or teacher clicks download, the system verifies their enrollment and creates a temporary signed link that expires after 1 hour, ensuring complete privacy.&rdquo;
              </p>
            </div>

            {/* Q7 */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
              <h3 className="font-bold text-sm text-indigo-900 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs">7</span>
                How does the student report card calculate GPA and letter grades?
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed pl-7">
                &ldquo;The system aggregates all marks earned by the student across their subjects. If a student scores 90% or higher they receive an &lsquo;A+&rsquo; (4.0 GPA), 80-89% receives an &lsquo;A&rsquo; (3.7 GPA), 70-79% is &lsquo;B&rsquo;, and so forth. It calculates both individual subject averages and the student&rsquo;s cumulative semester GPA.&rdquo;
              </p>
            </div>

            {/* Q8 */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
              <h3 className="font-bold text-sm text-indigo-900 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs">8</span>
                What happens if a student tries to visit an Admin page?
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed pl-7">
                &ldquo;The system immediately checks their role on the server before the page loads. If a student attempts to type in &lsquo;/dashboard/users&rsquo;, the website blocks access and redirects them back to the general dashboard.&rdquo;
              </p>
            </div>

            {/* Q9 */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
              <h3 className="font-bold text-sm text-indigo-900 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs">9</span>
                Is the website responsive on mobile phones?
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed pl-7">
                &ldquo;Yes! We specifically optimized the application for mobile devices. Buttons have minimum 44px tap targets for easy touch interaction, the sidebar collapses into a slide-out hamburger menu on phones, and form inputs prevent unwanted screen zoom on iPhones.&rdquo;
              </p>
            </div>

            {/* Q10 */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
              <h3 className="font-bold text-sm text-indigo-900 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs">10</span>
                What technology is used to build this website?
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed pl-7">
                &ldquo;We built the frontend and server using Next.js with React and Tailwind CSS for modern aesthetics, and we used Supabase with PostgreSQL for our database, user authentication, and secure cloud storage.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Live Demo Steps */}
        <div className="mt-12 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-6 space-y-4">
          <h2 className="text-lg font-bold text-indigo-950 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-indigo-600" />
            Quick 3-Minute Live Demonstration Steps (If asked to show the app)
          </h2>
          <ol className="list-decimal list-inside text-xs text-indigo-950/80 space-y-2 leading-relaxed">
            <li>
              <strong>Show Landing Page:</strong> Open <code>/</code>, mention mobile optimization and clean layout.
            </li>
            <li>
              <strong>Log in as Student:</strong> Show student dashboard metrics (GPA, enrolled courses, homework counts).
            </li>
            <li>
              <strong>Open Course &lsquo;CS101&rsquo;:</strong> Show the 4 tabs: Syllabus, Announcements, Downloadable Materials, and Coursework.
            </li>
            <li>
              <strong>Take Quiz 1:</strong> Click &lsquo;Take Quiz&rsquo;, answer the 3 questions, click &lsquo;Submit Answers&rsquo; to demonstrate instant automated scoring and question review!
            </li>
            <li>
              <strong>Upload an Assignment:</strong> Demonstrate uploading a file to Midterm Lab 1.
            </li>
            <li>
              <strong>Check Grades:</strong> Open <code>/dashboard/grades</code> to show report card, GPA, and teacher feedback.
            </li>
            <li>
              <strong>Show Admin Controls:</strong> Open <code>/dashboard/users</code> to demonstrate changing a user&rsquo;s role with 1 click.
            </li>
          </ol>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-xs text-slate-400">
          Academic Learning Management System &bull; Private Viva &amp; Presentation Companion Page
        </div>
      </div>
    </div>
  )
}
