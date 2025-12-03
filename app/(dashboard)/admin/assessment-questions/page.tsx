'use client'

import { useState } from 'react'
import { useAssessmentQuestions, useDeleteQuestion } from '@/hooks/assessments/useAssessmentQuestions'
import Breadcrumb from '@/components/common/Breadcrumb'
import UnauthorizedMessage from '@/components/common/UnauthorizedMessage'
import SearchInput from '@/components/common/SearchInput'
import Pagination from '@/components/common/Pagination'
import { useIsAdmin } from '@/hooks/useIsAdmin'
import { useHasPermission } from '@/hooks/useHasPermission'
import QuestionFormModal from '@/components/admin/QuestionFormModal'
import toast from 'react-hot-toast'
import { Question } from '@/lib/types'

const ASSESSMENT_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'PHQ-9', label: 'PHQ-9' },
  { value: 'GAD-7', label: 'GAD-7' },
  { value: 'comprehensive', label: 'Comprehensive' },
]

export default function AssessmentQuestionsPage() {
  const isAdmin = useIsAdmin()
  const hasViewPermission = useHasPermission('assessment-question.view')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const deleteMutation = useDeleteQuestion()

  const { data, isLoading, error } = useAssessmentQuestions({
    page: currentPage,
    per_page: 15,
    search: searchTerm || undefined,
    assessment_type: typeFilter || undefined,
  })

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id)
      setDeleteConfirm(null)
    } catch (error) {
      // Error handled by mutation
    }
  }

  if (!isAdmin && !hasViewPermission) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Assessment Questions" />
        <UnauthorizedMessage message="You do not have permission to view assessment questions." />
      </>
    )
  }

  const hasCreatePermission = useHasPermission('assessment-question.create')
  const hasUpdatePermission = useHasPermission('assessment-question.update')
  const hasDeletePermission = useHasPermission('assessment-question.delete')

  return (
    <>
      <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Assessment Questions" />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="card-title mb-0">Assessment Questions</h4>
                  <p className="text-muted mb-0">Manage assessment questions for PHQ-9, GAD-7, and Comprehensive assessments.</p>
                </div>
                {hasCreatePermission && (
                  <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                    <i className="uil-plus me-1"></i> Add Question
                  </button>
                )}
              </div>

              {/* Search and Filters */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <SearchInput
                    placeholder="Search questions..."
                    onSearch={handleSearch}
                    className="w-100"
                    debounceMs={300}
                  />
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={typeFilter}
                    onChange={(e) => {
                      setTypeFilter(e.target.value)
                      setCurrentPage(1)
                    }}
                  >
                    {ASSESSMENT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <button
                    className="btn btn-secondary w-100"
                    onClick={() => {
                      setSearchTerm('')
                      setTypeFilter('')
                      setCurrentPage(1)
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : data && data.data && data.data.length > 0 ? (
                <>
                  <div className="table-responsive">
                    <table className="table table-striped table-nowrap align-middle mb-0">
                      <thead>
                        <tr>
                          <th style={{ width: '60px' }}>Order</th>
                          <th>Question Text</th>
                          <th>Assessment Type</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.data.map((question: Question) => (
                          <tr key={question.id}>
                            <td>
                              <span className="badge bg-primary">{question.order_num}</span>
                            </td>
                            <td>{question.text}</td>
                            <td>
                              <span className="badge bg-info-subtle text-info">
                                {question.assessment_type === 'comprehensive'
                                  ? 'Comprehensive'
                                  : question.assessment_type}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                {hasUpdatePermission && (
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => setEditingQuestion(question)}
                                    title="Edit"
                                  >
                                    <i className="mdi mdi-pencil"></i>
                                  </button>
                                )}
                                {hasDeletePermission && (
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => setDeleteConfirm(question.id)}
                                    disabled={deleteMutation.isPending}
                                    title="Delete"
                                  >
                                    <i className="mdi mdi-delete"></i>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {data.meta && data.links && (
                    <div className="mt-3">
                      <Pagination
                        meta={data.meta}
                        links={data.links}
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-5">
                  <i className="uil-question-circle font-size-48 text-muted"></i>
                  <p className="text-muted mt-3">No questions found.</p>
                  {hasCreatePermission && (
                    <button className="btn btn-primary mt-2" onClick={() => setShowCreateModal(true)}>
                      Add First Question
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingQuestion) && (
        <QuestionFormModal
          show={showCreateModal || !!editingQuestion}
          onClose={() => {
            setShowCreateModal(false)
            setEditingQuestion(null)
          }}
          onSuccess={() => {
            setShowCreateModal(false)
            setEditingQuestion(null)
          }}
          question={editingQuestion || undefined}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDeleteConfirm(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this question? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

