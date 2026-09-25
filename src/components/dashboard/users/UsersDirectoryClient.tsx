'use client'

import { useState } from 'react'
import { Profile, UserRole } from '@/types'
import { updateUserRole, deleteUser } from '@/app/dashboard/users/actions'
import { RoleBadge } from '@/components/dashboard/RoleBadge'
import {
  Users,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Search,
  Trash2,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  UserCheck
} from 'lucide-react'

interface UsersDirectoryClientProps {
  users: Profile[]
  currentAdminId: string
}

export function UsersDirectoryClient({ users, currentAdminId }: UsersDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<'all' | UserRole>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Counts
  const totalUsers = users.length
  const studentCount = users.filter((u) => u.role === 'student').length
  const teacherCount = users.filter((u) => u.role === 'teacher').length
  const adminCount = users.filter((u) => u.role === 'admin').length

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = filterRole === 'all' || u.role === filterRole
    return matchesSearch && matchesRole
  })

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setUpdatingId(userId)
    setError(null)
    setSuccessMessage(null)

    try {
      const res = await updateUserRole(userId, newRole)
      if (res.error) {
        setError(res.error)
      } else {
        setSuccessMessage(`User role successfully changed to ${newRole}.`)
        setTimeout(() => setSuccessMessage(null), 3000)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update role')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to permanently delete the account for ${userEmail}? This will remove all their enrollments and submissions.`)) {
      return
    }

    setDeletingId(userId)
    setError(null)
    try {
      const res = await deleteUser(userId)
      if (res.error) {
        setError(res.error)
      } else {
        setSuccessMessage('Account deleted successfully.')
        setTimeout(() => setSuccessMessage(null), 3000)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete user')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs">
            <Users className="h-5 w-5" />
          </div>
          Institution User Management Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Oversee student and instructor accounts, change permission roles, and provision faculty access
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Users</span>
            <Users className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{totalUsers}</div>
          <div className="mt-1 text-[11px] text-slate-400">All registered profiles</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-600">Students</span>
            <GraduationCap className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-blue-600">{studentCount}</div>
          <div className="mt-1 text-[11px] text-blue-700/70">Enrolled learners</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600">Faculty</span>
            <Briefcase className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600">{teacherCount}</div>
          <div className="mt-1 text-[11px] text-emerald-700/70">Instructors & Teachers</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-600">Admins</span>
            <ShieldCheck className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-purple-600">{adminCount}</div>
          <div className="mt-1 text-[11px] text-purple-700/70">System oversight</div>
        </div>
      </div>

      {/* Toolbar: Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterRole('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              filterRole === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Roles ({totalUsers})
          </button>
          <button
            onClick={() => setFilterRole('student')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              filterRole === 'student'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Students ({studentCount})
          </button>
          <button
            onClick={() => setFilterRole('teacher')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              filterRole === 'teacher'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Faculty ({teacherCount})
          </button>
          <button
            onClick={() => setFilterRole('admin')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              filterRole === 'admin'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Admins ({adminCount})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Current Role</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-center">Change Role</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                    No users match your current search or filter.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrentAdmin = u.id === currentAdminId
                  const initials = (u.full_name || u.email || 'U')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 text-xs">
                            {initials}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              {u.full_name || 'Academic User'}
                              {isCurrentAdmin && (
                                <span className="rounded bg-slate-200 px-1.5 py-0.2 text-[10px] text-slate-700 font-normal">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <RoleBadge role={u.role} />
                      </td>

                      <td className="py-3 px-4 text-slate-500">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>

                      {/* Role selection dropdown */}
                      <td className="py-3 px-4 text-center">
                        {isCurrentAdmin ? (
                          <span className="text-slate-400 text-[11px] italic">Protected</span>
                        ) : (
                          <select
                            value={u.role}
                            disabled={updatingId === u.id}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 focus:border-purple-500 focus:outline-hidden disabled:opacity-50 cursor-pointer"
                          >
                            <option value="student">Student (Learner)</option>
                            <option value="teacher">Teacher (Faculty)</option>
                            <option value="admin">Administrator</option>
                          </select>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        {!isCurrentAdmin && (
                          <button
                            onClick={() => handleDelete(u.id, u.email || 'User')}
                            disabled={deletingId === u.id}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-slate-500 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition disabled:opacity-50"
                            title="Delete user account"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
