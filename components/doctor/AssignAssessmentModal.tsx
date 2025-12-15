'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { assessmentsApi } from '@/lib/api/assessments'
import toast from 'react-hot-toast'

interface AssignAssessmentModalProps {
  patientId: number
  patientName: string
  onClose: () => void
  onSuccess: () => void
}

interface FormData {
  assessment_type: 'PHQ-9' | 'GAD-7' | 'comprehensive'
  instructions: string
}

export default function AssignAssessmentModal({
  patientId,
  patientName,
  onClose,
  onSuccess,
}: AssignAssessmentModalProps) {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      assessment_type: 'PHQ-9',
      instructions: '',
    },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const response = await assessmentsApi.createAssessmentOrder({
        patient_id: patientId,
        assessment_type: data.assessment_type,
        instructions: data.instructions || undefined,
      })

      if (response.success) {
        toast.success('Assessment assigned successfully! Email sent to patient.')
        onSuccess()
        onClose()
      } else {
        toast.error(response.message || 'Failed to assign assessment')
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to assign assessment'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Assign Assessment to {patientName}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">
                  Assessment Type <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select ${errors.assessment_type ? 'is-invalid' : ''}`}
                  {...register('assessment_type', { required: 'Assessment type is required' })}
                >
                  <option value="">Select assessment type</option>
                  <option value="PHQ-9">PHQ-9 (Depression Screening)</option>
                  <option value="GAD-7">GAD-7 (Anxiety Screening)</option>
                  <option value="comprehensive">Comprehensive (PHQ-9 + GAD-7)</option>
                </select>
                {errors.assessment_type && (
                  <div className="invalid-feedback">{errors.assessment_type.message}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Instructions (Optional)</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Add any specific instructions for the patient..."
                  {...register('instructions')}
                />
                <small className="text-muted">
                  These instructions will be included in the email sent to the patient.
                </small>
              </div>

              <div className="alert alert-info" role="alert">
                <i className="mdi mdi-information-outline me-2"></i>
                An email with the assessment link will be automatically sent to the patient.
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Assigning...
                  </>
                ) : (
                  'Assign Assessment'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
