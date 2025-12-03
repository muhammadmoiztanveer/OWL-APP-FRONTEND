'use client'

import { useState, useEffect } from 'react'
import { usePdfStatus, useDownloadPdf, useRegeneratePdf } from '@/hooks/pdf/usePdfStatus'
import PdfStatusBadge, { getPdfStatusState } from '@/components/common/PdfStatusBadge'
import { usePermissions } from '@/hooks/usePermissions'
import { useAuth } from '@/contexts/AuthContext'
import { Assessment } from '@/lib/types'

interface AssessmentPdfSectionProps {
  assessmentId: number
  assessment?: Assessment
}

export default function AssessmentPdfSection({
  assessmentId,
  assessment,
}: AssessmentPdfSectionProps) {
  const { user } = useAuth()
  const { isAdmin, hasPermission } = usePermissions()
  const [shouldPoll, setShouldPoll] = useState(false)

  // Check if user can regenerate PDF
  const canRegenerate =
    isAdmin ||
    (hasPermission('assessment.update') &&
      user?.roles?.some((r) => r.name === 'doctor') &&
      assessment?.doctor_id === user?.doctor?.id)

  // Fetch PDF status with polling if generating
  const { data: pdfStatus, isLoading, refetch } = usePdfStatus(assessmentId, {
    enabled: !!assessmentId,
    refetchInterval: shouldPoll ? 3000 : false, // Poll every 3 seconds if generating
  })

  const downloadMutation = useDownloadPdf()
  const regenerateMutation = useRegeneratePdf()

  // Determine if we should poll based on status
  useEffect(() => {
    if (pdfStatus) {
      const statusState = getPdfStatusState(pdfStatus)
      const shouldStartPolling =
        statusState === 'generating' || statusState === 'pending'
      setShouldPoll(shouldStartPolling)

      // Stop polling if completed or failed
      if (statusState === 'ready' || statusState === 'failed') {
        setShouldPoll(false)
      }
    }
  }, [pdfStatus])

  const handleDownload = async () => {
    downloadMutation.mutate(assessmentId)
  }

  const handleRegenerate = async () => {
    if (
      !window.confirm(
        'Are you sure you want to regenerate this PDF? This will queue a new PDF generation.'
      )
    ) {
      return
    }

    regenerateMutation.mutate(assessmentId, {
      onSuccess: () => {
        // Start polling after regeneration
        setShouldPoll(true)
        refetch()
      },
    })
  }

  const statusState = getPdfStatusState(pdfStatus)

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title mb-4">Assessment Report PDF</h5>

        {isLoading ? (
          <div className="text-center py-3">
            <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="text-muted">Loading PDF status...</span>
          </div>
        ) : (
          <>
            <div className="d-flex align-items-center gap-3 mb-3">
              <PdfStatusBadge status={statusState} />
              {pdfStatus?.report_generated_at && (
                <span className="text-muted small">
                  Generated: {new Date(pdfStatus.report_generated_at).toLocaleString()}
                </span>
              )}
            </div>

            <div className="d-flex flex-wrap gap-2 mb-3">
              {pdfStatus?.has_pdf && (
                <button
                  className="btn btn-primary"
                  onClick={handleDownload}
                  disabled={downloadMutation.isPending}
                >
                  {downloadMutation.isPending ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <i className="mdi mdi-download me-1"></i>
                      Download PDF
                    </>
                  )}
                </button>
              )}

              {canRegenerate && (
                <button
                  className="btn btn-secondary"
                  onClick={handleRegenerate}
                  disabled={regenerateMutation.isPending || shouldPoll}
                >
                  {regenerateMutation.isPending ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Queuing...
                    </>
                  ) : (
                    <>
                      <i className="mdi mdi-refresh me-1"></i>
                      Regenerate PDF
                    </>
                  )}
                </button>
              )}

              {statusState === 'failed' && (
                <button
                  className="btn btn-warning"
                  onClick={handleRegenerate}
                  disabled={regenerateMutation.isPending}
                >
                  {regenerateMutation.isPending ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Retrying...
                    </>
                  ) : (
                    <>
                      <i className="mdi mdi-reload me-1"></i>
                      Retry Generation
                    </>
                  )}
                </button>
              )}
            </div>

            {pdfStatus?.queue_error && (
              <div className="alert alert-danger mt-3">
                <strong>Error:</strong> {pdfStatus.queue_error}
                {pdfStatus.queue_attempts > 0 && (
                  <div className="small mt-1">Attempts: {pdfStatus.queue_attempts}</div>
                )}
              </div>
            )}

            {shouldPoll && (
              <div className="alert alert-info mt-3">
                <i className="mdi mdi-information me-2"></i>
                PDF is being generated. This page will automatically update when ready.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

