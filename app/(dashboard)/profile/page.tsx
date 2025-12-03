'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Breadcrumb from '@/components/common/Breadcrumb'

export default function ProfilePage() {
  const { user, refreshProfile, loading } = useAuth()
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (user) {
      // Initial refresh on mount to ensure latest data
      refreshProfile().catch(() => {
        // Error handled by AuthContext
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty array - only run once on mount when user exists

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
                      title="Refresh your profile and permissions to get the latest updates"
                    >
                      {refreshing ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Refreshing...
                        </>
                      ) : (
                        <>
                          <i className="mdi mdi-refresh me-2"></i>
                          Refresh Profile & Permissions
                        </>
                      )}
                    </button>
                    <p className="text-muted small mt-2 mb-0">
                      Click to refresh your profile and permissions. Use this if your permissions were recently updated by an admin.
                    </p>
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
                    <tr>
                      <th scope="row">Account Type:</th>
                      <td className="text-capitalize">{user?.account_type || 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

