'use client'

import { useForm } from 'react-hook-form'
import { PatientProfile } from '@/lib/types'

interface MedicalBackgroundStepProps {
  data: Partial<PatientProfile>
  onChange: (data: Partial<PatientProfile>) => void
  onSubmit?: () => void
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export default function MedicalBackgroundStep({ data, onChange, onSubmit }: MedicalBackgroundStepProps) {
  const {
    register,
    handleSubmit,
  } = useForm<Partial<PatientProfile>>({
    defaultValues: data,
  })

  const onFormSubmit = (formData: Partial<PatientProfile>) => {
    onChange(formData)
    if (onSubmit) {
      onSubmit()
    }
  }

  const handleChange = (field: keyof PatientProfile, value: any) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="profile-step">
      <h2 className="mb-3">Medical Background</h2>
      <p className="text-muted mb-4">
        Please provide your medical history. This information is optional but helps us provide better care.
      </p>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="mb-3">
          <label className="form-label">Medical History</label>
          <textarea
            rows={4}
            className="form-control"
            {...register('medical_history', {
              onChange: (e) => handleChange('medical_history', e.target.value || null),
            })}
            placeholder="e.g., Hypertension, Diabetes Type 2"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Surgical History</label>
          <textarea
            rows={4}
            className="form-control"
            {...register('surgical_history', {
              onChange: (e) => handleChange('surgical_history', e.target.value || null),
            })}
            placeholder="e.g., Appendectomy (2010)"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Family History</label>
          <textarea
            rows={4}
            className="form-control"
            {...register('family_history', {
              onChange: (e) => handleChange('family_history', e.target.value || null),
            })}
            placeholder="e.g., Father: Heart disease, Mother: Diabetes"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Current Medications</label>
          <textarea
            rows={4}
            className="form-control"
            {...register('current_medications', {
              onChange: (e) => handleChange('current_medications', e.target.value || null),
            })}
            placeholder="e.g., Lisinopril 10mg daily, Metformin 500mg twice daily"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Allergies</label>
          <textarea
            rows={3}
            className="form-control"
            {...register('allergies', {
              onChange: (e) => handleChange('allergies', e.target.value || null),
            })}
            placeholder="e.g., Penicillin, Latex"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Primary Care Physician</label>
          <input
            type="text"
            className="form-control"
            {...register('primary_care_physician', {
              onChange: (e) => handleChange('primary_care_physician', e.target.value || null),
            })}
            placeholder="Dr. Smith"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Blood Type</label>
          <select
            className="form-control"
            {...register('blood_type', {
              onChange: (e) => handleChange('blood_type', e.target.value || null),
            })}
          >
            <option value="">Select Blood Type</option>
            {BLOOD_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Social History</label>
          <textarea
            rows={3}
            className="form-control"
            {...register('social_history', {
              onChange: (e) => handleChange('social_history', e.target.value || null),
            })}
            placeholder="e.g., Non-smoker, occasional alcohol, exercise 3x/week"
          />
        </div>
      </form>
    </div>
  )
}
