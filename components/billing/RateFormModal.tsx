'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateRate, useUpdateRate } from '@/hooks/billing/useRates'
import { Rate, CreateRateRequest } from '@/lib/types'
import toast from 'react-hot-toast'

interface RateFormModalProps {
  show: boolean
  onClose: () => void
  onSuccess: () => void
  rate?: Rate
}

const ASSESSMENT_TYPES = [
  { value: 'PHQ-9', label: 'PHQ-9' },
  { value: 'GAD-7', label: 'GAD-7' },
  { value: 'comprehensive', label: 'Comprehensive' },
]

const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
]

export default function RateFormModal({ show, onClose, onSuccess, rate }: RateFormModalProps) {
  const isEditing = !!rate
  const createMutation = useCreateRate()
  const updateMutation = useUpdateRate()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateRateRequest>({
    defaultValues: {
      assessment_type: 'PHQ-9',
      amount: '',
      currency: 'USD',
      is_active: true,
      effective_from: new Date().toISOString().split('T')[0],
      effective_to: null,
      description: '',
    },
  })

  useEffect(() => {
    if (show) {
      if (isEditing && rate) {
        reset({
          assessment_type: rate.assessment_type,
          amount: rate.amount,
          currency: rate.currency,
          is_active: rate.is_active,
          effective_from: rate.effective_from.split('T')[0],
          effective_to: rate.effective_to ? rate.effective_to.split('T')[0] : null,
          description: rate.description || '',
        })
      } else {
        reset({
          assessment_type: 'PHQ-9',
          amount: '',
          currency: 'USD',
          is_active: true,
          effective_from: new Date().toISOString().split('T')[0],
          effective_to: null,
          description: '',
        })
      }
    }
  }, [show, isEditing, rate, reset])

  const onSubmit = async (data: CreateRateRequest) => {
    try {
      if (isEditing && rate) {
        await updateMutation.mutateAsync({ id: rate.id, data })
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
            <h5 className="modal-title">{isEditing ? 'Edit Rate' : 'Add New Rate'}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={isLoading}
            ></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
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

                <div className="col-md-6 mb-3">
                  <label htmlFor="currency" className="form-label">
                    Currency <span className="text-danger">*</span>
                  </label>
                  <select
                    id="currency"
                    className={`form-select ${errors.currency ? 'is-invalid' : ''}`}
                    {...register('currency', {
                      required: 'Currency is required',
                    })}
                    disabled={isLoading}
                  >
                    {CURRENCIES.map((currency) => (
                      <option key={currency.value} value={currency.value}>
                        {currency.label}
                      </option>
                    ))}
                  </select>
                  {errors.currency && (
                    <div className="invalid-feedback">{errors.currency.message}</div>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="amount" className="form-label">
                  Amount <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  id="amount"
                  step="0.01"
                  min="0"
                  className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                  placeholder="0.00"
                  {...register('amount', {
                    required: 'Amount is required',
                    min: {
                      value: 0,
                      message: 'Amount must be positive',
                    },
                    pattern: {
                      value: /^\d+(\.\d{1,2})?$/,
                      message: 'Invalid amount format',
                    },
                  })}
                  disabled={isLoading}
                />
                {errors.amount && <div className="invalid-feedback">{errors.amount.message}</div>}
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="effective_from" className="form-label">
                    Effective From <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    id="effective_from"
                    className={`form-control ${errors.effective_from ? 'is-invalid' : ''}`}
                    {...register('effective_from', {
                      required: 'Effective from date is required',
                    })}
                    disabled={isLoading}
                  />
                  {errors.effective_from && (
                    <div className="invalid-feedback">{errors.effective_from.message}</div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="effective_to" className="form-label">
                    Effective To (Optional)
                  </label>
                  <input
                    type="date"
                    id="effective_to"
                    className="form-control"
                    {...register('effective_to')}
                    disabled={isLoading}
                  />
                  <small className="text-muted">Leave empty for no expiration</small>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  id="description"
                  className="form-control"
                  rows={3}
                  placeholder="Optional description..."
                  {...register('description')}
                  disabled={isLoading}
                ></textarea>
              </div>

              <div className="mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="is_active"
                    {...register('is_active')}
                    disabled={isLoading}
                  />
                  <label className="form-check-label" htmlFor="is_active">
                    Active
                  </label>
                </div>
                <small className="text-muted">Only active rates are used for new invoices</small>
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
                  isEditing ? 'Update Rate' : 'Create Rate'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}


