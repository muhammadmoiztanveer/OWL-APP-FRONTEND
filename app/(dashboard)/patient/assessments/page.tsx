'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Breadcrumb from '@/components/common/Breadcrumb'
import PatientAssessmentsList from '@/components/patient/PatientAssessmentsList'

export default function PatientAssessmentsPage() {
  const router = useRouter()
  const { user } = useAuth()

  if (user?.account_type !== 'patient') {
    router.push('/dashboard')
    return null
  }

  return (
    <>
      <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="My Assessments" />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">My Assessments</h5>
              <p className="text-muted mb-0">View and complete assessments assigned by your doctor</p>
            </div>
            <div className="card-body">
              <PatientAssessmentsList />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
