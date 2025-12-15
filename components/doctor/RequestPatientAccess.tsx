'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { doctorApi } from '@/lib/api/doctor'
import toast from 'react-hot-toast'

interface AccessRequestFormData {
  patient_id: number
  message?: string
}

interface RequestPatientAccessProps {
  patientId: number
  patientName?: string
  onSuccess?: () => void
}

export default function RequestPatientAccess({
  patientId,
  patientName,
  onSuccess,
}: RequestPatientAccessProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccessRequestFormData>({
    defaultValues: {
      patient_id: patientId,
      message: '',
    },
  })

  const onSubmit = async (data: AccessRequestFormData) => {
    setLoading(true)
    setSuccess(false)

    try {
      const response = await doctorApi.createAccessRequest({
        patient_id: data.patient_id,
        message: data.message || undefined,
      })

      if (response.success) {
        toast.success('Access request sent. Waiting for patient approval.')
        setSuccess(true)
        reset()
        onSuccess?.()
        setTimeout(() => setSuccess(false), 3000)
      } else {
        toast.error(response.message || 'Failed to create access request')
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.patient_id?.[0] ||
        'Failed to create access request'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">Request Patient Access</h5>
      </div>
      <div className="card-body">
        {patientName && (
          <p className="text-muted mb-3">
            Request access to <strong>{patientName}</strong>'s records
          </p>
        )}

        {success && (
          <div className="alert alert-success" role="alert">
            Access request sent. Waiting for patient approval.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register('patient_id', { required: true })} />

          <div className="mb-3">
            <label className="form-label">Message to Patient (Optional)</label>
            <textarea
              className={`form-control ${errors.message ? 'is-invalid' : ''}`}
              rows={3}
              placeholder="Enter an optional message to the patient..."
              {...register('message')}
            />
            {errors.message && <div className="invalid-feedback">{errors.message.message}</div>}
            <small className="text-muted">
              This message will be shown to the patient when they review your access request.
            </small>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary" disabled={loading || success}>
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Sending...
                </>
              ) : (
                'Request Access'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
