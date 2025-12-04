'use client'

interface WelcomeStepProps {
  onSubmit: () => void
}

export default function WelcomeStep({ onSubmit }: WelcomeStepProps) {
  return (
    <div className="welcome-step text-center">
      <div className="mb-4">
        <h2 className="mb-3">Welcome to Our Platform!</h2>
        <p className="text-muted mb-4">
          We're excited to have you here. Let's get started by completing your profile.
        </p>
        <p className="text-muted">This will only take a few minutes.</p>
      </div>

      <div className="welcome-features mb-4">
        <div className="row justify-content-center">
          <div className="col-md-4 mb-3">
            <div className="feature-item p-3">
              <div className="mb-2">
                <i className="mdi mdi-shield-check text-success" style={{ fontSize: '48px' }}></i>
              </div>
              <p className="mb-0">Secure and HIPAA compliant</p>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="feature-item p-3">
              <div className="mb-2">
                <i className="mdi mdi-lock text-primary" style={{ fontSize: '48px' }}></i>
              </div>
              <p className="mb-0">Your information is protected</p>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="feature-item p-3">
              <div className="mb-2">
                <i className="mdi mdi-clock-fast text-info" style={{ fontSize: '48px' }}></i>
              </div>
              <p className="mb-0">Quick and easy setup</p>
            </div>
          </div>
        </div>
      </div>

      <button onClick={onSubmit} className="btn btn-primary btn-lg">
        Get Started
      </button>
    </div>
  )
}
