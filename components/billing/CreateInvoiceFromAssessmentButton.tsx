'use client'

import { useState } from 'react'
import CreateInvoiceFromAssessmentModal from './CreateInvoiceFromAssessmentModal'

interface CreateInvoiceFromAssessmentButtonProps {
  assessmentId: number
}

export default function CreateInvoiceFromAssessmentButton({
  assessmentId,
}: CreateInvoiceFromAssessmentButtonProps) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button className="btn btn-primary" onClick={() => setShowModal(true)}>
        <i className="mdi mdi-file-document-plus me-1"></i>
        Create Invoice
      </button>

      {showModal && (
        <CreateInvoiceFromAssessmentModal
          show={showModal}
          onClose={() => setShowModal(false)}
          assessmentId={assessmentId}
        />
      )}
    </>
  )
}


