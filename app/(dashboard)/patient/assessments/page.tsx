'use client'

import { usePatientAssessments } from '@/hooks/assessments/usePatientAssessments'
import Breadcrumb from '@/components/common/Breadcrumb'
import StatusBadge from '@/components/common/StatusBadge'
import { usePermissions } from '@/hooks/usePermissions'
import { useHasRole } from '@/hooks/useHasRole'
import UnauthorizedMessage from '@/components/common/UnauthorizedMessage'
import Link from 'next/link'
import { Assessment, Severity } from '@/lib/types'

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateString
  }
}

const formatAssessmentType = (type: string): string => {
  if (type === 'PHQ-9') return 'PHQ-9'
  if (type === 'GAD-7') return 'GAD-7'
  if (type === 'comprehensive') return 'Comprehensive'
  return type
}

const getSeverityColor = (severity: Severity | { phq9: Severity; gad7: Severity } | undefined): string => {
  if (!severity) return 'secondary'
  
  if ('level' in severity) {
    const colors: Record<string, string> = {
      minimal: 'success',
      mild: 'info',
      moderate: 'warning',
      moderately_severe: 'danger',
      severe: 'dark',
    }
    return colors[severity.level] || 'secondary'
  }
  
  return 'primary' // For comprehensive assessments
}

const getSeverityLabel = (severity: Severity | { phq9: Severity; gad7: Severity } | undefined): string => {
  if (!severity) return 'N/A'
  
  if ('level' in severity) {
    return severity.label
  }
  
  return 'Comprehensive'
}

export default function PatientAssessmentsPage() {
  const { hasRole } = usePermissions()
  const isPatient = useHasRole('patient')
  const isAdmin = useHasRole('admin')

  // Only allow patients or admins
  if (!isPatient && !isAdmin) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="My Assessments" />
        <UnauthorizedMessage message="You do not have permission to view this page." />
      </>
    )
  }

  const { data: assessments, isLoading, error } = usePatientAssessments()

  if (error && (error as any).response?.status === 403) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="My Assessments" />
        <UnauthorizedMessage message="You do not have permission to view assessments." />
      </>
    )
  }

  return (
    <>
      <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="My Assessments" />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="card-title mb-0">My Assessments</h4>
                  <p className="text-muted mb-0">View your completed mental health assessments.</p>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : assessments && assessments.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped table-nowrap align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Assessment Type</th>
                        <th>Score</th>
                        <th>Severity</th>
                        <th>Status</th>
                        <th>Completed On</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assessments.map((assessment: Assessment) => (
                        <tr key={assessment.id}>
                          <td>{formatAssessmentType(assessment.assessment_type)}</td>
                          <td>
                            {assessment.assessment_type === 'comprehensive' ? (
                              <div>
                                <div>PHQ-9: {assessment.phq9_score || 'N/A'}</div>
                                <div>GAD-7: {assessment.gad7_score || 'N/A'}</div>
                              </div>
                            ) : (
                              assessment.score
                            )}
                          </td>
                          <td>
                            {assessment.severity && (
                              <span className={`badge bg-${getSeverityColor(assessment.severity)}`}>
                                {getSeverityLabel(assessment.severity)}
                              </span>
                            )}
                          </td>
                          <td>
                            <StatusBadge status={assessment.status} />
                          </td>
                          <td>{formatDate(assessment.completed_on)}</td>
                          <td>
                            <Link
                              href={`/patient/assessments/${assessment.id}`}
                              className="btn btn-sm btn-primary"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="uil-clipboard-alt font-size-48 text-muted"></i>
                  <p className="text-muted mt-3">No assessments found.</p>
                  <p className="text-muted small">
                    Complete an assessment through the link sent by your healthcare provider.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

