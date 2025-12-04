'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useHasPermission } from '@/hooks/useHasPermission'
import { useHasRole } from '@/hooks/useHasRole'
import { useAuth } from '@/contexts/AuthContext'
import { usePermissions } from '@/hooks/usePermissions'

export default function Sidebar() {
  const pathname = usePathname()
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set())
  const { isImpersonating, impersonatingUser } = useAuth()
  const canViewRoles = useHasPermission('view roles')
  const canViewPermissions = useHasPermission('view permissions')
  const canViewModules = useHasPermission('view modules')
  const canViewDoctors = useHasPermission('view doctors')
  const hasDoctorRole = useHasRole('doctor')
  const isAdmin = useHasRole('admin')
  const { hasPermission } = usePermissions()
  const canViewPatients = useHasPermission('patient.view')
  const canViewAssessmentOrders = useHasPermission('assessment-order.view')
  const canViewAssessments = useHasPermission('assessment.view')
  const canViewAssessmentQuestions = useHasPermission('assessment-question.view')
  const hasPatientRole = useHasRole('patient')
  const canViewBilling = hasPermission('billing.view')
  const canManageBilling = hasPermission('billing.manage')

  // When impersonating, show doctor modules based on impersonated user's permissions
  // When not impersonating, hide doctor modules from admin
  const shouldShowDoctorModules = isImpersonating || (hasDoctorRole && !isAdmin)

  useEffect(() => {
    // Initialize simplebar for sidebar scrolling
    if (typeof window !== 'undefined') {
      const initSimplebar = async () => {
        try {
          const SimpleBar = (await import('simplebar')).default
          const sidebar = document.querySelector('.sidebar-menu-scroll')
          if (sidebar && !sidebar.hasAttribute('data-simplebar-initialized')) {
            new SimpleBar(sidebar as HTMLElement)
            sidebar.setAttribute('data-simplebar-initialized', 'true')
          }
        } catch (e) {
          console.log('SimpleBar not available')
        }
      }
      initSimplebar()
    }
    
    // Auto-expand Access Control menu if on roles, permissions, modules, assessment questions, PDF queue, or audit logs page
    if (pathname === '/roles' || pathname === '/permissions' || pathname?.startsWith('/modules') || pathname?.startsWith('/admin/assessment-questions') || pathname?.startsWith('/admin/pdf-queue') || pathname?.startsWith('/admin/audit-logs')) {
      setExpandedMenus((prev) => new Set([...prev, 'admin']))
      if (pathname?.startsWith('/admin/audit-logs')) {
        setExpandedMenus((prev) => new Set([...prev, 'audit-logs']))
      }
    }
  }, [pathname])

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(menuId)) {
        newSet.delete(menuId)
      } else {
        newSet.add(menuId)
      }
      return newSet
    })
  }

  const isActive = (path: string) => pathname === path
  const isExpanded = (menuId: string) => expandedMenus.has(menuId)

  return (
    <div className="vertical-menu">
      {/* LOGO */}
      <div className="navbar-brand-box">
        <Link href="/dashboard" className="logo logo-dark">
          <span className="logo-sm">
            <Image src="/assets/images/logo-sm.png" alt="" height={22} width={22} />
          </span>
          <span className="logo-lg">
            <Image src="/assets/images/logo-dark.png" alt="" height={20} width={120} />
          </span>
        </Link>

        <Link href="/dashboard" className="logo logo-light">
          <span className="logo-sm">
            <Image src="/assets/images/logo-sm.png" alt="" height={22} width={22} />
          </span>
          <span className="logo-lg">
            <Image src="/assets/images/logo-light.png" alt="" height={20} width={120} />
          </span>
        </Link>
      </div>

      <button
        type="button"
        className="btn btn-sm px-3 font-size-16 header-item waves-effect vertical-menu-btn"
        onClick={() => document.body.classList.toggle('sidebar-enable')}
      >
        <i className="fa fa-fw fa-bars"></i>
      </button>

      <div data-simplebar className="sidebar-menu-scroll">
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">Menu</li>

            <li>
              <Link 
                href="/dashboard" 
                className={isActive('/dashboard') ? 'active' : ''}
              >
                <i className="uil-home-alt"></i>
                <span>Dashboard</span>
              </Link>
            </li>

            {/* Show doctor-related menu items only when impersonating or user has doctor role (not admin) */}
            {shouldShowDoctorModules && canViewPatients && (
              <li>
                <Link
                  href="/doctor/patients"
                  className={isActive('/doctor/patients') ? 'active' : ''}
                >
                  <i className="uil-users-alt"></i>
                  <span>Patients</span>
                </Link>
              </li>
            )}

            {shouldShowDoctorModules && canViewAssessmentOrders && (
              <li>
                <Link
                  href="/doctor/assessment-orders"
                  className={isActive('/doctor/assessment-orders') ? 'active' : ''}
                >
                  <i className="uil-clipboard-notes"></i>
                  <span>Assessment Orders</span>
                </Link>
              </li>
            )}

            {shouldShowDoctorModules && canViewAssessments && (
              <>
                <li>
                  <Link
                    href="/doctor/assessments"
                    className={isActive('/doctor/assessments') && !pathname?.includes('ready-for-review') ? 'active' : ''}
                  >
                    <i className="uil-clipboard-alt"></i>
                    <span>Assessments</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/doctor/assessments/ready-for-review"
                    className={isActive('/doctor/assessments/ready-for-review') ? 'active' : ''}
                  >
                    <i className="uil-check-circle"></i>
                    <span>Ready for Review</span>
                  </Link>
                </li>
              </>
            )}

            {canViewDoctors && (
              <li>
                <Link href="/doctors" className={isActive('/doctors') ? 'active' : ''}>
                  <i className="uil-user-md"></i>
                  <span>Doctors</span>
              </Link>
            </li>
            )}

            {isAdmin && (
              <li>
                <Link href="/users" className={isActive('/users') ? 'active' : ''}>
                  <i className="uil-users-alt"></i>
                  <span>Users</span>
              </Link>
            </li>
            )}

            {/* Patient Portal - My Assessments */}
            {(hasPatientRole || isAdmin) && (
              <li>
                <Link
                  href="/patient/assessments"
                  className={isActive('/patient/assessments') ? 'active' : ''}
                >
                  <i className="uil-clipboard-alt"></i>
                  <span>My Assessments</span>
                </Link>
              </li>
            )}

            {/* Billing Menu */}
            {(canViewBilling || isAdmin) && (
              <li>
                <a
                  href="javascript: void(0);"
                  className={`has-arrow waves-effect ${isExpanded('billing') ? 'mm-active' : ''} ${
                    pathname?.startsWith('/billing') ? 'mm-active' : ''
                  }`}
                  onClick={(e) => {
                    e.preventDefault()
                    toggleMenu('billing')
                  }}
                >
                  <i className="mdi mdi-currency-usd"></i>
                  <span>Billing</span>
                </a>
                <ul
                  className={`sub-menu ${
                    isExpanded('billing') || pathname?.startsWith('/billing') ? 'mm-show' : ''
                  }`}
                >
                  <li>
                    <Link
                      href="/billing/dashboard"
                      className={isActive('/billing/dashboard') ? 'mm-active' : ''}
                    >
                      <i className="mdi mdi-view-dashboard"></i>
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/billing/invoices"
                      className={isActive('/billing/invoices') ? 'mm-active' : ''}
                    >
                      <i className="mdi mdi-file-document"></i>
                      <span>Invoices</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/billing/payments"
                      className={isActive('/billing/payments') ? 'mm-active' : ''}
                    >
                      <i className="mdi mdi-cash-multiple"></i>
                      <span>Payments</span>
                    </Link>
                  </li>
                  {(canManageBilling || isAdmin) && (
                    <li>
                      <Link
                        href="/billing/rates"
                        className={isActive('/billing/rates') ? 'mm-active' : ''}
                      >
                        <i className="mdi mdi-currency-usd"></i>
                        <span>Rates</span>
                      </Link>
                    </li>
                  )}
                </ul>
              </li>
            )}

            <li className="menu-title">Pages</li>

            <li>
              <Link href="/profile" className={isActive('/profile') ? 'active' : ''}>
                <i className="uil-user"></i>
                <span>Profile</span>
              </Link>
            </li>

            {/* Access Control Menu - Always show for admins or users with permissions */}
            {(canViewRoles || canViewPermissions || canViewModules || canViewAssessmentQuestions || isAdmin) && (
            <li>
              <a
                href="javascript: void(0);"
                  className={`has-arrow waves-effect ${isExpanded('admin') ? 'mm-active' : ''} ${isActive('/roles') || isActive('/permissions') || isActive('/modules') || isActive('/admin/assessment-questions') || isActive('/admin/audit-logs') ? 'mm-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                    toggleMenu('admin')
                  }}
                >
                  <i className="uil-shield-check"></i>
                  <span>Access Control</span>
                </a>
                <ul className={`sub-menu ${isExpanded('admin') || isActive('/roles') || isActive('/permissions') || isActive('/modules') || isActive('/admin/assessment-questions') || isActive('/admin/audit-logs') ? 'mm-show' : ''}`}>
                  {canViewRoles && (
                    <li>
                      <Link 
                        href="/roles" 
                        className={isActive('/roles') ? 'mm-active' : ''}
                      >
                        <i className="uil-shield"></i>
                        <span>Roles</span>
                      </Link>
                </li>
                  )}
                  {canViewPermissions && (
                    <li>
                      <Link 
                        href="/permissions" 
                        className={isActive('/permissions') ? 'mm-active' : ''}
                      >
                        <i className="uil-key-skeleton"></i>
                        <span>Permissions</span>
                      </Link>
                </li>
                  )}
                  {canViewModules && (
                    <li>
                      <Link 
                        href="/modules" 
                        className={isActive('/modules') ? 'mm-active' : ''}
                      >
                        <i className="uil-folder"></i>
                        <span>Modules</span>
                      </Link>
                </li>
                  )}
                  {canViewAssessmentQuestions && (
                    <li>
                      <Link 
                        href="/admin/assessment-questions" 
                        className={isActive('/admin/assessment-questions') ? 'mm-active' : ''}
                      >
                        <i className="uil-question-circle"></i>
                        <span>Assessment Questions</span>
                      </Link>
                </li>
                  )}
                  {isAdmin && (
                    <>
                      <li>
                        <Link 
                          href="/admin/pdf-queue" 
                          className={isActive('/admin/pdf-queue') ? 'mm-active' : ''}
                        >
                          <i className="mdi mdi-file-pdf-box"></i>
                          <span>PDF Queue</span>
                        </Link>
                      </li>
                      <li>
                        <a
                          href="javascript: void(0);"
                          className={`has-arrow waves-effect ${isExpanded('audit-logs') ? 'mm-active' : ''} ${isActive('/admin/audit-logs') ? 'mm-active' : ''}`}
                          onClick={(e) => {
                            e.preventDefault()
                            toggleMenu('audit-logs')
                          }}
                        >
                          <i className="mdi mdi-file-document-multiple"></i>
                          <span>Audit Logs</span>
                        </a>
                        <ul className={`sub-menu ${isExpanded('audit-logs') || isActive('/admin/audit-logs') ? 'mm-show' : ''}`}>
                          <li>
                            <Link
                              href="/admin/audit-logs"
                              className={isActive('/admin/audit-logs') && !isActive('/admin/audit-logs/stats') && !pathname?.match(/\/admin\/audit-logs\/\d+/) ? 'mm-active' : ''}
                            >
                              <i className="mdi mdi-format-list-bulleted"></i>
                              <span>All Logs</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/admin/audit-logs/stats"
                              className={isActive('/admin/audit-logs/stats') ? 'mm-active' : ''}
                            >
                              <i className="mdi mdi-chart-line"></i>
                              <span>Statistics</span>
                            </Link>
                          </li>
                        </ul>
                      </li>
                    </>
                  )}
              </ul>
            </li>
            )}

          </ul>
        </div>
      </div>
    </div>
  )
}
