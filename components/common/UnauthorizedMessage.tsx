'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

interface UnauthorizedMessageProps {
  message?: string
}

export default function UnauthorizedMessage({ message = "You don't have permission to access this resource." }: UnauthorizedMessageProps) {
  const { refreshProfile } = useAuth()
  const [refreshing, setRefreshing] = React.useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await refreshProfile()
      // Reload page after a short delay to show updated permissions
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      console.error('Error refreshing permissions:', error)
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
      <div className="text-center">
        <i className="mdi mdi-shield-off-outline font-size-64 text-danger mb-3"></i>
        <h4 className="text-danger mb-2">Access Denied</h4>
        <p className="text-muted mb-4">
          {message}
          <br />
          <small className="text-muted">
            If your permissions were recently updated by an administrator, please refresh your permissions.
          </small>
        </p>
        <div className="d-flex gap-2 justify-content-center">
          <button
            className="btn btn-primary"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Refreshing...
              </>
            ) : (
              <>
                <i className="mdi mdi-refresh me-2"></i>
                Refresh Permissions
              </>
            )}
          </button>
          <Link href="/dashboard" className="btn btn-secondary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

