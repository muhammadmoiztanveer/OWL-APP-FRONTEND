'use client'

import { useState } from 'react'
import { useUsers, useDeleteUser } from '@/hooks/users/useUsers'
import Breadcrumb from '@/components/common/Breadcrumb'
import UnauthorizedMessage from '@/components/common/UnauthorizedMessage'
import SearchInput from '@/components/common/SearchInput'
import Pagination from '@/components/common/Pagination'
import AccountTypeBadge from '@/components/common/AccountTypeBadge'
import RoleBadge from '@/components/common/RoleBadge'
import { useIsAdmin } from '@/hooks/useIsAdmin'
import { useAuth } from '@/contexts/AuthContext'
import { useHasRole } from '@/hooks/useHasRole'
import UserDetailsModal from '@/components/users/UserDetailsModal'
import UserFormModal from '@/components/users/UserFormModal'
import toast from 'react-hot-toast'

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateString
  }
}

export default function UsersPage() {
  const { user: currentUser, loginAsDoctor } = useAuth()
  const isAdmin = useIsAdmin()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [accountTypeFilter, setAccountTypeFilter] = useState<'admin' | 'doctor' | 'patient' | 'user' | ''>('')
  const [sortBy, setSortBy] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingUser, setEditingUser] = useState<number | null>(null)
  const [viewingUser, setViewingUser] = useState<number | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const { data, isLoading, error } = useUsers({
    page: currentPage,
    per_page: 15,
    search: searchTerm || undefined,
    account_type: (accountTypeFilter as 'admin' | 'doctor' | 'patient' | 'user') || undefined,
    sort_by: sortBy || undefined,
    sort_order: sortOrder,
  })
  const dataTyped = data as any
  const deleteMutation = useDeleteUser()

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id)
      setDeleteConfirm(null)
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  if (!isAdmin) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Users" />
        <UnauthorizedMessage message="You must be an administrator to access user management." />
      </>
    )
  }

  if (error && (error as any).response?.status === 403) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Users" />
        <UnauthorizedMessage message="You do not have permission to view users." />
      </>
    )
  }

  return (
    <>
      <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Users" />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="card-title mb-0">User Management</h4>
                  <p className="text-muted mb-0">Manage system users and their access.</p>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <SearchInput
                    placeholder="Search by name or email..."
                    onSearch={handleSearch}
                    className="w-100"
                  />
                </div>
                <div className="col-md-3">
                    <select
                      className="form-select"
                      value={accountTypeFilter}
                      onChange={(e) => {
                        setAccountTypeFilter(e.target.value as 'admin' | 'doctor' | 'patient' | 'user' | '')
                        setCurrentPage(1)
                      }}
                    >
                    <option value="">All Account Types</option>
                    <option value="admin">Admin</option>
                    <option value="doctor">Doctor</option>
                    <option value="patient">Patient</option>
                    <option value="user">User</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <button
                    className="btn btn-secondary w-100"
                    onClick={() => {
                      setSearchTerm('')
                      setAccountTypeFilter('')
                      setSortBy('')
                      setSortOrder('desc')
                      setCurrentPage(1)
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (dataTyped as any) && (dataTyped as any).data && (dataTyped as any).data.length > 0 ? (
                <>
                  <div className="table-responsive">
                    <table className="table table-striped table-nowrap align-middle mb-0">
                      <thead>
                        <tr>
                          <th>
                            <button
                              className="btn btn-link p-0 text-decoration-none"
                              onClick={() => handleSort('name')}
                            >
                              Name
                              {sortBy === 'name' && (
                                <i className={`mdi mdi-arrow-${sortOrder === 'asc' ? 'up' : 'down'} ms-1`}></i>
                              )}
                            </button>
                          </th>
                          <th>
                            <button
                              className="btn btn-link p-0 text-decoration-none"
                              onClick={() => handleSort('email')}
                            >
                              Email
                              {sortBy === 'email' && (
                                <i className={`mdi mdi-arrow-${sortOrder === 'asc' ? 'up' : 'down'} ms-1`}></i>
                              )}
                            </button>
                          </th>
                          {/* <th>Account Type</th> */}
                          <th>Roles</th>
                          <th>
                            <button
                              className="btn btn-link p-0 text-decoration-none"
                              onClick={() => handleSort('created_at')}
                            >
                              Created Date
                              {sortBy === 'created_at' && (
                                <i className={`mdi mdi-arrow-${sortOrder === 'asc' ? 'up' : 'down'} ms-1`}></i>
                              )}
                            </button>
                          </th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(dataTyped as any).data.map((user: any) => {
                          const isOwnAccount = currentUser?.id === user.id
                          return (
                            <tr key={user.id}>
                              <td>{user.name}</td>
                              <td>{user.email}</td>
                              {/* <td>
                                <AccountTypeBadge accountType={user.account_type} />
                              </td> */}
                              <td>
                                {user.roles && user.roles.length > 0 ? (
                                  <div className="d-flex flex-wrap gap-1">
                                    {user.roles.map((role: any) => (
                                      <RoleBadge key={role.id} role={role} />
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-muted">-</span>
                                )}
                              </td>
                              <td>{formatDate(user.created_at)}</td>
                              <td>
                                <div className="d-flex gap-2">
                                  <button
                                    className="btn btn-sm btn-info"
                                    onClick={() => setViewingUser(user.id)}
                                    title="View Details"
                                  >
                                    <i className="mdi mdi-eye"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => setEditingUser(user.id)}
                                    title="Edit"
                                  >
                                    <i className="mdi mdi-pencil"></i>
                                  </button>
                                  {isAdmin && user.account_type === 'doctor' && (
                                    <button
                                      className="btn btn-sm btn-success"
                                      onClick={async () => {
                                        try {
                                          await loginAsDoctor(user.id)
                                        } catch (error) {
                                          // Error handled by loginAsDoctor
                                        }
                                      }}
                                      title="Login as this doctor"
                                    >
                                      <i className="mdi mdi-account-switch"></i>
                                    </button>
                                  )}
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => setDeleteConfirm(user.id)}
                                    disabled={isOwnAccount}
                                    title={isOwnAccount ? "You cannot delete your own account" : "Delete"}
                                  >
                                    <i className="mdi mdi-delete"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {(dataTyped as any).meta && (dataTyped as any).links && (
                    <div className="mt-3">
                      <Pagination
                        meta={(dataTyped as any).meta}
                        links={(dataTyped as any).links}
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-5">
                  <i className="uil-users font-size-48 text-muted"></i>
                  <p className="text-muted mt-3">No users found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {viewingUser && (
        <UserDetailsModal
          userId={viewingUser}
          onClose={() => setViewingUser(null)}
          onEdit={() => {
            setViewingUser(null)
            setEditingUser(viewingUser)
          }}
        />
      )}

      {/* Edit Modal */}
      {editingUser && (
        <UserFormModal
          userId={editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={() => {
            setEditingUser(null)
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDeleteConfirm(null)}
                  disabled={deleteMutation.isPending}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this user? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeleteConfirm(null)}
                  disabled={deleteMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

