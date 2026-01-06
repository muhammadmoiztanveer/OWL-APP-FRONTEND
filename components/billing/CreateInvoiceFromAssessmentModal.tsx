'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateInvoiceFromAssessment } from '@/hooks/billing/useInvoices'
import { useActiveRates } from '@/hooks/billing/useRates'
import { useAssessment } from '@/hooks/doctor/useAssessments'
import { CreateInvoiceFromAssessmentRequest } from '@/lib/types'
import { useRouter } from 'next/navigation'

interface CreateInvoiceFromAssessmentModalProps {
  show: boolean
  onClose: () => void
  assessmentId: number
}

export default function CreateInvoiceFromAssessmentModal({
  show,
  onClose,
  assessmentId,
}: CreateInvoiceFromAssessmentModalProps) {
  const router = useRouter()
  const createMutation = useCreateInvoiceFromAssessment()
  const { data: assessment } = useAssessment(assessmentId)
  const { data: activeRates } = useActiveRates()
  const activeRatesTyped = (activeRates as any) || []

  const [selectedRate, setSelectedRate] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateInvoiceFromAssessmentRequest>({
    defaultValues: {
      tax: '0',
      discount: '0',
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: '',
    },
  })

  const tax = watch('tax') || '0'
  const discount = watch('discount') || '0'

  // Find matching rate for assessment type
  useEffect(() => {
    if (assessment && activeRates) {
      const matchingRate = activeRatesTyped.find(
        (rate: any) => rate.assessment_type === assessment.assessment_type || rate.assessment_type === 'comprehensive'
      )
      if (matchingRate) {
        setSelectedRate(matchingRate.id)
      }
    }
  }, [assessment, activeRates])

  useEffect(() => {
    if (show) {
      reset({
        tax: '0',
        discount: '0',
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: '',
      })
    }
  }, [show, reset])

  const onSubmit = async (data: CreateInvoiceFromAssessmentRequest) => {
    try {
      const result = await createMutation.mutateAsync({
        assessmentId,
        data,
      })
      onClose()
      router.push(`/billing/invoices/${(result as any)?.id || ''}`)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const isLoading = createMutation.isPending

  // Calculate total (subtotal comes from rate)
  const calculateTotal = () => {
    const matchingRate = activeRatesTyped?.find(
      (rate: any) =>
        rate.assessment_type === assessment?.assessment_type ||
        (assessment?.assessment_type === 'comprehensive' && rate.assessment_type === 'comprehensive')
    )
    const sub = parseFloat(matchingRate?.amount || '0')
    const taxAmount = parseFloat(tax || '0')
    const disc = parseFloat(discount || '0')
    return (sub + taxAmount - disc).toFixed(2)
  }

  if (!show) return null

  const matchingRate = activeRatesTyped?.find(
    (rate: any) =>
      rate.assessment_type === assessment?.assessment_type ||
      (assessment?.assessment_type === 'comprehensive' && rate.assessment_type === 'comprehensive')
  )

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create Invoice from Assessment</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={isLoading}
            ></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {assessment && (
                <div className="alert alert-info mb-3">
                  <strong>Assessment:</strong> {assessment.assessment_type}
                  <br />
                  <strong>Patient:</strong> {assessment.patient?.name || 'N/A'}
                </div>
              )}

              {matchingRate && (
                <div className="alert alert-success mb-3">
                  <i className="mdi mdi-information me-2"></i>
                  Using active rate: <strong>${matchingRate.amount}</strong> for{' '}
                  {matchingRate.assessment_type}
                </div>
              )}

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Subtotal (from rate)</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={matchingRate ? `$${matchingRate.amount}` : 'No rate found'}
                    readOnly
                    disabled
                  />
                  {!matchingRate && (
                    <small className="text-danger">No active rate found for this assessment type</small>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="tax" className="form-label">Tax</label>
                  <input
                    type="number"
                    id="tax"
                    step="0.01"
                    min="0"
                    className="form-control"
                    placeholder="0.00"
                    {...register('tax', {
                      min: { value: 0, message: 'Tax must be positive' },
                    })}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="discount" className="form-label">Discount</label>
                  <input
                    type="number"
                    id="discount"
                    step="0.01"
                    min="0"
                    className="form-control"
                    placeholder="0.00"
                    {...register('discount', {
                      min: { value: 0, message: 'Discount must be positive' },
                    })}
                    disabled={isLoading}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Total</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={`$${calculateTotal()}`}
                    readOnly
                    disabled
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="due_date" className="form-label">
                  Due Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  id="due_date"
                  className={`form-control ${errors.due_date ? 'is-invalid' : ''}`}
                  {...register('due_date', {
                    required: 'Due date is required',
                  })}
                  disabled={isLoading}
                />
                {errors.due_date && (
                  <div className="invalid-feedback">{errors.due_date.message}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="notes" className="form-label">Notes</label>
                <textarea
                  id="notes"
                  className="form-control"
                  rows={3}
                  placeholder="Optional notes..."
                  {...register('notes')}
                  disabled={isLoading}
                ></textarea>
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
                    Creating...
                  </>
                ) : (
                  'Create Invoice'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

