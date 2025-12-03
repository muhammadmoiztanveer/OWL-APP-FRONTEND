'use client'

import { usePatient } from '@/hooks/doctor/usePatients'
import StatusBadge from '@/components/common/StatusBadge'
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
                        <td>{data.patient.name}</td>
                      </tr>
                      <tr>
                        <th>Email:</th>
                        <td>{data.patient.email}</td>
                      </tr>
                      <tr>
                        <th>Date of Birth:</th>
                        <td>{formatDate(data.patient.date_of_birth)}</td>
                      </tr>
                      <tr>
                        <th>Phone:</th>
                        <td>{data.patient.phone || '-'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <h6 className="mb-3">Assessments</h6>
                  {data.assessments && data.assessments.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Assessment Type</th>
                            <th>Score</th>
                            <th>Status</th>
                            <th>Completed Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.assessments.map((assessment) => (
                            <tr key={assessment.id}>
                              <td>{assessment.assessment_type}</td>
                              <td>
                                <span className="fw-bold">{assessment.score}</span>
                              </td>
                              <td>
                                <StatusBadge status={assessment.status} />
                              </td>
                              <td>{formatDate(assessment.completed_on)}</td>
                              <td>
                                <Link
                                  href={`/doctor/assessments/${assessment.id}`}
                                  className="btn btn-sm btn-primary"
                                >
                                  View
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted">No assessments found for this patient.</p>
                  )}
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
    </div>
  )
}

