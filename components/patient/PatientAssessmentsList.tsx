'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { assessmentsApi, AssignedAssessment } from '@/lib/api/assessments'
import AssessmentResponses from '@/components/assessments/AssessmentResponses'
import toast from 'react-hot-toast'

export default function PatientAssessmentsList() {
  const [assessments, setAssessments] = useState<AssignedAssessment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAssessments()
  }, [])

  const fetchAssessments = async () => {
    setLoading(true)
    try {
      const response = await assessmentsApi.getAssignedAssessments()

      if (response.success && response.data) {
        setAssessments(response.data)
      } else {
        // If response is not successful but no error thrown
        console.error('Failed to fetch assessments - response:', response)
        toast.error(response.message || 'Failed to load assessments')
      }
    } catch (error: any) {
      console.error('Failed to fetch assessments:', {
        error,
        response: error.response?.data,
        status: error.response?.status,
        message: error.message,
      })
      
      // Don't show error toast for 404 - endpoint might not be implemented yet
      if (error.response?.status === 404) {
        console.warn('Assessment endpoint not found - backend may not be implemented yet')
        // Show empty state instead of error
        setAssessments([])
        return
      }
      
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to load assessments. Please try again.'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  const handleStartAssessment = async (assessmentId: number) => {
    try {
      const response = await assessmentsApi.getAssessmentUrl(assessmentId)
      if (response.success && response.data) {
        // Redirect to assessment URL
        window.location.href = response.data.assessment_url
      }
    } catch (error: any) {
      toast.error('Failed to get assessment link')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="mb-0">My Assessments</h5>
          <p className="text-muted mb-0">Assessments assigned by your doctor</p>
        </div>
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
        <div className="text-center py-5">
          <i className="mdi mdi-clipboard-text-outline" style={{ fontSize: '48px', color: '#ccc' }}></i>
          <p className="text-muted mt-3 mb-0">No assessments assigned yet.</p>
          <p className="text-muted small mt-2">
            Your doctor will assign assessments that you can complete here.
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {assessments.map((assessment) => (
            <div key={assessment.id} className="col-12">
              <div className="card border">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <h6 className="card-title mb-2">
                        {assessment.assessment_type}
                        {assessment.is_completed && (
                          <span className="badge bg-success ms-2">Completed</span>
                        )}
                        {!assessment.is_completed && (
                          <span className="badge bg-warning ms-2">Pending</span>
                        )}
                      </h6>
                      <p className="text-muted mb-2 small">
                        <i className="mdi mdi-account-doctor me-1"></i>
                        Assigned by: <strong>{assessment.doctor.name}</strong> ({assessment.doctor.practice_name})
                      </p>
                      {assessment.instructions && (
                        <p className="text-muted mb-2">{assessment.instructions}</p>
                      )}
                      <p className="text-muted mb-0 small">
                        <i className="mdi mdi-calendar me-1"></i>
                        Assigned: {formatDate(assessment.ordered_on)}
                      </p>
                      {assessment.token_expires_at && !assessment.is_completed && (
                        <p className="text-warning mb-0 small mt-1">
                          <i className="mdi mdi-clock-alert-outline me-1"></i>
                          Expires: {formatDate(assessment.token_expires_at)}
                        </p>
                      )}
                    </div>

                    <div className="ms-3 text-end">
                      {assessment.is_completed ? (
                        <div>
                          <div className="text-success fw-bold mb-1">
                            <i className="mdi mdi-check-circle me-1"></i>
                            Completed
                          </div>
                          {assessment.assessment && (
                            <div className="small">
                              <div>Score: <strong>{assessment.assessment.score}</strong></div>
                              <div className="text-muted">
                                {formatDate(assessment.assessment.completed_on)}
                              </div>
                            </div>
                          )}
                          <Link
                            href={`/patient/assessments/${assessment.assessment?.id || assessment.id}`}
                            className="btn btn-sm btn-outline-primary mt-2"
                          >
                            <i className="mdi mdi-eye me-1"></i>
                            View Results
                          </Link>
                        </div>
                      ) : (
                        <div>
                          {assessment.assessment_url ? (
                            <button
                              className="btn btn-primary"
                              onClick={() => handleStartAssessment(assessment.id)}
                            >
                              <i className="mdi mdi-play-circle-outline me-1"></i>
                              Start Assessment
                            </button>
                          ) : (
                            <div className="text-muted small">Link not available</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Show responses for completed assessments */}
                  {assessment.is_completed && assessment.assessment?.responses && assessment.assessment.responses.length > 0 && (
                    <div className="mt-3 pt-3 border-top">
                      <AssessmentResponses
                        responses={assessment.assessment.responses}
                        title="Your Answers"
                        defaultExpanded={false}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
