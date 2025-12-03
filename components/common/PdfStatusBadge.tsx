'use client'

import { PdfStatus } from '@/lib/types'

export enum PdfStatusState {
  READY = 'ready',
  GENERATING = 'generating',
  PENDING = 'pending',
  FAILED = 'failed',
  UNKNOWN = 'unknown',
}

interface PdfStatusBadgeProps {
  status: PdfStatusState
}

const statusConfig = {
  [PdfStatusState.READY]: {
    color: 'success',
    icon: 'mdi-check-circle',
    text: 'PDF Ready',
  },
  [PdfStatusState.GENERATING]: {
    color: 'primary',
    icon: 'mdi-loading mdi-spin',
    text: 'Generating...',
  },
  [PdfStatusState.PENDING]: {
    color: 'warning',
    icon: 'mdi-clock-outline',
    text: 'Queued',
  },
  [PdfStatusState.FAILED]: {
    color: 'danger',
    icon: 'mdi-alert-circle',
    text: 'Generation Failed',
  },
  [PdfStatusState.UNKNOWN]: {
    color: 'secondary',
    icon: 'mdi-help-circle',
    text: 'Unknown',
  },
}

export default function PdfStatusBadge({ status }: PdfStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span className={`badge bg-${config.color}-subtle text-${config.color}`}>
      <i className={`mdi ${config.icon} me-1`}></i>
      {config.text}
    </span>
  )
}

// Helper function to get PDF status state from API response
export function getPdfStatusState(status: PdfStatus | null | undefined): PdfStatusState {
  if (!status) return PdfStatusState.UNKNOWN

  if (status.has_pdf) return PdfStatusState.READY
  if (status.queue_status === 'failed') return PdfStatusState.FAILED
  if (status.queue_status === 'processing' || status.queue_status === 'pending') {
    return PdfStatusState.GENERATING
  }

  return PdfStatusState.UNKNOWN
}

