'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateQuestion, useUpdateQuestion } from '@/hooks/assessments/useAssessmentQuestions'
import { Question, CreateQuestionRequest } from '@/lib/types'
import toast from 'react-hot-toast'

interface QuestionFormModalProps {
  show: boolean
  onClose: () => void
  onSuccess: () => void
  question?: Question
}

const ASSESSMENT_TYPES = [
  { value: 'PHQ-9', label: 'PHQ-9' },
  { value: 'GAD-7', label: 'GAD-7' },
  { value: 'comprehensive', label: 'Comprehensive' },
]

export default function QuestionFormModal({
  show,
  onClose,
  onSuccess,
  question,
}: QuestionFormModalProps) {
  const isEditing = !!question
  const createMutation = useCreateQuestion()
  const updateMutation = useUpdateQuestion()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateQuestionRequest>({
    defaultValues: {
      assessment_type: 'PHQ-9',
      text: '',
      order_num: 1,
    },
  })

  useEffect(() => {
    if (show) {
      if (isEditing && question) {
        reset({
          assessment_type: question.assessment_type as 'PHQ-9' | 'GAD-7' | 'comprehensive',
          text: question.text,
          order_num: question.order_num,
        })
      } else {
        reset({
          assessment_type: 'PHQ-9',
          text: '',
          order_num: 1,
        })
      }
    }
  }, [show, isEditing, question, reset])

  const onSubmit = async (data: CreateQuestionRequest) => {
    try {
      if (isEditing && question) {
        await updateMutation.mutateAsync({ id: question.id, data })
      } else {
        await createMutation.mutateAsync(data)
      }
      onSuccess()
    } catch (error) {
      // Error handled by mutation
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  if (!show) return null

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{isEditing ? 'Edit Question' : 'Add New Question'}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={isLoading}
            ></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {/* Assessment Type */}
              <div className="mb-3">
                <label htmlFor="assessment_type" className="form-label">
                  Assessment Type <span className="text-danger">*</span>
                </label>
                <select
                  id="assessment_type"
                  className={`form-select ${errors.assessment_type ? 'is-invalid' : ''}`}
                  {...register('assessment_type', {
                    required: 'Assessment type is required',
                  })}
                  disabled={isLoading}
                >
                  {ASSESSMENT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.assessment_type && (
                  <div className="invalid-feedback">{errors.assessment_type.message}</div>
                )}
              </div>

              {/* Question Text */}
              <div className="mb-3">
                <label htmlFor="text" className="form-label">
                  Question Text <span className="text-danger">*</span>
                </label>
                <textarea
                  id="text"
                  className={`form-control ${errors.text ? 'is-invalid' : ''}`}
                  rows={4}
                  placeholder="Enter the question text..."
                  {...register('text', {
                    required: 'Question text is required',
                    minLength: {
                      value: 10,
                      message: 'Question text must be at least 10 characters',
                    },
                  })}
                  disabled={isLoading}
                ></textarea>
                {errors.text && <div className="invalid-feedback">{errors.text.message}</div>}
              </div>

              {/* Order Number */}
              <div className="mb-3">
                <label htmlFor="order_num" className="form-label">
                  Order Number <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  id="order_num"
                  className={`form-control ${errors.order_num ? 'is-invalid' : ''}`}
                  min={1}
                  {...register('order_num', {
                    required: 'Order number is required',
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: 'Order number must be at least 1',
                    },
                  })}
                  disabled={isLoading}
                />
                {errors.order_num && (
                  <div className="invalid-feedback">{errors.order_num.message}</div>
                )}
                <small className="text-muted">
                  The order in which this question appears in the assessment (1 = first question)
                </small>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditing ? 'Update Question' : 'Create Question'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

