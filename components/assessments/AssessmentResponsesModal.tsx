'use client'

import { AssessmentResponse } from '@/lib/types'

interface AssessmentResponsesModalProps {
  show: boolean
  onClose: () => void
  responses: AssessmentResponse[]
  title?: string
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

export default function AssessmentResponsesModal({
  show,
  onClose,
  responses,
  title = 'Patient Answers',
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

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
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

                    // Get question text - backend returns it nested in question.text
                    // Priority: question.text (nested) > question_text (flat) > fallback
                    const questionText =
                      (response.question?.text && response.question.text.trim()) ||
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
