'use client'

import { PaginationMeta, PaginationLinks } from '@/lib/types'

interface PaginationProps {
  meta: PaginationMeta
  links: PaginationLinks
  onPageChange: (page: number) => void
}

export default function Pagination({ meta, links, onPageChange }: PaginationProps) {
  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= meta.last_page && page !== meta.current_page) {
      onPageChange(page)
    }
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const current = meta.current_page
    const last = meta.last_page

    if (last <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= last; i++) {
        pages.push(i)
      }
    } else {
      // Show first page
      pages.push(1)

      if (current > 3) {
        pages.push('ellipsis-start')
      }

      // Show pages around current
      const start = Math.max(2, current - 1)
      const end = Math.min(last - 1, current + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (current < last - 2) {
        pages.push('ellipsis-end')
      }

      // Show last page
      pages.push(last)
    }

    return pages
  }

  if (meta.last_page <= 1) {
    return null
  }

  return (
    <nav aria-label="Pagination">
      <ul className="pagination justify-content-end mb-0">
        <li className={`page-item ${!links.prev ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => handlePageClick(meta.current_page - 1)}
            disabled={!links.prev}
          >
            Previous
          </button>
        </li>

        {getPageNumbers().map((page, index) => {
          if (page === 'ellipsis-start' || page === 'ellipsis-end') {
            return (
              <li key={`ellipsis-${index}`} className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )
          }

          const pageNum = page as number
          return (
            <li key={pageNum} className={`page-item ${pageNum === meta.current_page ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageClick(pageNum)}>
                {pageNum}
              </button>
            </li>
          )
        })}

        <li className={`page-item ${!links.next ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => handlePageClick(meta.current_page + 1)}
            disabled={!links.next}
          >
            Next
          </button>
        </li>
      </ul>
      <div className="text-muted text-end mt-2">
        Showing {meta.from} to {meta.to} of {meta.total} results
      </div>
    </nav>
  )
}

