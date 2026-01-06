'use client'

import { useParams, useRouter } from 'next/navigation'
import { useAuditLog } from '@/hooks/auditLogs/useAuditLogs'
import Breadcrumb from '@/components/common/Breadcrumb'
import ActionBadge from '@/components/common/ActionBadge'
import AuditLogStatusBadge from '@/components/common/AuditLogStatusBadge'
import PhiAccessBadge from '@/components/common/PhiAccessBadge'
import { usePermissions } from '@/hooks/usePermissions'
import UnauthorizedMessage from '@/components/common/UnauthorizedMessage'
import Link from 'next/link'

const formatDateTime = (dateString: string | undefined) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  } catch {
    return dateString
  }
}

const getUserInitials = (name: string | undefined) => {
  if (!name) return 'N/A'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

export default function AuditLogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAdmin } = usePermissions()
  const auditLogId = parseInt(params.id as string)
  const { data: log, isLoading, error } = useAuditLog(auditLogId)
  const logData = log as any

  // Check if user is admin
  if (!isAdmin) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Audit Log Details" />
        <UnauthorizedMessage message="You do not have permission to view audit logs. Admin access required." />
      </>
    )
  }

  if (isLoading) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Audit Log Details" />
        <div className="row">
          <div className="col-12">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (error || !log) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Audit Log Details" />
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger">
              <i className="mdi mdi-alert-circle me-2"></i>
              Failed to load audit logData. It may not exist or you may not have permission to view it.
            </div>
            <Link href="/admin/audit-logs" className="btn btn-outline-primary">
              <i className="mdi mdi-arrow-left me-1"></i> Back to Audit Logs
            </Link>
          </div>
        </div>
      </>
    )
  }

  const getResourceLink = () => {
    if (!logData.resource_type || !logData.resource_id) return null

    const resourceRoutes: Record<string, string> = {
      Patient: `/doctor/patients/${logData.resource_id}`,
      Assessment: `/doctor/assessments/${logData.resource_id}`,
      Invoice: `/billing/invoices/${logData.resource_id}`,
      Payment: `/billing/payments`,
      User: `/users/${logData.resource_id}`,
    }

    return resourceRoutes[logData.resource_type] || null
  }

  const resourceLink = getResourceLink()

  return (
    <>
      <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Audit Log Details" />

      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Link href="/admin/audit-logs" className="btn btn-outline-primary">
              <i className="mdi mdi-arrow-left me-1"></i> Back to Audit Logs
            </Link>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Basic Information */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-4">Basic Information</h5>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label text-muted">Timestamp</label>
                  <div className="fw-medium">{formatDateTime(logData.created_at)}</div>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted">Status</label>
                  <div>
                    <AuditLogStatusBadge status={logData.status} />
                  </div>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label text-muted">User</label>
                  <div>
                    {logData.user ? (
                      <div className="d-flex align-items-center">
                        <div
                          className="avatar-xs me-2"
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: 'bold',
                          }}
                        >
                          {getUserInitials(logData.user.name)}
                        </div>
                        <div>
                          <div className="fw-medium">{logData.user.name}</div>
                          <small className="text-muted">{logData.user.email}</small>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted">System</span>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted">Action</label>
                  <div>
                    <ActionBadge action={logData.action} />
                    {logData.action_label && (
                      <div className="text-muted small mt-1">{logData.action_label}</div>
                    )}
                  </div>
                </div>
              </div>
              {logData.description && (
                <div className="row mb-3">
                  <div className="col-12">
                    <label className="form-label text-muted">Description</label>
                    <div>{logData.description}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resource Information */}
          <div className="card mt-3">
            <div className="card-body">
              <h5 className="card-title mb-4">Resource Information</h5>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label text-muted">Resource Type</label>
                  <div className="fw-medium">{logData.resource_type || '-'}</div>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted">Resource ID</label>
                  <div className="fw-medium">{logData.resource_id || '-'}</div>
                </div>
              </div>
              {logData.resource_identifier && (
                <div className="row mb-3">
                  <div className="col-12">
                    <label className="form-label text-muted">Resource Identifier</label>
                    <div className="fw-medium">{logData.resource_identifier}</div>
                  </div>
                </div>
              )}
              <div className="row mb-3">
                <div className="col-12">
                  <label className="form-label text-muted">PHI Access</label>
                  <div>
                    <PhiAccessBadge isPhiAccess={logData.is_phi_access} />
                  </div>
                </div>
              </div>
              {resourceLink && (
                <div className="row">
                  <div className="col-12">
                    <Link href={resourceLink} className="btn btn-sm btn-outline-primary">
                      <i className="mdi mdi-open-in-new me-1"></i> View Resource
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Request Details */}
          <div className="card mt-3">
            <div className="card-body">
              <h5 className="card-title mb-4">Request Details</h5>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label text-muted">HTTP Method</label>
                  <div>
                    <span className="badge bg-info-subtle text-info">{logData.http_method || '-'}</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted">Route</label>
                  <div className="fw-medium">{logData.route || '-'}</div>
                </div>
              </div>
              {logData.endpoint && (
                <div className="row mb-3">
                  <div className="col-12">
                    <label className="form-label text-muted">Endpoint</label>
                    <div>
                      <code className="text-muted">{logData.endpoint}</code>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Error Information */}
          {logData.status !== 'success' && logData.error_message && (
            <div className="card mt-3 border-danger">
              <div className="card-body">
                <h5 className="card-title mb-4 text-danger">Error Information</h5>
                <div className="alert alert-danger mb-0">
                  <strong>Error Message:</strong>
                  <pre className="mb-0 mt-2" style={{ whiteSpace: 'pre-wrap' }}>
                    {logData.error_message}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          {/* Device Information */}
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-4">Device Information</h5>
              <div className="mb-3">
                <label className="form-label text-muted">IP Address</label>
                <div>
                  <code className="text-muted">{logData.ip_address || '-'}</code>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label text-muted">Device Type</label>
                <div className="fw-medium text-capitalize">{logData.device_type || '-'}</div>
              </div>
              <div className="mb-3">
                <label className="form-label text-muted">Browser</label>
                <div className="fw-medium">{logData.browser || '-'}</div>
              </div>
              <div className="mb-3">
                <label className="form-label text-muted">Platform</label>
                <div className="fw-medium">{logData.platform || '-'}</div>
              </div>
              {logData.user_agent && (
                <div className="mb-3">
                  <label className="form-label text-muted">User Agent</label>
                  <div>
                    <code className="text-muted small" style={{ wordBreak: 'break-all' }}>
                      {logData.user_agent}
                    </code>
                  </div>
                </div>
              )}
              {logData.session_id && (
                <div className="mb-3">
                  <label className="form-label text-muted">Session ID</label>
                  <div>
                    <code className="text-muted small">{logData.session_id}</code>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          {logData.metadata && Object.keys(logData.metadata).length > 0 && (
            <div className="card mt-3">
              <div className="card-body">
                <h5 className="card-title mb-4">Metadata</h5>
                <pre
                  className="bg-light p-3 rounded"
                  style={{
                    fontSize: '12px',
                    maxHeight: '400px',
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {JSON.stringify(logData.metadata, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

