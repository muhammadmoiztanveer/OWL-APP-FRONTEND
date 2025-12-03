'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { assessmentsApi } from '@/lib/api/assessments'
import { Question, TokenValidationResponse, QuestionsResponse, SubmitAssessmentResponse, Severity } from '@/lib/types'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'

const SCORE_OPTIONS = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' },
]

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

const formatAssessmentType = (type: string): string => {
  if (type === 'PHQ-9') return 'PHQ-9'
  if (type === 'GAD-7') return 'GAD-7'
  if (type === 'comprehensive') return 'Comprehensive Mental Health Assessment'
  return type
}

export default function AssessmentCompletionPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [loading, setLoading] = useState(true)
  const [validating, setValidating] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [orderData, setOrderData] = useState<TokenValidationResponse | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submittedData, setSubmittedData] = useState<SubmitAssessmentResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Validate token and load questions
  useEffect(() => {
    const loadAssessment = async () => {
      try {
        setValidating(true)
        setError(null)

        // Validate token
        const validationResponse = await assessmentsApi.validateToken(token)
        if (!validationResponse.success || !validationResponse.data) {
          setError('Invalid or expired assessment link. Please contact your healthcare provider.')
          return
        }

        setOrderData(validationResponse.data)

        // Load questions
        const questionsResponse = await assessmentsApi.getQuestionsByToken(token)
        if (!questionsResponse.success || !questionsResponse.data) {
          setError('Failed to load assessment questions. Please try again.')
          return
        }

        setQuestions(questionsResponse.data.questions.sort((a, b) => a.order_num - b.order_num))
      } catch (err: any) {
        console.error('Error loading assessment:', err)
        const message =
          err.response?.data?.message ||
          err.message ||
          'Failed to load assessment. Please check your link and try again.'
        setError(message)
      } finally {
        setValidating(false)
        setLoading(false)
      }
    }

    if (token) {
      loadAssessment()
    }
  }, [token])

  const handleAnswerChange = (questionId: number, score: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: score,
    }))
  }

  const allQuestionsAnswered = questions.length > 0 && questions.every((q) => answers[q.id] !== undefined)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!allQuestionsAnswered) {
      toast.error('Please answer all questions before submitting.')
      return
    }

    try {
      setSubmitting(true)
      const response = await assessmentsApi.submitByToken(token, { answers })

      if (response.success && response.data) {
        setSubmittedData(response.data)
        toast.success('Assessment completed successfully!')
      } else {
        throw new Error(response.message || 'Failed to submit assessment')
      }
    } catch (err: any) {
      console.error('Error submitting assessment:', err)
      const message =
        err.response?.data?.message ||
        err.message ||
        'Failed to submit assessment. Please try again.'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  // Group questions by type for comprehensive assessments
  const groupedQuestions = questions.reduce(
    (acc, q) => {
      if (q.assessment_type === 'comprehensive') {
        // For comprehensive, we need to check if it's PHQ-9 or GAD-7 based on question text/order
        // This is a simplified approach - adjust based on your backend structure
        const isPHQ9 = q.order_num <= 9
        const type = isPHQ9 ? 'PHQ-9' : 'GAD-7'
        if (!acc[type]) acc[type] = []
        acc[type].push(q)
      } else {
        if (!acc[q.assessment_type]) acc[q.assessment_type] = []
        acc[q.assessment_type].push(q)
      }
      return acc
    },
    {} as Record<string, Question[]>
  )

  // Loading state
  if (loading || validating) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading assessment...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !orderData) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card shadow">
                <div className="card-body text-center py-5">
                  <i className="mdi mdi-alert-circle-outline text-danger" style={{ fontSize: '64px' }}></i>
                  <h4 className="mt-3 mb-2">Assessment Link Error</h4>
                  <p className="text-muted mb-4">{error || 'Invalid assessment link'}</p>
                  <p className="text-muted small">
                    If you believe this is an error, please contact your healthcare provider.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Success/Completion state
  if (submittedData) {
    const severity = submittedData.severity as Severity | { phq9: Severity; gad7: Severity }
    const recommendation = submittedData.recommendation as string | { phq9: string; gad7: string }
    const isComprehensive = submittedData.assessment_type === 'comprehensive'

    return (
      <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa', padding: '2rem 0' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card shadow">
                <div className="card-body p-4">
                  <div className="text-center mb-4">
                    <div className="avatar-lg mx-auto mb-3">
                      <div className="avatar-title bg-success-subtle text-success rounded-circle" style={{ width: '80px', height: '80px' }}>
                        <i className="mdi mdi-check-circle" style={{ fontSize: '48px' }}></i>
                      </div>
                    </div>
                    <h3 className="text-success mb-2">Assessment Completed Successfully!</h3>
                    <p className="text-muted">Your responses have been sent to your healthcare provider.</p>
                  </div>

                  <div className="mb-4">
                    <h5 className="mb-3">Assessment Details</h5>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <tbody>
                          <tr>
                            <th style={{ width: '40%' }}>Assessment Type</th>
                            <td>{formatAssessmentType(submittedData.assessment_type)}</td>
                          </tr>
                          <tr>
                            <th>Patient</th>
                            <td>{submittedData.patient.name}</td>
                          </tr>
                          <tr>
                            <th>Healthcare Provider</th>
                            <td>{submittedData.doctor.name}</td>
                          </tr>
                          <tr>
                            <th>Completed On</th>
                            <td>{new Date(submittedData.completed_on).toLocaleString()}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Score Display */}
                  <div className="mb-4">
                    <h5 className="mb-3">Your Scores</h5>
                    {isComprehensive ? (
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <div className="card border">
                            <div className="card-body">
                              <h6 className="card-title">PHQ-9 Score</h6>
                              <h3 className="text-primary">{submittedData.phq9_score || 'N/A'}</h3>
                              {typeof severity === 'object' && 'phq9' in severity && (
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
                              <h3 className="text-primary">{submittedData.gad7_score || 'N/A'}</h3>
                              {typeof severity === 'object' && 'gad7' in severity && (
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
                          <h3 className="text-primary">{submittedData.score}</h3>
                          {typeof severity === 'object' && 'level' in severity && (
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

                  {/* Recommendations */}
                  <div className="mb-4">
                    <h5 className="mb-3">Clinical Recommendation</h5>
                    <div className="alert alert-info">
                      {isComprehensive && typeof recommendation === 'object' ? (
                        <div>
                          <strong>PHQ-9:</strong> {recommendation.phq9}
                          <hr />
                          <strong>GAD-7:</strong> {recommendation.gad7}
                        </div>
                      ) : (
                        <p className="mb-0">{typeof recommendation === 'string' ? recommendation : 'No recommendation available.'}</p>
                      )}
                    </div>
                  </div>

                  {/* Suicide Risk Warning */}
                  {submittedData.suicide_risk !== undefined && submittedData.suicide_risk > 0 && (
                    <div className="alert alert-danger">
                      <strong>Important:</strong> If you are experiencing thoughts of self-harm or suicide, please contact emergency services immediately or call the National Suicide Prevention Lifeline at 988.
                    </div>
                  )}

                  <div className="text-center mt-4">
                    <p className="text-muted small">
                      Your healthcare provider has been notified of your assessment results.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Assessment form
  const currentQuestionIndex = questions.findIndex((q) => !answers[q.id]) + 1 || questions.length
  const progress = questions.length > 0 ? (Object.keys(answers).length / questions.length) * 100 : 0

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa', padding: '2rem 0' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-0 text-white">Mental Health Assessment</h4>
                    <p className="mb-0 text-white-50 small">
                      {formatAssessmentType(orderData.order.assessment_type)}
                    </p>
                  </div>
                  <Link href="/" className="text-white">
                    <i className="mdi mdi-home"></i>
                  </Link>
                </div>
              </div>
              <div className="card-body p-4">
                {/* Patient and Doctor Info */}
                <div className="mb-4 p-3 bg-light rounded">
                  <div className="row">
                    <div className="col-md-6">
                      <p className="mb-1">
                        <strong>Patient:</strong> {orderData.order.patient.name}
                      </p>
                      <p className="mb-0 text-muted small">{orderData.order.patient.email}</p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1">
                        <strong>Healthcare Provider:</strong> {orderData.order.doctor.name}
                      </p>
                      <p className="mb-0 text-muted small">{orderData.order.doctor.email}</p>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                {orderData.order.instructions && (
                  <div className="alert alert-info mb-4">
                    <strong>Instructions:</strong>
                    <p className="mb-0 mt-2">{orderData.order.instructions}</p>
                  </div>
                )}

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted">
                      Question {Object.keys(answers).length} of {questions.length}
                    </span>
                    <span className="text-muted">{Math.round(progress)}% Complete</span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div
                      className="progress-bar bg-primary"
                      role="progressbar"
                      style={{ width: `${progress}%` }}
                      aria-valuenow={progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                  </div>
                </div>

                {/* Assessment Form */}
                <form onSubmit={handleSubmit}>
                  {orderData.order.assessment_type === 'comprehensive' ? (
                    // Comprehensive Assessment - Group by type
                    Object.entries(groupedQuestions).map(([type, typeQuestions]) => (
                      <div key={type} className="mb-4">
                        <h5 className="mb-3 border-bottom pb-2">{type} Questions</h5>
                        {typeQuestions.map((question, index) => (
                          <div key={question.id} className="mb-4 p-3 border rounded">
                            <label className="form-label fw-semibold mb-3">
                              {question.order_num}. {question.text}
                            </label>
                            <div className="row g-2">
                              {SCORE_OPTIONS.map((option) => (
                                <div key={option.value} className="col-6 col-md-3">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name={`question_${question.id}`}
                                      id={`q${question.id}_${option.value}`}
                                      value={option.value}
                                      checked={answers[question.id] === option.value}
                                      onChange={() => handleAnswerChange(question.id, option.value)}
                                    />
                                    <label
                                      className="form-check-label w-100"
                                      htmlFor={`q${question.id}_${option.value}`}
                                    >
                                      <div className="fw-semibold">{option.value}</div>
                                      <div className="small text-muted">{option.label}</div>
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))
                  ) : (
                    // Single Assessment Type
                    questions.map((question, index) => (
                      <div key={question.id} className="mb-4 p-3 border rounded">
                        <label className="form-label fw-semibold mb-3">
                          {question.order_num}. {question.text}
                        </label>
                        <div className="row g-2">
                          {SCORE_OPTIONS.map((option) => (
                            <div key={option.value} className="col-6 col-md-3">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name={`question_${question.id}`}
                                  id={`q${question.id}_${option.value}`}
                                  value={option.value}
                                  checked={answers[question.id] === option.value}
                                  onChange={() => handleAnswerChange(question.id, option.value)}
                                />
                                <label
                                  className="form-check-label w-100"
                                  htmlFor={`q${question.id}_${option.value}`}
                                >
                                  <div className="fw-semibold">{option.value}</div>
                                  <div className="small text-muted">{option.label}</div>
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}

                  {/* Submit Button */}
                  <div className="mt-4 pt-3 border-top">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg w-100"
                      disabled={!allQuestionsAnswered || submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Submitting...
                        </>
                      ) : (
                        'Submit Assessment'
                      )}
                    </button>
                    {!allQuestionsAnswered && (
                      <p className="text-muted text-center mt-2 small">
                        Please answer all {questions.length} questions before submitting.
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

