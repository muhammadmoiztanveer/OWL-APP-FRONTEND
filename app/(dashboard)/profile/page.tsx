'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Breadcrumb from '@/components/common/Breadcrumb'

export default function ProfilePage() {
  const { user, refreshProfile, loading } = useAuth()
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (user) {
      refreshProfile()
    }
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await refreshProfile()
    setRefreshing(false)
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <Breadcrumb pagetitle="Pages" title="Profile" />
      <div className="row">
        <div className="col-xl-4">
          <div className="card">
            <div className="card-body">
              <div className="text-center">
                <div className="avatar-md mx-auto mb-4">
                  <div className="avatar-title bg-primary bg-soft text-primary rounded-circle font-size-24">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </div>
                <h5 className="font-size-16 mb-1">{user?.name}</h5>
                <p className="text-muted">{user?.email}</p>
              </div>

              <div className="mt-4">
                <button
                  className="btn btn-primary w-100"
                  onClick={handleRefresh}
                  disabled={refreshing}
                >
                  {refreshing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Refreshing...
                    </>
                  ) : (
                    'Refresh Profile'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-8">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-4">Personal Information</h4>

              <div className="table-responsive">
                <table className="table table-nowrap mb-0">
                  <tbody>
                    <tr>
                      <th scope="row">ID:</th>
                      <td>{user?.id}</td>
                    </tr>
                    <tr>
                      <th scope="row">Name:</th>
                      <td>{user?.name}</td>
                    </tr>
                    <tr>
                      <th scope="row">Email:</th>
                      <td>{user?.email}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-4">Roles</h4>
              {user?.roles && user.roles.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {user.roles.map((role) => (
                    <span key={role.id} className="badge bg-primary">
                      {role.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted mb-0">No roles assigned</p>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-4">Permissions</h4>
              {user?.permissions && user.permissions.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {user.permissions.map((permission) => (
                    <span key={permission.id} className="badge bg-success">
                      {permission.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted mb-0">No permissions assigned</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

