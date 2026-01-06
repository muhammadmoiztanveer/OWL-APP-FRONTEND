'use client'

import { useUser } from '@/hooks/users/useUsers'
import AccountTypeBadge from '@/components/common/AccountTypeBadge'
import RoleBadge from '@/components/common/RoleBadge'
import { useIsAdmin } from '@/hooks/useIsAdmin'

interface UserDetailsModalProps {
  userId: number
  onClose: () => void
  onEdit: () => void
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateString
  }
}

export default function UserDetailsModal({ userId, onClose, onEdit }: UserDetailsModalProps) {
  const { data: user, isLoading } = useUser(userId)
  const userData = user as any
  const isAdmin = useIsAdmin()

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">User Details</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {isLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : userData ? (
              <>
                <div className="mb-4">
                  <h6 className="mb-3">Basic Information</h6>
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <th style={{ width: '30%' }}>ID:</th>
                        <td>{userData.id}</td>
                      </tr>
                      <tr>
                        <th>Name:</th>
                        <td>{userData.name}</td>
                      </tr>
                      <tr>
                        <th>Email:</th>
                        <td>{userData.email}</td>
                      </tr>
                      <tr>
                        <th>Account Type:</th>
                        <td>
                          <AccountTypeBadge accountType={userData.account_type} />
                        </td>
                      </tr>
                      <tr>
                        <th>Email Verified:</th>
                        <td>
                          {userData.email_verified_at ? (
                            <span className="badge bg-success">Verified</span>
                          ) : (
                            <span className="badge bg-warning">Not Verified</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <th>Created Date:</th>
                        <td>{formatDate(userData.created_at)}</td>
                      </tr>
                      <tr>
                        <th>Updated Date:</th>
                        <td>{formatDate(userData.updated_at)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {userData.roles && userData.roles.length > 0 && (
                  <div className="mb-4">
                    <h6 className="mb-3">Roles</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {userData.roles.map((role: any) => (
                        <RoleBadge key={role.id} role={role} />
                      ))}
                    </div>
                  </div>
                )}

                {userData.permissions && userData.permissions.length > 0 && (
                  <div className="mb-4">
                    <h6 className="mb-3">Permissions</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {userData.permissions.map((permission: any) => (
                        <span key={permission.id} className="badge bg-success">
                          {permission.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {userData.doctor && (
                  <div className="mb-4">
                    <h6 className="mb-3">Doctor Profile</h6>
                    <table className="table table-bordered">
                      <tbody>
                        <tr>
                          <th style={{ width: '30%' }}>First Name:</th>
                          <td>{userData.doctor.first_name}</td>
                        </tr>
                        <tr>
                          <th>Last Name:</th>
                          <td>{userData.doctor.last_name}</td>
                        </tr>
                        <tr>
                          <th>Practice Name:</th>
                          <td>{userData.doctor.practice_name || '-'}</td>
                        </tr>
                        <tr>
                          <th>Specialty:</th>
                          <td>{userData.doctor.specialty || '-'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted">No data available</p>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            {isAdmin && (
              <button type="button" className="btn btn-primary" onClick={onEdit}>
                Edit User
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

