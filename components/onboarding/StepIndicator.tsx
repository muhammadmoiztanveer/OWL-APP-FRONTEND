'use client'

import { OnboardingStep } from '@/lib/types'

interface StepIndicatorProps {
  steps: OnboardingStep[]
  currentStep: number
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="step-indicator mb-4">
      <div className="row">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isActive = index === currentStep
          const isUpcoming = index > currentStep

          return (
            <div key={step.key} className="col">
              <div className="d-flex align-items-center">
                <div
                  className={`step-item d-flex flex-column align-items-center ${
                    isCompleted ? 'completed' : isActive ? 'active' : 'upcoming'
                  }`}
                  style={{ flex: 1 }}
                >
                  <div
                    className={`step-number rounded-circle d-flex align-items-center justify-content-center mb-2 ${
                      isCompleted
                        ? 'bg-success text-white'
                        : isActive
                        ? 'bg-primary text-white'
                        : 'bg-light text-muted'
                    }`}
                    style={{
                      width: '40px',
                      height: '40px',
                      fontSize: '18px',
                      fontWeight: 'bold',
                    }}
                  >
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <div
                    className={`step-label text-center ${
                      isActive ? 'text-primary fw-bold' : isCompleted ? 'text-success' : 'text-muted'
                    }`}
                    style={{ fontSize: '14px' }}
                  >
                    {step.label}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`step-connector mx-2 ${
                      isCompleted ? 'bg-success' : 'bg-light'
                    }`}
                    style={{
                      height: '2px',
                      flex: 1,
                      minWidth: '30px',
                    }}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
