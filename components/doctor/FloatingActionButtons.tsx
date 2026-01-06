'use client'

import { useState } from 'react'
import { usePermissions } from '@/hooks/usePermissions'
import { useAuth } from '@/contexts/AuthContext'
import PatientFormModal from './PatientFormModal'
import CreateAssessmentOrderModal from './CreateAssessmentOrderModal'

export default function FloatingActionButtons() {
  const { hasPermission } = usePermissions()
  const isImpersonating = false // TODO: Implement impersonation check
  const { user } = useAuth()
  const [showPatientModal, setShowPatientModal] = useState(false)
  const [showAssessmentOrderModal, setShowAssessmentOrderModal] = useState(false)
  const [showOrderAssessmentModal, setShowOrderAssessmentModal] = useState(false)

  // Show FABs only if user is a doctor (has doctor role) or is impersonating a doctor
  // Also check if they have the necessary permissions
  const canCreatePatient = hasPermission('patient.create')
  const canCreateAssessmentOrder = hasPermission('assessment_order.create')
  const hasDoctorRole = user?.roles?.some((role) => role.name === 'doctor') || isImpersonating

  // Don't show FABs if user doesn't have doctor role or necessary permissions
  if (!hasDoctorRole || (!canCreatePatient && !canCreateAssessmentOrder)) {
    return null
  }

  return (
    <>
      {/* Floating Action Buttons Container */}
      <div
        className="position-fixed"
        style={{
          bottom: '30px',
          right: '30px',
          zIndex: 1000,
        }}
      >
        <div className="d-flex flex-column gap-3">
          {/* Order New Assessment Button */}
          {canCreateAssessmentOrder && (
            <button
              type="button"
              className="btn btn-danger rounded-circle"
              style={{
                width: '56px',
                height: '56px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => setShowOrderAssessmentModal(true)}
              title="Order New Assessment"
            >
              <i className="mdi mdi-clipboard-text-plus" style={{ fontSize: '24px' }}></i>
            </button>
          )}

          {/* Create Assessment Order Button */}
          {canCreateAssessmentOrder && (
            <button
              type="button"
              className="btn btn-danger rounded-circle"
              style={{
                width: '56px',
                height: '56px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => setShowAssessmentOrderModal(true)}
              title="Create Assessment Order"
            >
              <i className="mdi mdi-file-document-plus" style={{ fontSize: '24px' }}></i>
            </button>
          )}

          {/* Create Patient Button */}
          {canCreatePatient && (
            <button
              type="button"
              className="btn btn-danger rounded-circle"
              style={{
                width: '56px',
                height: '56px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => setShowPatientModal(true)}
              title="Add New Patient"
            >
              <i className="mdi mdi-account-plus" style={{ fontSize: '24px' }}></i>
            </button>
          )}
        </div>
      </div>

      {/* Patient Form Modal */}
      {showPatientModal && (
        <PatientFormModal
          onClose={() => setShowPatientModal(false)}
          onSuccess={() => {
            setShowPatientModal(false)
          }}
        />
      )}

      {/* Assessment Order Modal */}
      {showAssessmentOrderModal && (
        <CreateAssessmentOrderModal
          show={showAssessmentOrderModal}
          onClose={() => setShowAssessmentOrderModal(false)}
          onSuccess={() => {
            setShowAssessmentOrderModal(false)
          }}
        />
      )}

      {/* Order New Assessment Modal */}
      {showOrderAssessmentModal && (
        <CreateAssessmentOrderModal
          show={showOrderAssessmentModal}
          onClose={() => setShowOrderAssessmentModal(false)}
          onSuccess={() => {
            setShowOrderAssessmentModal(false)
          }}
        />
      )}
    </>
  )
}

