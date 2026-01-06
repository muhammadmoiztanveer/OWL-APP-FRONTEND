'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { patientApi } from '@/lib/api/patient'
import { doctorsApi } from '@/lib/api/doctors'
import Breadcrumb from '@/components/common/Breadcrumb'
import toast from 'react-hot-toast'

interface Doctor {
  id: number
  first_name: string
  last_name: string
  practice_name: string
  full_name?: string
}

export default function ChangeDoctorPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [selectedDoctorId, setSelectedDoctorId] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingDoctors, setLoadingDoctors] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    setLoadingDoctors(true)
    try {
      // Try patient-specific endpoint first, fallback to general doctors endpoint
      let response
      try {
        // Try patient-specific endpoint for available doctors
        response = await patientApi.getAvailableDoctors()
      } catch (patientErr: any) {
        // If patient endpoint doesn't exist (404) or fails, try general doctors endpoint
        if (patientErr.response?.status === 404) {
          console.log('Patient-specific endpoint not found, using general doctors endpoint')
          response = await doctorsApi.list({ per_page: 100 })
        } else {
          throw patientErr
        }
      }

      if (response.success && response.data) {
        // Format doctors with full_name
        const formattedDoctors = response.data.map((doctor: any) => ({
          ...doctor,
          full_name: `${doctor.first_name} ${doctor.last_name}`,
        }))
        setDoctors(formattedDoctors)
      } else {
        throw new Error((response as any).message || 'Failed to load doctors')
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load doctors'
      console.error('Failed to load doctors:', {
        error: err,
        response: err.response?.data,
        status: err.response?.status,
      })
      
      // Show more specific error message
      if (err.response?.status === 403) {
        toast.error('You do not have permission to view doctors. Please contact support.')
        setError('Permission denied. Please contact your administrator.')
      } else if (err.response?.status === 404) {
        toast.error('Doctors endpoint not found. Please contact support.')
        setError('Service unavailable. Please contact support.')
      } else {
        toast.error(errorMessage)
        setError(errorMessage)
      }
    } finally {
      setLoadingDoctors(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await patientApi.createDoctorChangeRequest({
        requested_doctor_id: parseInt(selectedDoctorId),
        reason: reason || undefined,
      })

      if (response.success) {
        setSuccess('Doctor change request submitted. Waiting for admin approval.')
        toast.success('Request submitted successfully!')
        setTimeout(() => {
          router.push('/patient/dashboard')
        }, 2000)
      } else {
        setError(response.message || 'Failed to submit request')
        toast.error(response.message || 'Failed to submit request')
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to submit request'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Request Doctor Change" />

      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Request Doctor Change</h5>
            </div>
            <div className="card-body">
              <div className="alert alert-info" role="alert">
                <i className="mdi mdi-information-outline me-2"></i>
                You can request to change your current doctor. Your request will be reviewed by an administrator.
                You will be notified once your request is approved or rejected.
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">
                    Select New Doctor <span className="text-danger">*</span>
                  </label>
                  {loadingDoctors ? (
                    <div className="text-center py-3">
                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Loading doctors...</span>
                      </div>
                    </div>
                  ) : (
                    <select
                      className={`form-control ${error && !selectedDoctorId ? 'is-invalid' : ''}`}
                      value={selectedDoctorId}
                      onChange={(e) => setSelectedDoctorId(e.target.value)}
                      required
                    >
                      <option value="">-- Select Doctor --</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.practice_name} - {doctor.full_name || `${doctor.first_name} ${doctor.last_name}`}
                        </option>
                      ))}
                    </select>
                  )}
                  {error && !selectedDoctorId && <div className="invalid-feedback">{error}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Reason for Change (Optional)</label>
                  <textarea
                    className="form-control"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Why do you want to change doctors? (Optional)"
                    rows={4}
                  />
                  <small className="text-muted">This information will help administrators review your request.</small>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success" role="alert">
                    {success}
                  </div>
                )}

                <div className="d-flex gap-2 justify-content-end">
                  <button type="button" className="btn btn-secondary" onClick={() => router.back()}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading || !selectedDoctorId}>
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Submitting...
                      </>
                    ) : (
                      'Submit Request'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
