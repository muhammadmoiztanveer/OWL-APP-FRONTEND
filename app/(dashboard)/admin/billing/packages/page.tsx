'use client'

import { useState } from 'react'
import { usePackages, useDeletePackage } from '@/hooks/billing/usePackages'
import { Package } from '@/lib/types'
import Breadcrumb from '@/components/common/Breadcrumb'
import PermissionGate from '@/components/common/PermissionGate'
import UnauthorizedMessage from '@/components/common/UnauthorizedMessage'
import PackageFormModal from '@/components/billing/PackageFormModal'
import Pagination from '@/components/common/Pagination'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

export default function PackagesPage() {
  const [showModal, setShowModal] = useState(false)
  const [editingPackage, setEditingPackage] = useState<Package | null>(null)
  const [activeOnly, setActiveOnly] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const { data: packagesData, isLoading, refetch } = usePackages({
    active_only: activeOnly || undefined,
    per_page: 10,
    page: currentPage,
  })
  const deleteMutation = useDeletePackage()

  const handleCreate = () => {
    setEditingPackage(null)
    setShowModal(true)
  }

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg)
    setShowModal(true)
  }

  const handleDelete = async (pkg: Package) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `This will delete the package "${pkg.name}". This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    })

    if (result.isConfirmed) {
      try {
        await deleteMutation.mutateAsync(pkg.id)
      } catch (error: any) {
        // Error is handled by the mutation
      }
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <PermissionGate permission="billing.manage" fallback={<UnauthorizedMessage />}>
      <Breadcrumb pagetitle="Billing" title="Packages" />
      
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="card-title mb-0">Subscription Packages</h4>
              <div className="d-flex gap-2">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="activeOnly"
                    checked={activeOnly}
                    onChange={(e) => {
                      setActiveOnly(e.target.checked)
                      setCurrentPage(1)
                    }}
                  />
                  <label className="form-check-label" htmlFor="activeOnly">
                    Active Only
                  </label>
                </div>
                <button className="btn btn-primary" onClick={handleCreate}>
                  <i className="mdi mdi-plus me-1"></i>Create Package
                </button>
              </div>
            </div>
            <div className="card-body">
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : packagesData?.data && packagesData.data.length > 0 ? (
                <>
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Monthly Price</th>
                          <th>Yearly Price</th>
                          <th>Status</th>
                          <th>Stripe Product ID</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {packagesData.data.map((pkg) => (
                          <tr key={pkg.id}>
                            <td>
                              <strong>{pkg.name}</strong>
                              {pkg.description && (
                                <div className="text-muted small">{pkg.description}</div>
                              )}
                            </td>
                            <td>{formatCurrency(pkg.monthly_price)}</td>
                            <td>
                              {pkg.yearly_price ? formatCurrency(pkg.yearly_price) : '-'}
                            </td>
                            <td>
                              {pkg.is_active ? (
                                <span className="badge bg-success-subtle text-success">Active</span>
                              ) : (
                                <span className="badge bg-secondary-subtle text-secondary">Inactive</span>
                              )}
                            </td>
                            <td>
                              {pkg.stripe_product_id ? (
                                <span className="text-muted small" title={pkg.stripe_product_id}>
                                  {pkg.stripe_product_id.substring(0, 20)}...
                                </span>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() => handleEdit(pkg)}
                                >
                                  <i className="mdi mdi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDelete(pkg)}
                                  disabled={deleteMutation.isPending}
                                >
                                  <i className="mdi mdi-delete"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {packagesData.meta && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={packagesData.meta.last_page}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </>
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted">No packages found.</p>
                  <button className="btn btn-primary" onClick={handleCreate}>
                    Create Your First Package
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <PackageFormModal
          packageId={editingPackage?.id}
          onClose={() => {
            setShowModal(false)
            setEditingPackage(null)
          }}
          onSuccess={() => {
            setShowModal(false)
            setEditingPackage(null)
            refetch()
          }}
        />
      )}
    </PermissionGate>
  )
}







