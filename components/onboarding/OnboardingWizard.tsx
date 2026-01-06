'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  useOnboardingSteps,
  useUpdateOnboardingStep,
  useUpdateProfileStep,
  useCompleteOnboarding,
} from '@/hooks/onboarding/useOnboarding'
import { doctorsApi } from '@/lib/api/doctors'
import { OnboardingStep, PatientProfile, DoctorProfile } from '@/lib/types'
import StepIndicator from './StepIndicator'
import WelcomeStep from './steps/WelcomeStep'
import BasicInformationStep from './steps/BasicInformationStep'
import AddressStep from './steps/AddressStep'
import DemographicsStep from './steps/DemographicsStep'
import EmergencyContactStep from './steps/EmergencyContactStep'
// Insurance and Medical steps removed - handled by doctors after onboarding
import DoctorBasicStep from './steps/DoctorBasicStep'
import DoctorPracticeStep from './steps/DoctorPracticeStep'
import DoctorAddressStep from './steps/DoctorAddressStep'
import toast from 'react-hot-toast'

export default function OnboardingWizard() {
  const router = useRouter()
  const { user } = useAuth()
  const { data: stepsData, isLoading: loadingSteps } = useOnboardingSteps()
  const updateStepMutation = useUpdateOnboardingStep()
  const updateProfileStepMutation = useUpdateProfileStep()
  const completeOnboardingMutation = useCompleteOnboarding()

  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  // Initialize formData with user's basic info if available
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    if (user) {
      if (user.account_type === 'patient') {
        return {
          name: user.name || '',
          email: user.email || '',
        }
      } else if (user.account_type === 'doctor' && user.doctor) {
        return {
          first_name: user.doctor.first_name || '',
          last_name: user.doctor.last_name || '',
          email: user.doctor.email || user.email || '',
          phone_number: user.doctor.phone_number || '',
        }
      } else if (user.account_type === 'doctor') {
        return {
          email: user.email || '',
        }
      }
    }
    return {}
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Filter out insurance and medical steps for patients (doctor-driven flow)
  const allSteps = (stepsData as any)?.steps || []
  const steps = allSteps.filter((step: any) => {
    // Remove insurance and medical background steps for patients
    if (user?.account_type === 'patient') {
      return step.key !== 'profile_insurance' && step.key !== 'profile_medical'
    }
    return true
  })
  const isPatient = user?.account_type === 'patient'
  const isDoctor = user?.account_type === 'doctor'

  // Set current step to first incomplete step
  useEffect(() => {
    if (steps.length > 0) {
      const firstIncompleteIndex = steps.findIndex((s: any) => !s.completed)
      if (firstIncompleteIndex >= 0) {
        setCurrentStepIndex(firstIncompleteIndex)
      }
    }
  }, [steps])

  // Load existing profile data if available (only once when user/steps are available)
  useEffect(() => {
    if (!user || steps.length === 0) return

    setFormData((prev) => {
      // Don't overwrite if data already exists
      if (isPatient && prev.name && prev.email) return prev
      if (isDoctor && prev.email && (prev.first_name || prev.last_name)) return prev

      // For patients, pre-populate with user data from signup
      if (isPatient) {
        return {
          ...prev,
          name: prev.name || user.name || '',
          email: prev.email || user.email || '',
        }
      }

      // For doctors with existing profile
      if (isDoctor && user.doctor) {
        return {
          ...prev,
          first_name: prev.first_name || user.doctor.first_name || '',
          last_name: prev.last_name || user.doctor.last_name || '',
          email: prev.email || user.doctor.email || user.email || '',
          phone_number: prev.phone_number || user.doctor.phone_number || '',
          practice_name: prev.practice_name || user.doctor.practice_name || '',
          specialty: prev.specialty || user.doctor.specialty || '',
          website: prev.website || user.doctor.website || '',
          office_hours: prev.office_hours || user.doctor.office_hours || '',
          street_address: prev.street_address || user.doctor.street_address || '',
          city: prev.city || user.doctor.city || '',
          state: prev.state || user.doctor.state || '',
          zip_code: prev.zip_code || user.doctor.zip_code || '',
        }
      }

      // For new doctors, pre-populate with user email
      if (isDoctor) {
        return {
          ...prev,
          email: prev.email || user.email || '',
        }
      }

      return prev
    })
  }, [user?.id, user?.name, user?.email, user?.account_type, steps.length, isDoctor, isPatient])

  const validateStep = (stepIndex: number): boolean => {
    const step = steps[stepIndex]
    if (!step) return false

    const errors: Record<string, string> = {}

    // Validate based on step type
    if (step.key === 'profile_basic' || step.key === 'doctor_basic') {
      if (isPatient) {
        if (!formData.name) errors.name = 'Name is required'
        if (!formData.email) errors.email = 'Email is required'
        if (!formData.date_of_birth) errors.date_of_birth = 'Date of birth is required'
        if (!formData.phone) errors.phone = 'Phone number is required'
      } else if (isDoctor) {
        if (!formData.first_name) errors.first_name = 'First name is required'
        if (!formData.last_name) errors.last_name = 'Last name is required'
        if (!formData.email) errors.email = 'Email is required'
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNext = async () => {
    // Validate current step
    if (!validateStep(currentStepIndex)) {
      toast.error('Please fill in all required fields')
      return
    }

    const step = steps[currentStepIndex]
    if (!step) return

    try {
      // For patient profile steps, use profile/step endpoint
      if (step.key.startsWith('profile_')) {
        const profileStep = step.key.replace('profile_', '') as
          | 'basic'
          | 'address'
          | 'demographics'
          | 'emergency'

        await updateProfileStepMutation.mutateAsync({
          step: profileStep,
          data: formData as Partial<PatientProfile>,
        })
      } else if (step.key.startsWith('doctor_')) {
        // For doctor steps, update doctor profile via doctor API
        const doctorStep = step.key.replace('doctor_', '')
        
        // Prepare update data based on step
        const updateData: Partial<DoctorProfile> = {}
        
        if (doctorStep === 'basic') {
          updateData.first_name = formData.first_name
          updateData.last_name = formData.last_name
          updateData.email = formData.email
          updateData.phone_number = formData.phone_number
        } else if (doctorStep === 'practice') {
          updateData.practice_name = formData.practice_name
          updateData.specialty = formData.specialty
          updateData.website = formData.website
          updateData.office_hours = formData.office_hours
        } else if (doctorStep === 'address') {
          updateData.street_address = formData.street_address
          updateData.city = formData.city
          updateData.state = formData.state
          updateData.zip_code = formData.zip_code
        }
        
        // Update doctor profile if doctor ID exists
        if (user?.doctor?.id) {
          try {
            await doctorsApi.update(user.doctor.id, updateData)
          } catch (error: any) {
            // If update fails, log but continue to mark step as complete
            console.error('Failed to update doctor profile:', error)
            toast.error('Failed to update doctor profile. Please try again.')
            throw error
          }
        }
        
        // Mark step as complete
        await updateStepMutation.mutateAsync({
          step: step.key,
          completed: true,
        })
      } else {
        // For other steps (like welcome), use regular step endpoint
        await updateStepMutation.mutateAsync({
          step: step.key,
          completed: true,
        })
      }

      // Move to next step
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1)
        setValidationErrors({})
      } else {
        // Complete onboarding
        await handleComplete()
      }
    } catch (error: any) {
      console.error('Failed to save step:', error)
      // Error is already handled by the mutation
    }
  }

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
      setValidationErrors({})
    }
  }

  const handleComplete = async () => {
    try {
      await completeOnboardingMutation.mutateAsync()
      router.push('/patient/dashboard')
    } catch (error: any) {
      console.error('Failed to complete onboarding:', error)
    }
  }

  const handleSkipAll = async () => {
    try {
      // Mark onboarding as skipped (optional - backend may handle this)
      // For now, just redirect to dashboard
      router.push('/patient/dashboard')
    } catch (error: any) {
      console.error('Failed to skip onboarding:', error)
      // Still redirect even if there's an error
      router.push('/patient/dashboard')
    }
  }

  const handleSkipStep = async () => {
    const step = steps[currentStepIndex]
    if (!step) return

    try {
      // Mark current step as skipped (optional)
      if (step.key.startsWith('profile_')) {
        // Skip profile step - just mark as completed without data
        await updateProfileStepMutation.mutateAsync({
          step: step.key.replace('profile_', '') as 'basic' | 'address' | 'demographics' | 'emergency',
          data: {},
        })
      } else {
        // Mark step as complete (skipped)
        await updateStepMutation.mutateAsync({
          step: step.key,
          completed: true,
        })
      }

      // Move to next step
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1)
        setValidationErrors({})
      } else {
        // If last step, redirect to dashboard
        router.push('/patient/dashboard')
      }
    } catch (error: any) {
      console.error('Failed to skip step:', error)
      // Continue anyway
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1)
      } else {
        router.push('/patient/dashboard')
      }
    }
  }

  const renderStepContent = () => {
    if (steps.length === 0) {
      return (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )
    }

    const step = steps[currentStepIndex]
    if (!step) return null

    switch (step.key) {
      case 'welcome':
        return <WelcomeStep onSubmit={handleNext} />

      // Patient steps
      case 'profile_basic':
        return (
          <BasicInformationStep
            data={formData as Partial<PatientProfile>}
            onChange={setFormData}
            errors={validationErrors}
          />
        )
      case 'profile_address':
        return (
          <AddressStep data={formData as Partial<PatientProfile>} onChange={setFormData} />
        )
      case 'profile_demographics':
        return (
          <DemographicsStep data={formData as Partial<PatientProfile>} onChange={setFormData} />
        )
      case 'profile_emergency':
        return (
          <EmergencyContactStep data={formData as Partial<PatientProfile>} onChange={setFormData} />
        )
      // Insurance and medical steps removed - now handled by doctors after onboarding

      // Doctor steps
      case 'doctor_basic':
        return (
          <DoctorBasicStep
            data={formData as Partial<DoctorProfile>}
            onChange={setFormData}
            errors={validationErrors}
          />
        )
      case 'doctor_practice':
        return (
          <DoctorPracticeStep data={formData as Partial<DoctorProfile>} onChange={setFormData} />
        )
      case 'doctor_address':
        return (
          <DoctorAddressStep data={formData as Partial<DoctorProfile>} onChange={setFormData} />
        )

      default:
        return <div>Unknown step: {step.key}</div>
    }
  }

  if (loadingSteps) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (steps.length === 0) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">No onboarding steps found.</div>
      </div>
    )
  }

  const isLoading =
    updateStepMutation.isPending ||
    updateProfileStepMutation.isPending ||
    completeOnboardingMutation.isPending

  return (
    <div className="onboarding-container">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card">
              <div className="card-body p-4">
                {/* Header */}
                <div className="onboarding-header text-center mb-4">
                  <h1 className="mb-2">Complete Your Profile <span className="badge bg-info">Optional</span></h1>
                  <p className="text-muted">
                    Step {currentStepIndex + 1} of {steps.length}
                  </p>
                  <div className="alert alert-info mt-3 mb-0" role="alert">
                    <i className="mdi mdi-information-outline me-2"></i>
                    All information below is optional. Your doctor has already filled in your required information.
                    You can add additional details or skip this step entirely.
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="progress mb-4" style={{ height: '8px' }}>
                  <div
                    className="progress-bar bg-primary"
                    role="progressbar"
                    style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                    aria-valuenow={currentStepIndex + 1}
                    aria-valuemin={0}
                    aria-valuemax={steps.length}
                  />
                </div>

                {/* Step Indicator */}
                {steps.length > 1 && (
                  <div className="mb-4">
                    <StepIndicator steps={steps} currentStep={currentStepIndex} />
                  </div>
                )}

                {/* Step Content */}
                <div className="step-content-wrapper mb-4">{renderStepContent()}</div>

                {/* Navigation */}
                <div className="step-navigation d-flex justify-content-between align-items-center">
                  <div>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handlePrevious}
                      disabled={currentStepIndex === 0 || isLoading}
                    >
                      Previous
                    </button>
                  </div>

                  <div className="d-flex gap-2">
                    {/* Skip All Button */}
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleSkipAll}
                      disabled={isLoading}
                    >
                      Skip All & Go to Dashboard
                    </button>

                    {currentStepIndex === steps.length - 1 ? (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleComplete}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Completing...
                          </>
                        ) : (
                          'Complete'
                        )}
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={handleSkipStep}
                          disabled={isLoading}
                        >
                          Skip Step
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleNext}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Saving...
                            </>
                          ) : (
                            'Next'
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
