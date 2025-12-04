'use client'

import { useForm } from 'react-hook-form'
import { PatientProfile } from '@/lib/types'

interface AddressStepProps {
  data: Partial<PatientProfile>
  onChange: (data: Partial<PatientProfile>) => void
  onSubmit?: () => void
}

const US_STATES = [
  'AL',
  'AK',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'FL',
  'GA',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY',
]

export default function AddressStep({ data, onChange, onSubmit }: AddressStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
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
      <h2 className="mb-3">Address Information</h2>
      <p className="text-muted mb-4">This information is optional but helps us provide better care.</p>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="mb-3">
          <label className="form-label">Street Address</label>
          <input
            type="text"
            className="form-control"
            {...register('street_address', {
              onChange: (e) => handleChange('street_address', e.target.value),
            })}
          />
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">City</label>
            <input
              type="text"
              className="form-control"
              {...register('city', {
                onChange: (e) => handleChange('city', e.target.value),
              })}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label">State</label>
            <select
              className="form-control"
              {...register('state', {
                onChange: (e) => handleChange('state', e.target.value),
              })}
            >
              <option value="">Select State</option>
              {US_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label">Zip Code</label>
            <input
              type="text"
              className={`form-control ${errors.zip_code ? 'is-invalid' : ''}`}
              {...register('zip_code', {
                pattern: {
                  value: /^\d{5}(-\d{4})?$/,
                  message: 'Invalid zip code format',
                },
                onChange: (e) => handleChange('zip_code', e.target.value),
              })}
              maxLength={10}
              placeholder="12345"
            />
            {errors.zip_code && <div className="invalid-feedback">{errors.zip_code.message}</div>}
          </div>
        </div>
      </form>
    </div>
  )
}
