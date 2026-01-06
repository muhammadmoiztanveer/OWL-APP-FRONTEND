'use client'

import { useState } from 'react'
import { usePatient } from '@/hooks/doctor/usePatients'
import StatusBadge from '@/components/common/StatusBadge'
import PatientAssessmentResults from '@/components/doctor/PatientAssessmentResults'
import AssignAssessmentModal from '@/components/doctor/AssignAssessmentModal'
import Link from 'next/link'

interface PatientDetailsModalProps {
  patientId: number
  onClose: () => void
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateString
  }
}

export default function PatientDetailsModal({ patientId, onClose }: PatientDetailsModalProps) {
  const { data, isLoading } = usePatient(patientId)
  const dataTyped = data as any
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleAssessmentAssigned = () => {
    // Trigger refresh by updating key
    setRefreshKey((prev) => prev + 1)
    // The PatientAssessmentResults component will refetch when patientId changes
    // For now, we'll just close the modal - the parent can refetch if needed
  }

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Patient Details</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {isLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : data ? (
              <>
                <div className="mb-4">
                  <h6 className="mb-3">Patient Information</h6>
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <th style={{ width: '30%' }}>Name:</th>
                        <td>{dataTyped.patient.name}</td>
                      </tr>
                      <tr>
                        <th>Email:</th>
                        <td>{dataTyped.patient.email}</td>
                      </tr>
                      <tr>
                        <th>Date of Birth:</th>
                        <td>{formatDate(dataTyped.patient.date_of_birth)}</td>
                      </tr>
                      <tr>
                        <th>Phone:</th>
                        <td>{dataTyped.patient.phone || '-'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">Assessment Results</h6>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => setShowAssignModal(true)}
                    >
                      <i className="mdi mdi-plus me-1"></i>
                      Assign Assessment
                    </button>
                  </div>
                  <PatientAssessmentResults patientId={patientId} />
                </div>
              </>
            ) : (
              <p className="text-muted">No data available</p>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>

      {showAssignModal && dataTyped?.patient && (
        <AssignAssessmentModal
          patientId={patientId}
          patientName={dataTyped.patient.name}
          onClose={() => setShowAssignModal(false)}
          onSuccess={handleAssessmentAssigned}
        />
      )}
    </div>
  )
}

