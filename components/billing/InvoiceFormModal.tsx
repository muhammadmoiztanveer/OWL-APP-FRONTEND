'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateInvoice, useUpdateInvoice } from '@/hooks/billing/useInvoices'
import { useDoctors } from '@/hooks/doctors/useDoctors'
import { usePatients } from '@/hooks/doctor/usePatients'
import { Invoice, CreateInvoiceRequest } from '@/lib/types'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface InvoiceFormModalProps {
  show: boolean
  onClose: () => void
  onSuccess: () => void
  invoice?: Invoice
}

export default function InvoiceFormModal({
  show,
  onClose,
  onSuccess,
  invoice,
}: InvoiceFormModalProps) {
  const router = useRouter()
  const { user, isAdmin } = useAuth()
  const isEditing = !!invoice

  const createMutation = useCreateInvoice()
  const updateMutation = useUpdateInvoice()

  // Fetch doctors (for admin) and patients
  const { data: doctorsData } = useDoctors({ per_page: 1000 })
  const { data: patientsData } = usePatients({ per_page: 1000 })

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateInvoiceRequest>({
    defaultValues: {
      doctor_id: user?.doctor?.id || user?.id || 0,
      patient_id: null,
      assessment_id: null,
      subtotal: '',
      tax: '0',
      discount: '0',
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: '',
    },
  })

  const subtotal = watch('subtotal')
  const tax = watch('tax') || '0'
  const discount = watch('discount') || '0'

  useEffect(() => {
    if (show) {
      if (isEditing && invoice) {
        reset({
          doctor_id: invoice.doctor_id,
          patient_id: invoice.patient_id || null,
          assessment_id: invoice.assessment_id || null,
          subtotal: invoice.subtotal,
          tax: invoice.tax,
          discount: invoice.discount,
          due_date: invoice.due_date.split('T')[0],
          notes: invoice.notes || '',
        })
      } else {
        reset({
          doctor_id: user?.doctor?.id || user?.id || 0,
          patient_id: null,
          assessment_id: null,
          subtotal: '',
          tax: '0',
          discount: '0',
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          notes: '',
        })
      }
    }
  }, [show, isEditing, invoice, user, reset])

  const onSubmit = async (data: CreateInvoiceRequest) => {
    try {
      if (isEditing && invoice) {
        await updateMutation.mutateAsync({ id: invoice.id, data })
        onSuccess()
      } else {
        const result = await createMutation.mutateAsync(data)
        onSuccess()
        router.push(`/billing/invoices/${result.id}`)
      }
    } catch (error) {
      // Error handled by mutation
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  // Calculate total
  const calculateTotal = () => {
    const sub = parseFloat(subtotal || '0')
    const taxAmount = parseFloat(tax || '0')
    const disc = parseFloat(discount || '0')
    return (sub + taxAmount - disc).toFixed(2)
  }

  if (!show) return null

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{isEditing ? 'Edit Invoice' : 'Create New Invoice'}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={isLoading}
            ></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {/* Doctor Selection (Admin only) */}
              {isAdmin && doctorsData && (
                <div className="mb-3">
                  <label htmlFor="doctor_id" className="form-label">
                    Doctor <span className="text-danger">*</span>
                  </label>
                  <select
                    id="doctor_id"
                    className={`form-select ${errors.doctor_id ? 'is-invalid' : ''}`}
                    {...register('doctor_id', {
                      required: 'Doctor is required',
                      valueAsNumber: true,
                    })}
                    disabled={isLoading}
                  >
                    <option value="">-- Select Doctor --</option>
                    {doctorsData.data.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.first_name} {doctor.last_name} ({doctor.email})
                      </option>
                    ))}
                  </select>
                  {errors.doctor_id && (
                    <div className="invalid-feedback">{errors.doctor_id.message}</div>
                  )}
                </div>
              )}

              {/* Patient Selection */}
              <div className="mb-3">
                <label htmlFor="patient_id" className="form-label">
                  Patient (Optional)
                </label>
                <select
                  id="patient_id"
                  className="form-select"
                  {...register('patient_id', { valueAsNumber: true })}
                  disabled={isLoading}
                >
                  <option value="">-- Select Patient (Optional) --</option>
                  {patientsData?.data.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} ({patient.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount Fields */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="subtotal" className="form-label">
                    Subtotal <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    id="subtotal"
                    step="0.01"
                    min="0"
                    className={`form-control ${errors.subtotal ? 'is-invalid' : ''}`}
                    placeholder="0.00"
                    {...register('subtotal', {
                      required: 'Subtotal is required',
                      min: { value: 0, message: 'Subtotal must be positive' },
                    })}
                    disabled={isLoading}
                  />
                  {errors.subtotal && (
                    <div className="invalid-feedback">{errors.subtotal.message}</div>
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

              {/* Due Date */}
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

              {/* Notes */}
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
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditing ? 'Update Invoice' : 'Create Invoice'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}


