'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Breadcrumb from '@/components/common/Breadcrumb'
import DoctorChangeRequestStatus from '@/components/patient/DoctorChangeRequestStatus'
import PatientAssessmentsList from '@/components/patient/PatientAssessmentsList'
import Link from 'next/link'
import api from '@/lib/api/client'

interface PatientData {
  patient: {
    id: number
    name: string
    email: string
    date_of_birth?: string
    phone?: string
  }
  doctor: {
    id: number
    full_name: string
    practice_name: string
    email?: string
    phone_number?: string
  }
}

export default function PatientDashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [patientData, setPatientData] = useState<PatientData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.account_type !== 'patient') {
      router.push('/dashboard')
      return
    }

    fetchPatientData()
  }, [user, router])

  const fetchPatientData = async () => {
    setLoading(true)
    try {
      // Get patient profile with doctor info
      // Backend endpoint: GET /api/patient/profile
      const response = await api.get<{ success: boolean; data?: PatientData }>('/patient/profile')
      if (response.data.success && response.data.data) {
        setPatientData(response.data.data)
      }
    } catch (err: any) {
      console.error('Failed to fetch patient data', err)
      // If endpoint doesn't exist yet, that's okay - backend will implement it
      // For now, we'll show a message or handle gracefully
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Dashboard" />
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Patient Dashboard" />

      <div className="row">
        {/* Current Doctor Information */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Your Current Doctor</h5>
            </div>
            <div className="card-body">
              {patientData?.doctor ? (
                <>
                  <h4 className="mb-2">{patientData.doctor.practice_name}</h4>
                  <p className="text-muted mb-2">
                    <strong>Doctor:</strong> {patientData.doctor.full_name}
                  </p>
                  {patientData.doctor.email && (
                    <p className="text-muted mb-2">
                      <strong>Email:</strong> {patientData.doctor.email}
                    </p>
                  )}
                  {patientData.doctor.phone_number && (
                    <p className="text-muted mb-3">
                      <strong>Phone:</strong> {patientData.doctor.phone_number}
                    </p>
                  )}
                  <Link href="/patient/change-doctor" className="btn btn-outline-primary btn-sm">
                    <i className="mdi mdi-account-switch me-1"></i>
                    Request Doctor Change
                  </Link>
                </>
              ) : (
                <p className="text-muted">No doctor assigned</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <Link href="/patient/assessments" className="card border text-decoration-none">
                    <div className="card-body text-center">
                      <i className="mdi mdi-clipboard-text font-size-48 text-primary mb-3"></i>
                      <h5>My Assessments</h5>
                      <p className="text-muted mb-0">View and complete assessments</p>
                    </div>
                  </Link>
                </div>
                <div className="col-md-6 mb-3">
                  <Link href="/patient/change-doctor" className="card border text-decoration-none">
                    <div className="card-body text-center">
                      <i className="mdi mdi-account-switch font-size-48 text-info mb-3"></i>
                      <h5>Change Doctor</h5>
                      <p className="text-muted mb-0">Request to change your doctor</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Assessments */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Assigned Assessments</h5>
            </div>
            <div className="card-body">
              <PatientAssessmentsList />
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Change Request Status */}
      <div className="row mt-4">
        <div className="col-12">
          <DoctorChangeRequestStatus />
        </div>
      </div>
    </>
  )
}
