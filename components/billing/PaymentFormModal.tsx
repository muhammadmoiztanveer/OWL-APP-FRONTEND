'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useCreatePayment } from '@/hooks/billing/usePayments'
import { useInvoice } from '@/hooks/billing/useInvoices'
import { CreatePaymentRequest } from '@/lib/types'

interface PaymentFormModalProps {
  show: boolean
  onClose: () => void
  onSuccess: () => void
  invoiceId: number
  maxAmount?: number
}

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'check', label: 'Check' },
  { value: 'other', label: 'Other' },
]

export default function PaymentFormModal({
  show,
  onClose,
  onSuccess,
  invoiceId,
  maxAmount,
}: PaymentFormModalProps) {
  const createMutation = useCreatePayment()
  const { data: invoice } = useInvoice(invoiceId)
  const invoiceData = invoice as any

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreatePaymentRequest>({
    defaultValues: {
      invoice_id: invoiceId,
      amount: '',
      payment_method: 'card',
      transaction_id: '',
      status: 'completed',
      paid_at: new Date().toISOString().slice(0, 16), // Format for datetime-local
      notes: '',
    },
  })

  const amount = watch('amount')

  useEffect(() => {
    if (show) {
      reset({
        invoice_id: invoiceId || 0,
        amount: maxAmount ? maxAmount.toFixed(2) : '',
        payment_method: 'card',
        transaction_id: '',
        status: 'completed',
        paid_at: new Date().toISOString().slice(0, 16),
        notes: '',
      })
    }
  }, [show, invoiceId, maxAmount, reset])

  // Auto-set amount to balance if available
  useEffect(() => {
    if (invoiceData && invoiceData.balance !== undefined && !amount) {
      setValue('amount', invoiceData.balance.toFixed(2))
    }
  }, [invoiceData, amount, setValue])

  const onSubmit = async (data: CreatePaymentRequest) => {
    try {
      // Convert datetime-local to ISO string
      const paidAtDate = new Date(data.paid_at)
      const formattedData = {
        ...data,
        paid_at: paidAtDate.toISOString(),
      }

      await createMutation.mutateAsync(formattedData)
      onSuccess()
    } catch (error) {
      // Error handled by mutation
    }
  }

  const isLoading = createMutation.isPending

  if (!show) return null

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Record Payment</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={isLoading}
            ></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {invoiceData && (
                <div className="alert alert-info mb-3">
                  <strong>Invoice:</strong> {invoiceData.invoice_number}
                  <br />
                  <strong>Balance:</strong> ${invoiceData.balance?.toFixed(2) || '0.00'}
                </div>
              )}

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="amount" className="form-label">
                    Amount <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    id="amount"
                    step="0.01"
                    min="0"
                    max={maxAmount}
                    className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                    placeholder="0.00"
                    {...register('amount', {
                      required: 'Amount is required',
                      min: { value: 0.01, message: 'Amount must be greater than 0' },
                      max: maxAmount
                        ? {
                            value: maxAmount,
                            message: `Amount cannot exceed balance of $${maxAmount.toFixed(2)}`,
                          }
                        : undefined,
                    })}
                    disabled={isLoading}
                  />
                  {errors.amount && <div className="invalid-feedback">{errors.amount.message}</div>}
                  {maxAmount && (
                    <small className="text-muted">Maximum: ${maxAmount.toFixed(2)}</small>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="payment_method" className="form-label">
                    Payment Method <span className="text-danger">*</span>
                  </label>
                  <select
                    id="payment_method"
                    className={`form-select ${errors.payment_method ? 'is-invalid' : ''}`}
                    {...register('payment_method', {
                      required: 'Payment method is required',
                    })}
                    disabled={isLoading}
                  >
                    {PAYMENT_METHODS.map((method) => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                  {errors.payment_method && (
                    <div className="invalid-feedback">{errors.payment_method.message}</div>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="paid_at" className="form-label">
                    Payment Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    id="paid_at"
                    className={`form-control ${errors.paid_at ? 'is-invalid' : ''}`}
                    {...register('paid_at', {
                      required: 'Payment date is required',
                    })}
                    disabled={isLoading}
                  />
                  {errors.paid_at && (
                    <div className="invalid-feedback">{errors.paid_at.message}</div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="status" className="form-label">
                    Status <span className="text-danger">*</span>
                  </label>
                  <select
                    id="status"
                    className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                    {...register('status', {
                      required: 'Status is required',
                    })}
                    disabled={isLoading}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                  {errors.status && (
                    <div className="invalid-feedback">{errors.status.message}</div>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="transaction_id" className="form-label">Transaction ID</label>
                <input
                  type="text"
                  id="transaction_id"
                  className="form-control"
                  placeholder="Optional transaction ID..."
                  {...register('transaction_id')}
                  disabled={isLoading}
                />
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
                    Recording...
                  </>
                ) : (
                  'Record Payment'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

