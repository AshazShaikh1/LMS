import { UserRole } from '@/types'

interface RoleBadgeProps {
  role: UserRole
  className?: string
}

export function RoleBadge({ role, className = '' }: RoleBadgeProps) {
  const styles: Record<UserRole, string> = {
    student: 'bg-blue-100 text-blue-800 border-blue-200',
    teacher: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    admin: 'bg-purple-100 text-purple-800 border-purple-200',
  }

  const labels: Record<UserRole, string> = {
    student: 'Student',
    teacher: 'Teacher',
    admin: 'Admin',
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${styles[role] || 'bg-gray-100 text-gray-800 border-gray-200'} ${className}`}
    >
      {labels[role] || role}
    </span>
  )
}
