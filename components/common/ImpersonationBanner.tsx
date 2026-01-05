'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function ImpersonationBanner() {
  const { isImpersonating, impersonatingUser, stopImpersonating } = useAuth()

  if (!isImpersonating || !impersonatingUser) {
    return null
  }

  return (
    <div className="alert alert-warning alert-dismissible fade show mb-0" role="alert">
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <i className="mdi mdi-alert-circle-outline me-2 fs-5"></i>
          <div>
            <strong>Impersonating:</strong>{' '}
            <span className="fw-semibold">{impersonatingUser.name}</span>
            {impersonatingUser.email && (
              <span className="text-muted ms-2">({impersonatingUser.email})</span>
            )}
          </div>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-warning ms-3"
          onClick={() => stopImpersonating()}
        >
          <i className="mdi mdi-arrow-left me-1"></i>
          Stop Impersonating
        </button>
      </div>
    </div>
  )
}



