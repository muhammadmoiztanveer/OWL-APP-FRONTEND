'use client'

import { useEffect, useState } from 'react'
import { doctorApi } from '@/lib/api/doctor'
import { adminApi } from '@/lib/api/admin'
import { Assessment } from '@/lib/types'
import AssessmentResponsesModal from '@/components/assessments/AssessmentResponsesModal'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface PatientAssessmentResultsProps {
  patientId: number
  isAdmin?: boolean
}

export default function PatientAssessmentResults({ patientId, isAdmin = false }: PatientAssessmentResultsProps) {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [loadingResponses, setLoadingResponses] = useState(false)

  useEffect(() => {
    fetchAssessments()
  }, [patientId])

  const fetchAssessments = async () => {
    setLoading(true)
    try {
      const response = await doctorApi.getPatientAssessments(patientId)
      if (response.success && response.data) {
        setAssessments(response.data)
      }
    } catch (error: any) {
      console.error('Failed to fetch assessments:', error)
      toast.error('Failed to load assessment results')
    } finally {
      setLoading(false)
    }
  }

  const handleViewResponses = async (assessment: Assessment) => {
    // Use patientId from props (already available in this component)
    if (!patientId) {
      console.error('Patient ID not available:', { patientId, assessment })
      toast.error('Patient information not available')
      return
    }

    setLoadingResponses(true)
    try {
      let response
      if (isAdmin) {
        response = await adminApi.getPatientAssessmentResponses(patientId, assessment.id)
      } else {
        response = await doctorApi.getPatientAssessmentResponses(patientId, assessment.id)
      }

      if (response.success && response.data) {
        setSelectedAssessment(response.data)
        setShowModal(true)
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

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  const getSeverityColor = (score: number, type: string) => {
    if (type === 'PHQ-9') {
      if (score >= 20) return 'danger'
      if (score >= 15) return 'warning'
      if (score >= 10) return 'info'
      return 'success'
    }
    if (type === 'GAD-7') {
      if (score >= 15) return 'danger'
      if (score >= 10) return 'warning'
      if (score >= 5) return 'info'
      return 'success'
    }
    return 'secondary'
  }

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border spinner-border-sm text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Assessment Results</h5>
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={fetchAssessments}
          disabled={loading}
        >
          <i className="mdi mdi-refresh me-1"></i>
          Refresh
        </button>
      </div>

      {assessments.length === 0 ? (
        <div className="text-center py-4">
          <i className="mdi mdi-clipboard-text-outline" style={{ fontSize: '48px', color: '#ccc' }}></i>
          <p className="text-muted mt-2 mb-0">No assessments completed yet.</p>
        </div>
      ) : (
        <div className="row g-3">
          {assessments.map((assessment) => (
            <div key={assessment.id} className="col-md-6">
              <div className="card border h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="card-title mb-1">{assessment.assessment_type}</h6>
                      <small className="text-muted">
                        Completed: {formatDate(assessment.completed_on)}
                      </small>
                    </div>
                    <div className="text-end">
                      <div
                        className={`badge bg-${getSeverityColor(
                          assessment.score,
                          assessment.assessment_type
                        )} fs-6`}
                      >
                        {assessment.score}
                      </div>
                      <div className="text-xs text-muted mt-1">Total Score</div>
                    </div>
                  </div>

                  <div className="mt-3">
                    {assessment.phq9_score !== null && (
                      <div className="mb-1">
                        <small>
                          <strong>PHQ-9 Score:</strong> {assessment.phq9_score}
                        </small>
                      </div>
                    )}

                    {assessment.gad7_score !== null && (
                      <div className="mb-1">
                        <small>
                          <strong>GAD-7 Score:</strong> {assessment.gad7_score}
                        </small>
                      </div>
                    )}

                    {assessment.suicide_risk !== null && (
                      <div className="mb-1">
                        <small>
                          <strong>Suicide Risk Level:</strong> {assessment.suicide_risk}
                        </small>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 d-flex gap-2">
                    <Link
                      href={`/doctor/assessments/${assessment.id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      <i className="mdi mdi-eye me-1"></i>
                      View Details
                    </Link>
                    {(assessment.status === 'completed' || assessment.status === 'reviewed') && (
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => handleViewResponses(assessment)}
                        disabled={loadingResponses}
                      >
                        {loadingResponses ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                            Loading...
                          </>
                        ) : (
                          <>
                            <i className="mdi mdi-clipboard-text-outline me-1"></i>
                            View Responses
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assessment Responses Modal */}
      {selectedAssessment && selectedAssessment.responses && selectedAssessment.responses.length > 0 && (
        <AssessmentResponsesModal
          show={showModal}
          onClose={() => {
            setShowModal(false)
            setSelectedAssessment(null)
          }}
          responses={selectedAssessment.responses}
          assessment={selectedAssessment}
          title={`Assessment Responses - ${selectedAssessment.assessment_type}`}
        />
      )}
    </div>
  )
}
