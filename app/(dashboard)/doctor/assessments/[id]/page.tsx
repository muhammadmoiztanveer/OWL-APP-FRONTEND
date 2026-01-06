'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAssessment } from '@/hooks/doctor/useAssessments'
import Breadcrumb from '@/components/common/Breadcrumb'
import PermissionGate from '@/components/common/PermissionGate'
import UnauthorizedMessage from '@/components/common/UnauthorizedMessage'
import StatusBadge from '@/components/common/StatusBadge'
import AssessmentPdfSection from '@/components/assessments/AssessmentPdfSection'
import AssessmentResponses from '@/components/assessments/AssessmentResponses'
import AssessmentResponsesModal from '@/components/assessments/AssessmentResponsesModal'
import CreateInvoiceFromAssessmentButton from '@/components/billing/CreateInvoiceFromAssessmentButton'
import { usePermissions } from '@/hooks/usePermissions'
import { useAuth } from '@/contexts/AuthContext'
import { useMarkAsReviewed } from '@/hooks/doctor/useAssessments'
import { doctorApi } from '@/lib/api/doctor'
import { Severity } from '@/lib/types'
import Link from 'next/link'
import toast from 'react-hot-toast'

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

  const { hasPermission } = usePermissions()
  const { refreshProfile } = useAuth()

  const { data: assessment, isLoading, error, refetch } = useAssessment(id)
  const markAsReviewedMutation = useMarkAsReviewed()
  const [showResponsesModal, setShowResponsesModal] = useState(false)
  const [loadingResponses, setLoadingResponses] = useState(false)
  const [fullAssessment, setFullAssessment] = useState<any>(null)

  // Debug: Log assessment data to verify responses are included
  useEffect(() => {
    if (assessment && typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('Doctor Assessment Detail - Full assessment:', assessment)
      console.log('Doctor Assessment Detail - Responses:', assessment.responses)
      if (assessment.responses && assessment.responses.length > 0) {
        console.log('Doctor Assessment Detail - First response sample:', assessment.responses[0])
        console.log('Doctor Assessment Detail - First response question_text:', assessment.responses[0]?.question_text)
        // Check if any responses are missing question_text
        const missingText = assessment.responses.filter((r: any) => !r.question_text || !r.question_text.trim())
        if (missingText.length > 0) {
          console.warn('Doctor Assessment Detail - Responses missing question_text:', missingText.length, 'out of', assessment.responses.length)
          console.warn('Doctor Assessment Detail - Sample missing question_text:', missingText[0])
        }
      }
      console.log('Doctor Assessment Detail - Responses length:', assessment.responses?.length)
      console.log('Doctor Assessment Detail - Status:', assessment.status)
    }
  }, [assessment])

  const handleMarkAsReviewed = async () => {
    try {
      await markAsReviewedMutation.mutateAsync(id)
      refetch() // Refresh the assessment data
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleViewResponses = async () => {
    // Try to get patient_id from multiple possible locations
    const patientId = assessment?.patient_id || assessment?.patient?.id

    if (!patientId) {
      console.error('Assessment data:', assessment)
      toast.error('Patient information not available')
      return
    }

    setLoadingResponses(true)
    try {
      const response = await doctorApi.getPatientAssessmentResponses(patientId, assessment.id)
      if (response.success && response.data) {
        setFullAssessment(response.data)
        setShowResponsesModal(true)
      } else {
        toast.error('Failed to load assessment responses')
      }
    } catch (error: any) {
      console.error('Failed to fetch assessment responses:', error)
      toast.error(error.message || 'Failed to load assessment responses')
    } finally {
      setLoadingResponses(false)
    }
  }

  if (error && (error as any).response?.status === 403) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Assessment Details" />
        <UnauthorizedMessage message="You do not have permission to view this assessment." />
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
                <Link href="/doctor/assessments" className="btn btn-primary mt-3">
                  Back to Assessments
                </Link>
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

  const severity = assessment.severity as Severity | { phq9: Severity; gad7: Severity } | undefined
  const recommendation = assessment.recommendation as string | { phq9: string; gad7: string } | undefined
  const isComprehensive = assessment.assessment_type === 'comprehensive'
  const canMarkAsReviewed = hasPermission('assessment.update') && assessment.status === 'completed'

  return (
    <PermissionGate permission="assessment.view" fallback={<UnauthorizedMessage />}>
      <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Assessment Details" />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="card-title mb-0">{formatAssessmentType(assessment.assessment_type)}</h4>
                  <p className="text-muted mb-0">Assessment ID: #{assessment.id}</p>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <StatusBadge status={assessment.status} />
                  {canMarkAsReviewed && (
                    <button
                      className="btn btn-danger"
                      onClick={handleMarkAsReviewed}
                      disabled={markAsReviewedMutation.isPending}
                    >
                      {markAsReviewedMutation.isPending ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Marking...
                        </>
                      ) : (
                        <>
                          <i className="mdi mdi-check-circle me-1"></i>
                          Mark as Reviewed
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Assessment Information */}
              <div className="mb-4">
                <h5 className="mb-3">Assessment Information</h5>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <th style={{ width: '30%' }}>Assessment Type</th>
                        <td>{formatAssessmentType(assessment.assessment_type)}</td>
                      </tr>
                      <tr>
                        <th>Patient</th>
                        <td>{assessment.patient?.name || 'N/A'}</td>
                      </tr>
                      <tr>
                        <th>Status</th>
                        <td>
                          <StatusBadge status={assessment.status} />
                        </td>
                      </tr>
                      {assessment.completed_on && (
                        <tr>
                          <th>Completed On</th>
                          <td>{formatDate(assessment.completed_on)}</td>
                        </tr>
                      )}
                      {assessment.reviewed_at && (
                        <tr>
                          <th>Reviewed On</th>
                          <td>{formatDate(assessment.reviewed_at)}</td>
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
                          <h3 className="text-primary">{assessment.phq9_score || 'N/A'}</h3>
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
                          <h3 className="text-primary">{assessment.gad7_score || 'N/A'}</h3>
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
                      <h3 className="text-primary">{assessment.score}</h3>
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
              {assessment.suicide_risk !== undefined && assessment.suicide_risk > 0 && (
                <div className="alert alert-danger mb-4">
                  <strong>Important:</strong> This assessment indicated elevated suicide risk. Please review this case
                  with appropriate urgency and consider immediate intervention if necessary.
                </div>
              )}

              {/* View Responses Button - Show for completed/reviewed assessments */}
              {(assessment.status === 'completed' || assessment.status === 'reviewed') && (
                <div className="mb-4">
                  <div className="card border-primary">
                    <div className="card-body text-center">
                      <h5 className="card-title mb-3">Patient Responses</h5>
                      <p className="text-muted mb-3">View detailed questions and answers from this assessment</p>
                      <button
                        type="button"
                        className="btn btn-primary btn-lg"
                        onClick={handleViewResponses}
                        disabled={loadingResponses}
                      >
                        {loadingResponses ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Loading...
                          </>
                        ) : (
                          <>
                            <i className="mdi mdi-clipboard-text-outline me-2"></i>
                            View Questions & Answers
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Question Responses - Show inline if available */}
              {assessment.status === 'completed' && assessment.responses && assessment.responses.length > 0 && (
                <div className="mb-4">
                  <AssessmentResponses
                    responses={assessment.responses}
                    title="Patient Responses"
                    defaultExpanded={false}
                  />
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

              {/* PDF Section */}
              {assessment.status === 'completed' && (
                <AssessmentPdfSection assessmentId={assessment.id} assessment={assessment} />
              )}

              {/* Create Invoice Section */}
              {assessment.status === 'completed' && hasPermission('billing.create') && (
                <div className="card mb-4">
                  <div className="card-body">
                    <h5 className="card-title mb-3">Billing</h5>
                    <CreateInvoiceFromAssessmentButton assessmentId={assessment.id} />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-top">
                <Link href="/doctor/assessments" className="btn btn-secondary">
                  <i className="mdi mdi-arrow-left me-1"></i>
                  Back to Assessments
                </Link>
                <Link href="/doctor/assessments/ready-for-review" className="btn btn-secondary ms-2">
                  <i className="mdi mdi-check-circle me-1"></i>
                  Ready for Review
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Responses Modal */}
      {showResponsesModal && fullAssessment && fullAssessment.responses && fullAssessment.responses.length > 0 && (
        <AssessmentResponsesModal
          show={showResponsesModal}
          onClose={() => {
            setShowResponsesModal(false)
            setFullAssessment(null)
          }}
          responses={fullAssessment.responses}
          assessment={fullAssessment}
          patientName={assessment.patient?.name}
          title={`Assessment Responses - ${fullAssessment.assessment_type}`}
        />
      )}
    </PermissionGate>
  )
}

