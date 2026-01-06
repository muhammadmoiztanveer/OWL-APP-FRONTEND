'use client'

import { AssessmentResponse, Assessment } from '@/lib/types'

interface AssessmentResponsesModalProps {
  show: boolean
  onClose: () => void
  responses: AssessmentResponse[]
  title?: string
  assessment?: Assessment // Optional full assessment object for showing additional details
  patientName?: string // Optional patient name for display
}

const SCORE_LABELS: Record<number, { label: string; color: string; bgColor: string }> = {
  0: {
    label: 'Not at all',
    color: 'text-success',
    bgColor: 'bg-success-subtle',
  },
  1: {
    label: 'Several days',
    color: 'text-warning',
    bgColor: 'bg-warning-subtle',
  },
  2: {
    label: 'More than half the days',
    color: 'text-warning',
    bgColor: 'bg-warning-subtle',
  },
  3: {
    label: 'Nearly every day',
    color: 'text-danger',
    bgColor: 'bg-danger-subtle',
  },
}

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

export default function AssessmentResponsesModal({
  show,
  onClose,
  responses,
  title = 'Patient Answers',
  assessment,
  patientName,
}: AssessmentResponsesModalProps) {
  if (!show) return null

  if (!responses || responses.length === 0) {
    return null
  }

  // Sort responses by question order (support both nested and flat formats)
  const sortedResponses = [...responses].sort((a, b) => {
    const orderA = a.question?.order_num ?? a.question_order ?? 0
    const orderB = b.question?.order_num ?? b.question_order ?? 0
    return orderA - orderB
  })

  const severity = assessment?.severity as
    | { level: string; label: string; description: string }
    | { phq9: { level: string; label: string; description: string }; gad7: { level: string; label: string; description: string } }
    | undefined

  const recommendation = assessment?.recommendation as string | { phq9: string; gad7: string } | undefined
  const isComprehensive = assessment?.assessment_type === 'comprehensive'

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <div>
              <h5 className="modal-title mb-1">{title || `Assessment Responses - ${assessment?.assessment_type || ''}`}</h5>
              {patientName && <p className="mb-0 small text-white-50">Patient: {patientName}</p>}
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {/* Assessment Summary */}
            {assessment && (
              <div className="card border mb-4">
                <div className="card-body">
                  <h6 className="card-title mb-3">Assessment Summary</h6>
                  <div className="row">
                    <div className="col-md-3 mb-3">
                      <div>
                        <small className="text-muted d-block">Total Score</small>
                        <h5 className="mb-0 text-primary">{assessment.score ?? 'N/A'}</h5>
                      </div>
                    </div>
                    {assessment.phq9_score !== null && assessment.phq9_score !== undefined && (
                      <div className="col-md-3 mb-3">
                        <div>
                          <small className="text-muted d-block">PHQ-9 Score</small>
                          <h5 className="mb-0 text-primary">{assessment.phq9_score}</h5>
                        </div>
                      </div>
                    )}
                    {assessment.gad7_score !== null && assessment.gad7_score !== undefined && (
                      <div className="col-md-3 mb-3">
                        <div>
                          <small className="text-muted d-block">GAD-7 Score</small>
                          <h5 className="mb-0 text-primary">{assessment.gad7_score}</h5>
                        </div>
                      </div>
                    )}
                    <div className="col-md-3 mb-3">
                      <div>
                        <small className="text-muted d-block">Completed On</small>
                        <small className="d-block">{formatDate(assessment.completed_on)}</small>
                      </div>
                    </div>
                  </div>
                  {severity && (
                    <div className="row mt-2">
                      <div className="col-12">
                        <small className="text-muted d-block">Severity</small>
                        {typeof severity === 'object' && 'level' in severity ? (
                          <span className={`badge bg-${getSeverityColor(severity.level)}`}>
                            {severity.label} - {severity.description}
                          </span>
                        ) : (
                          <div className="d-flex gap-2 mt-1">
                            {'phq9' in severity && (
                              <span className={`badge bg-${getSeverityColor(severity.phq9.level)}`}>
                                PHQ-9: {severity.phq9.label}
                              </span>
                            )}
                            {'gad7' in severity && (
                              <span className={`badge bg-${getSeverityColor(severity.gad7.level)}`}>
                                GAD-7: {severity.gad7.label}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {recommendation && (
                    <div className="row mt-3">
                      <div className="col-12">
                        <small className="text-muted d-block">Recommendation</small>
                        <div className="alert alert-info mt-1 mb-0 py-2">
                          {isComprehensive && typeof recommendation === 'object' ? (
                            <div>
                              <strong>PHQ-9:</strong> {recommendation.phq9}
                              <hr className="my-2" />
                              <strong>GAD-7:</strong> {recommendation.gad7}
                            </div>
                          ) : (
                            <p className="mb-0">{typeof recommendation === 'string' ? recommendation : 'No recommendation available.'}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {assessment.suicide_risk !== undefined && assessment.suicide_risk > 0 && (
                    <div className="alert alert-danger mt-3 mb-0">
                      <strong>Important:</strong> This assessment indicated elevated suicide risk (Level: {assessment.suicide_risk}).
                      Please review this case with appropriate urgency.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Questions and Answers */}
            <h6 className="mb-3">Questions & Answers ({sortedResponses.length})</h6>
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '5%' }}>#</th>
                    <th style={{ width: '55%' }}>Question</th>
                    <th style={{ width: '25%' }}>Answer</th>
                    <th style={{ width: '15%' }}>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedResponses.map((response) => {
                    const scoreInfo = SCORE_LABELS[response.score] || {
                      label: `Score ${response.score}`,
                      color: 'text-secondary',
                      bgColor: 'bg-secondary-subtle',
                    }

                    // Get question text - backend returns it in multiple formats for compatibility
                    // Priority: question.text (nested) > question.question_text (nested alias) > question_text (flat) > fallback
                    const questionText =
                      (response.question?.text && response.question.text.trim()) ||
                      ((response.question as any)?.question_text && (response.question as any).question_text.trim()) ||
                      (response.question_text && response.question_text.trim()) ||
                      null

                    // Get question order - backend uses question.order_num
                    const questionOrder = response.question?.order_num ?? response.question_order ?? 0

                    // Debug: Log if question text is missing (only in development)
                    if (!questionText && typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
                      console.warn('AssessmentResponsesModal - Missing question text for response:', {
                        question_id: response.question_id,
                        question_order: questionOrder,
                        has_question_object: !!response.question,
                        question_object: response.question,
                        response: response,
                      })
                    }

                    // Final fallback - show generic label only if no question text found
                    const displayText = questionText || `Question ${questionOrder}`

                    return (
                      <tr key={response.question_id || questionOrder}>
                        <td className="text-center fw-bold">{questionOrder}</td>
                        <td>{displayText}</td>
                        <td>
                          <span className={`badge ${scoreInfo.bgColor} ${scoreInfo.color} border-0`}>
                            {scoreInfo.label}
                          </span>
                        </td>
                        <td className="text-center">
                          <span
                            className={`badge bg-${
                              response.score === 0
                                ? 'success'
                                : response.score === 1
                                  ? 'warning'
                                  : response.score === 2
                                    ? 'warning'
                                    : 'danger'
                            } fs-6`}
                          >
                            {response.score}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Doctor Information */}
            {assessment?.doctor && (
              <div className="card border mt-4">
                <div className="card-body">
                  <h6 className="card-title mb-3">Doctor Information</h6>
                  <div className="row">
                    <div className="col-md-6">
                      <small className="text-muted d-block">Doctor</small>
                      <p className="mb-2">
                        {assessment.doctor.first_name && assessment.doctor.last_name
                          ? `${assessment.doctor.first_name} ${assessment.doctor.last_name}`
                          : (assessment.doctor as any).full_name || 'N/A'}
                      </p>
                    </div>
                    {assessment.doctor.practice_name && (
                      <div className="col-md-6">
                        <small className="text-muted d-block">Practice</small>
                        <p className="mb-2">{assessment.doctor.practice_name}</p>
                      </div>
                    )}
                  </div>
                  {(assessment.assessment_order as any)?.assigned_by_doctor && (
                    <div className="row mt-2">
                      <div className="col-12">
                        <small className="text-muted d-block">Assigned By</small>
                        <p className="mb-0">
                          {(assessment.assessment_order as any)?.assigned_by_doctor.first_name &&
                          (assessment.assessment_order as any)?.assigned_by_doctor.last_name
                            ? `${(assessment.assessment_order as any)?.assigned_by_doctor.first_name} ${(assessment.assessment_order as any)?.assigned_by_doctor.last_name}`
                            : (assessment.assessment_order as any)?.assigned_by_doctor.full_name || 'N/A'}
                          {(assessment.assessment_order as any)?.assigned_by_doctor.practice_name && (
                            <span className="text-muted ms-2">
                              ({(assessment.assessment_order as any)?.assigned_by_doctor.practice_name})
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}



