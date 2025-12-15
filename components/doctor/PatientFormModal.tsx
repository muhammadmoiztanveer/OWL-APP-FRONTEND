'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { usePatient, useCreatePatient, useUpdatePatient } from '@/hooks/doctor/usePatients'
import { CreatePatientRequest, UpdatePatientRequest, Patient } from '@/lib/types'
import toast from 'react-hot-toast'

interface PatientFormModalProps {
  patientId?: number
  onClose: () => void
  onSuccess: () => void
}

export default function PatientFormModal({ patientId, onClose, onSuccess }: PatientFormModalProps) {
  const isEditing = !!patientId
  const { data: patientData, isLoading: loadingPatient } = usePatient(patientId || 0)
  const createMutation = useCreatePatient()
  const updateMutation = useUpdatePatient()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreatePatientRequest>({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      date_of_birth: '',
      phone: '',
      insurance_provider: '',
      insurance_policy_number: '',
      insurance_group_number: '',
      medical_history: '',
      assessment_type: null,
      assessment_instructions: '',
      assessment_notes: '',
    },
  })

  const assessmentType = watch('assessment_type')

  useEffect(() => {
    if (isEditing && patientData) {
      // Type guard: check if patientData has patient property
      const patientDataWithPatient = patientData as { patient?: Patient }
      const patient = patientDataWithPatient.patient
      
      if (patient) {
        // Split name into first and last name if available
        const nameParts = patient.name?.split(' ') || []
        const firstName = nameParts[0] || ''
        const lastName = nameParts.slice(1).join(' ') || ''
        
        reset({
          first_name: firstName,
          last_name: lastName,
          email: patient.email || '',
          date_of_birth: patient.date_of_birth
            ? new Date(patient.date_of_birth).toISOString().split('T')[0]
            : '',
          phone: patient.phone || '',
          insurance_provider: (patient as any).insurance_provider || '',
          insurance_policy_number: (patient as any).insurance_policy_number || '',
          insurance_group_number: (patient as any).insurance_group_number || '',
          medical_history: (patient as any).medical_history || '',
          assessment_type: null,
          assessment_instructions: '',
          assessment_notes: '',
        })
      }
    } else {
      // Reset form for new patient
      reset({
        first_name: '',
        last_name: '',
        email: '',
        date_of_birth: '',
        phone: '',
        insurance_provider: '',
        insurance_policy_number: '',
        insurance_group_number: '',
        medical_history: '',
        assessment_type: null,
        assessment_instructions: '',
        assessment_notes: '',
      })
    }
  }, [isEditing, patientData, reset])

  const onSubmit = async (data: CreatePatientRequest) => {
    try {
      // Combine first_name and last_name into name for backend
      const fullName = `${data.first_name} ${data.last_name}`.trim()
      
      if (isEditing && patientId) {
        // For editing, use name field (assessment order not handled in edit)
        const updateData: UpdatePatientRequest = {
          name: fullName,
          email: data.email,
          date_of_birth: data.date_of_birth,
          phone: data.phone,
          // Insurance Information
          insurance_provider: data.insurance_provider || undefined,
          insurance_policy_number: data.insurance_policy_number || undefined,
          insurance_group_number: data.insurance_group_number || undefined,
          // Medical History
          medical_history: data.medical_history || undefined,
        }
        await updateMutation.mutateAsync({ id: patientId, data: updateData })
      } else {
        // For creating, combine first_name and last_name into name for backend
        // Backend expects 'name' field, not 'first_name' and 'last_name'
        // Backend now handles assessment order creation automatically
        
        // Normalize assessment_type: ensure lowercase, trim whitespace
        let assessmentType = data.assessment_type?.toLowerCase().trim() || null
        if (assessmentType === 'none' || assessmentType === '') {
          assessmentType = null
        }
        
        // Validate assessment_type if provided
        const validTypes = ['phq-9', 'gad-7', 'comprehensive']
        if (assessmentType && !validTypes.includes(assessmentType)) {
          toast.error(`Invalid assessment type: ${assessmentType}. Must be one of: phq-9, gad-7, comprehensive, or none.`)
          return
        }
        
        // Combine instructions and notes for assessment instructions
        const combinedInstructions = [
          data.assessment_instructions,
          data.assessment_notes,
        ]
          .filter(Boolean)
          .join('\n\n')
          .trim() || undefined
        
        // Create payload for backend
        // Backend expects: name, email, date_of_birth, phone, insurance fields, medical_history, assessment_type (lowercase), instructions
        const createPayload: any = {
          name: fullName,
          email: data.email,
          date_of_birth: data.date_of_birth,
          phone: data.phone,
          // Insurance Information
          insurance_provider: data.insurance_provider || undefined,
          insurance_policy_number: data.insurance_policy_number || undefined,
          insurance_group_number: data.insurance_group_number || undefined,
          // Medical History
          medical_history: data.medical_history || undefined,
        }
        
        // Only include assessment_type if it's not null/empty
        if (assessmentType) {
          createPayload.assessment_type = assessmentType
          
          // Include instructions if provided
          if (combinedInstructions) {
            createPayload.instructions = combinedInstructions
          }
        }
        
        // Debug logging in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Creating patient with payload:', {
            ...createPayload,
            assessment_type: createPayload.assessment_type || 'none (not sending)',
          })
        }
        
        const response = await createMutation.mutateAsync(createPayload as CreatePatientRequest)
        
        // ✅ NEW: Show success message with login link info
        // Backend now returns { patient, invitation: { login_url } }
        // The mutation returns response.data which contains { patient, invitation }
        const responseData = response as any
        const invitation = responseData?.invitation
        
        if (invitation?.login_url) {
          toast.success(
            `Patient created successfully! Login link has been sent to ${data.email}`,
            {
              duration: 5000,
            }
          )
          // Log login URL for reference (doctor can copy if needed)
          if (process.env.NODE_ENV === 'development') {
            console.log('Patient Login URL:', invitation.login_url)
            console.log('Full Response:', responseData)
          }
          // Optionally show login URL in a modal or copy button
        } else {
          toast.success('Patient created successfully!')
        }
      }
      onSuccess()
    } catch (error: any) {
      // Enhanced error handling for assessment type validation
      if (error.response?.data?.message?.includes('assessment type is invalid')) {
        console.error('Invalid assessment type error:', {
          sentValue: data.assessment_type,
          normalizedValue: data.assessment_type?.toLowerCase().trim(),
        })
        toast.error('Invalid assessment type. Please select a valid option.')
      }
      // Other errors are handled by the mutation
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending || loadingPatient

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{isEditing ? 'Edit Patient' : 'Add New Patient'}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={isLoading}
            ></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {/* Patient Information Section */}
              <div className="mb-4">
                <h6 className="mb-3">Patient Information</h6>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      First Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                      {...register('first_name', { required: 'First name is required' })}
                    />
                    {errors.first_name && (
                      <div className="invalid-feedback">{errors.first_name.message}</div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Last Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                      {...register('last_name', { required: 'Last name is required' })}
                    />
                    {errors.last_name && (
                      <div className="invalid-feedback">{errors.last_name.message}</div>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email.message}</div>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Date of Birth</label>
                    <input
                      type="date"
                      className="form-control"
                      {...register('date_of_birth')}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="(123) 456-7890"
                      {...register('phone')}
                    />
                  </div>
                </div>
              </div>

              {/* Insurance Information Section */}
              <div className="mb-4">
                <h6 className="mb-3">Insurance Information</h6>
                
                <div className="mb-3">
                  <label className="form-label">Insurance Provider</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Blue Cross Blue Shield, Aetna, etc."
                    {...register('insurance_provider')}
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Policy Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Policy number"
                      {...register('insurance_policy_number')}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Group Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Group number (if applicable)"
                      {...register('insurance_group_number')}
                    />
                  </div>
                </div>
              </div>

              {/* Medical History Section */}
              <div className="mb-4">
                <h6 className="mb-3">Medical History</h6>
                
                <div className="mb-3">
                  <label className="form-label">Medical History & Background</label>
                  <textarea
                    className="form-control"
                    rows={6}
                    placeholder="Enter patient's medical history, past conditions, medications, allergies, etc."
                    {...register('medical_history')}
                  />
                  <small className="text-muted">
                    Include any relevant medical history, past conditions, current medications, allergies, and other important health information.
                  </small>
                </div>
              </div>

              {/* Initial Assessment Order Section - Only show when creating new patient */}
              {!isEditing && (
                <div className="mb-4">
                  <h6 className="mb-3">
                    <strong>Initial Assessment Order (Optional)</strong>
                  </h6>
                  
                  <div className="mb-3">
                    <label className="form-label">Assessment Type</label>
                    <select
                      className={`form-control ${errors.assessment_type ? 'is-invalid' : ''}`}
                      {...register('assessment_type')}
                    >
                      <option value="none">None (Send invite only)</option>
                      <option value="phq-9">Depression Screening (PHQ-9)</option>
                      <option value="gad-7">Anxiety Screening (GAD-7)</option>
                      <option value="comprehensive">Comprehensive Mental Health Assessment</option>
                    </select>
                    {errors.assessment_type && (
                      <div className="invalid-feedback">{errors.assessment_type.message}</div>
                    )}
                  </div>

                  {assessmentType && assessmentType !== 'none' && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">
                          Any specific instructions or context for this assessment
                        </label>
                        <textarea
                          className="form-control"
                          rows={4}
                          placeholder="Enter any specific instructions or context..."
                          {...register('assessment_instructions')}
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label">Assessment Notes (Optional)</label>
                        <textarea
                          className="form-control"
                          rows={3}
                          placeholder="Enter assessment notes..."
                          {...register('assessment_notes')}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
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
              <button
                type="submit"
                className="btn btn-danger"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditing ? 'Update' : 'Create & Invite'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

