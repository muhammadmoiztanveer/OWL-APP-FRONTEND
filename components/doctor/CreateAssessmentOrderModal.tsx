'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateAssessmentOrder } from '@/hooks/doctor/useAssessmentOrders'
import { usePatients } from '@/hooks/doctor/usePatients'
import { CreateAssessmentOrderRequest } from '@/lib/types'

interface CreateAssessmentOrderModalProps {
  show: boolean
  onClose: () => void
  onSuccess: () => void
}

const ASSESSMENT_TYPES = [
  { value: 'PHQ-9', label: 'Depression Screening (PHQ-9)' },
  { value: 'GAD-7', label: 'Anxiety Screening (GAD-7)' },
  { value: 'comprehensive', label: 'Comprehensive Mental Health Assessment' },
]

export default function CreateAssessmentOrderModal({
  show,
  onClose,
  onSuccess,
}: CreateAssessmentOrderModalProps) {
  const createMutation = useCreateAssessmentOrder()
  const { data: patientsData, isLoading: loadingPatients } = usePatients({ per_page: 100 })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAssessmentOrderRequest>({
    defaultValues: {
      patient_id: undefined,
      assessment_type: '',
      instructions: '',
    },
  })

  useEffect(() => {
    if (!show) {
      reset({
        patient_id: undefined,
        assessment_type: '',
        instructions: '',
      })
    }
  }, [show, reset])

  const onSubmit = async (data: CreateAssessmentOrderRequest) => {
    try {
      await createMutation.mutateAsync(data)
      onSuccess()
      onClose()
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  if (!show) return null

  const patients = (patientsData as any)?.data || []

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Order New Assessment</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={createMutation.isPending}
            ></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {/* Select Patient */}
              <div className="mb-3">
                <label htmlFor="patient_id" className="form-label">
                  Select Patient <span className="text-danger">*</span>
                </label>
                <select
                  id="patient_id"
                  className={`form-select ${errors.patient_id ? 'is-invalid' : ''}`}
                  {...register('patient_id', {
                    required: 'Please select a patient',
                    valueAsNumber: true,
                  })}
                  disabled={loadingPatients || createMutation.isPending}
                >
                  <option value="">-- Select Patient --</option>
                  {patients.map((patient: any) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} ({patient.email})
                    </option>
                  ))}
                </select>
                {errors.patient_id && (
                  <div className="invalid-feedback">{errors.patient_id.message}</div>
                )}
                {loadingPatients && (
                  <small className="text-muted">Loading patients...</small>
                )}
              </div>

              {/* Assessment Type */}
              <div className="mb-3">
                <label htmlFor="assessment_type" className="form-label">
                  Assessment Type <span className="text-danger">*</span>
                </label>
                <select
                  id="assessment_type"
                  className={`form-select ${errors.assessment_type ? 'is-invalid' : ''}`}
                  {...register('assessment_type', {
                    required: 'Please select an assessment type',
                  })}
                  disabled={createMutation.isPending}
                >
                  <option value="">-- Select Assessment Type --</option>
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

              {/* Instructions */}
              <div className="mb-3">
                <label htmlFor="instructions" className="form-label">
                  Instructions
                </label>
                <textarea
                  id="instructions"
                  className={`form-control ${errors.instructions ? 'is-invalid' : ''}`}
                  rows={4}
                  placeholder="Instructions or context for the patient..."
                  {...register('instructions')}
                  disabled={createMutation.isPending}
                ></textarea>
                {errors.instructions && (
                  <div className="invalid-feedback">{errors.instructions.message}</div>
                )}
                <small className="text-muted">Optional: Add any specific instructions or context for the patient</small>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={createMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-danger"
                disabled={createMutation.isPending || loadingPatients}
              >
                {createMutation.isPending ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Sending...
                  </>
                ) : (
                  'Send Order'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

