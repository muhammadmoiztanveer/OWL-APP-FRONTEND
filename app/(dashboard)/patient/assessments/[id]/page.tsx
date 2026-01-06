'use client'

import { useParams } from 'next/navigation'
import { usePatientAssessment } from '@/hooks/assessments/usePatientAssessments'
import Breadcrumb from '@/components/common/Breadcrumb'
import StatusBadge from '@/components/common/StatusBadge'
import AssessmentPdfSection from '@/components/assessments/AssessmentPdfSection'
import AssessmentResponses from '@/components/assessments/AssessmentResponses'
import { usePermissions } from '@/hooks/usePermissions'
import { useHasRole } from '@/hooks/useHasRole'
import UnauthorizedMessage from '@/components/common/UnauthorizedMessage'
import { Severity } from '@/lib/types'

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateString
  }
}

const formatAssessmentType = (type: string): string => {
  if (type === 'PHQ-9') return 'PHQ-9 (Patient Health Questionnaire)'
  if (type === 'GAD-7') return 'GAD-7 (Generalized Anxiety Disorder)'
  if (type === 'comprehensive') return 'Comprehensive Mental Health Assessment'
  return type
}

const getSeverityColor = (level: string): string => {
  const colors: Record<string, string> = {
    minimal: 'success',
    mild: 'info',
    moderate: 'warning',
    moderately_severe: 'danger',
    severe: 'dark',
  }
  return colors[level] || 'secondary'
}

export default function AssessmentDetailPage() {
  const params = useParams()
  const id = parseInt(params.id as string, 10)

  const { hasRole } = usePermissions()
  const isPatient = useHasRole('patient')
  const isAdmin = useHasRole('admin')
  const { data: assessment, isLoading, error } = usePatientAssessment(id)
  const assessmentData = assessment as any

  // Only allow patients or admins
  if (!isPatient && !isAdmin) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Assessment Details" />
        <UnauthorizedMessage message="You do not have permission to view this page." />
      </>
    )
  }

  if (error && (error as any).response?.status === 403) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Assessment Details" />
        <UnauthorizedMessage message="You do not have permission to view this assessmentData." />
      </>
    )
  }

  if (error && (error as any).response?.status === 404) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Assessment Details" />
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center py-5">
                <i className="uil-exclamation-octagon font-size-48 text-warning"></i>
                <h4 className="mt-3 mb-2">Assessment Not Found</h4>
                <p className="text-muted">The assessment you&apos;re looking for doesn&apos;t exist or has been removed.</p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (isLoading) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Assessment Details" />
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    )
  }

  if (!assessment) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Assessment Details" />
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center py-5">
                <i className="uil-exclamation-octagon font-size-48 text-warning"></i>
                <h4 className="mt-3 mb-2">No Assessment Data</h4>
                <p className="text-muted">Unable to load assessment details.</p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  const severity = assessmentData.severity as Severity | { phq9: Severity; gad7: Severity } | undefined
  const recommendation = assessmentData.recommendation as string | { phq9: string; gad7: string } | undefined
  const isComprehensive = assessmentData.assessment_type === 'comprehensive'

  return (
    <>
      <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Assessment Details" />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="card-title mb-0">{formatAssessmentType(assessmentData.assessment_type)}</h4>
                  <p className="text-muted mb-0">Assessment ID: #{assessmentData.id}</p>
                </div>
                <StatusBadge status={assessmentData.status} />
              </div>

              {/* Assessment Information */}
              <div className="mb-4">
                <h5 className="mb-3">Assessment Information</h5>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <th style={{ width: '30%' }}>Assessment Type</th>
                        <td>{formatAssessmentType(assessmentData.assessment_type)}</td>
                      </tr>
                      <tr>
                        <th>Status</th>
                        <td>
                          <StatusBadge status={assessmentData.status} />
                        </td>
                      </tr>
                      {assessmentData.completed_on && (
                        <tr>
                          <th>Completed On</th>
                          <td>{formatDate(assessmentData.completed_on)}</td>
                        </tr>
                      )}
                      {assessmentData.reviewed_at && (
                        <tr>
                          <th>Reviewed On</th>
                          <td>{formatDate(assessmentData.reviewed_at)}</td>
                        </tr>
                      )}
                      {assessmentData.assessment_order && (
                        <>
                          <tr>
                            <th>Ordered On</th>
                            <td>{formatDate(assessmentData.assessment_order.ordered_on)}</td>
                          </tr>
                          {assessmentData.assessment_order.sent_at && (
                            <tr>
                              <th>Sent At</th>
                              <td>{formatDate(assessmentData.assessment_order.sent_at)}</td>
                            </tr>
                          )}
                          {assessmentData.assessment_order.instructions && (
                            <tr>
                              <th>Instructions</th>
                              <td>{assessmentData.assessment_order.instructions}</td>
                            </tr>
                          )}
                        </>
                      )}
                      {assessmentData.doctor && (
                        <tr>
                          <th>Healthcare Provider</th>
                          <td>
                            {assessmentData.doctor.first_name && assessmentData.doctor.last_name
                              ? `${assessmentData.doctor.first_name} ${assessmentData.doctor.last_name}`
                              : assessmentData.doctor.full_name || assessmentData.doctor.name || assessmentData.doctor.email || 'N/A'}
                          </td>
                        </tr>
                      )}
                      {assessmentData.doctor?.practice_name && (
                        <tr>
                          <th>Practice</th>
                          <td>{assessmentData.doctor.practice_name}</td>
                        </tr>
                      )}
                      {assessmentData.assessment_order?.assigned_by_doctor && (
                        <tr>
                          <th>Assigned By</th>
                          <td>
                            {assessmentData.assessment_order.assigned_by_doctor.first_name &&
                            assessmentData.assessment_order.assigned_by_doctor.last_name
                              ? `${assessmentData.assessment_order.assigned_by_doctor.first_name} ${assessmentData.assessment_order.assigned_by_doctor.last_name}`
                              : assessmentData.assessment_order.assigned_by_doctor.full_name || 'N/A'}
                            {assessmentData.assessment_order.assigned_by_doctor.practice_name && (
                              <span className="text-muted ms-2">
                                ({assessmentData.assessment_order.assigned_by_doctor.practice_name})
                              </span>
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Scores */}
              <div className="mb-4">
                <h5 className="mb-3">Scores</h5>
                {isComprehensive ? (
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <div className="card border">
                        <div className="card-body">
                          <h6 className="card-title">PHQ-9 Score</h6>
                          <h3 className="text-primary">{assessmentData.phq9_score || 'N/A'}</h3>
                          {severity && typeof severity === 'object' && 'phq9' in severity && (
                            <div className="mt-2">
                              <span className={`badge bg-${getSeverityColor(severity.phq9.level)}`}>
                                {severity.phq9.label}
                              </span>
                              <p className="text-muted small mt-2 mb-0">{severity.phq9.description}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="card border">
                        <div className="card-body">
                          <h6 className="card-title">GAD-7 Score</h6>
                          <h3 className="text-primary">{assessmentData.gad7_score || 'N/A'}</h3>
                          {severity && typeof severity === 'object' && 'gad7' in severity && (
                            <div className="mt-2">
                              <span className={`badge bg-${getSeverityColor(severity.gad7.level)}`}>
                                {severity.gad7.label}
                              </span>
                              <p className="text-muted small mt-2 mb-0">{severity.gad7.description}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="card border">
                    <div className="card-body">
                      <h6 className="card-title">Total Score</h6>
                      <h3 className="text-primary">{assessmentData.score}</h3>
                      {severity && typeof severity === 'object' && 'level' in severity && (
                        <div className="mt-2">
                          <span className={`badge bg-${getSeverityColor(severity.level)}`}>
                            {severity.label}
                          </span>
                          <p className="text-muted small mt-2 mb-0">{severity.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Suicide Risk Warning */}
              {assessmentData.suicide_risk !== undefined && assessmentData.suicide_risk > 0 && (
                <div className="alert alert-danger mb-4">
                  <strong>Important:</strong> This assessment indicated elevated suicide risk. If you are experiencing
                  thoughts of self-harm or suicide, please contact emergency services immediately or call the National
                  Suicide Prevention Lifeline at 988.
                </div>
              )}

              {/* Recommendations */}
              {recommendation && (
                <div className="mb-4">
                  <h5 className="mb-3">Clinical Recommendation</h5>
                  <div className="alert alert-info">
                    {isComprehensive && typeof recommendation === 'object' ? (
                      <div>
                        <strong>PHQ-9:</strong>
                        <p className="mb-2">{recommendation.phq9}</p>
                        <hr />
                        <strong>GAD-7:</strong>
                        <p className="mb-0">{recommendation.gad7}</p>
                      </div>
                    ) : (
                      <p className="mb-0">{typeof recommendation === 'string' ? recommendation : 'No recommendation available.'}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Question Responses */}
              {assessmentData.responses && assessmentData.responses.length > 0 && (
                <AssessmentResponses
                  responses={assessmentData.responses}
                  title="Your Responses"
                  defaultExpanded={true}
                />
              )}

              {/* PDF Section */}
              {assessmentData.status === 'completed' && (
                <AssessmentPdfSection assessmentId={assessmentData.id} assessment={assessmentData as any} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

