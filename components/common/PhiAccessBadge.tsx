'use client'

interface PhiAccessBadgeProps {
  isPhiAccess: boolean
}

export default function PhiAccessBadge({ isPhiAccess }: PhiAccessBadgeProps) {
  if (!isPhiAccess) return null

  return (
    <span className="badge bg-danger-subtle text-danger">
      <i className="mdi mdi-lock me-1"></i>
      PHI Access
    </span>
  )
}

