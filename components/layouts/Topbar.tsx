'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useHasPermission } from '@/hooks/useHasPermission'

export default function Topbar() {
  const { user, logout, impersonatingUser, isImpersonating, stopImpersonating } = useAuth()
  const canViewRoles = useHasPermission('view roles')
  const canViewPermissions = useHasPermission('view permissions')

  return (
    <header id="page-topbar">
      <div className="navbar-header">
        <div className="d-flex">
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

          {/* App Search*/}
          {/* <form className="app-search d-none d-lg-block">
            <div className="position-relative">
              <input type="text" className="form-control" placeholder="Search..." />
              <span className="uil-search"></span>
            </div>
          </form> */}
        </div>

        <div className="d-flex">         

          <div className="dropdown d-none d-lg-inline-block ms-1">
            <button
              type="button"
              className="btn header-item noti-icon waves-effect"
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen()
                } else {
                  document.exitFullscreen()
                }
              }}
            >
              <i className="uil-minus-path"></i>
            </button>
          </div>

          <div className="dropdown d-inline-block">
            <button
              type="button"
              className="btn header-item noti-icon waves-effect"
              id="page-header-notifications-dropdown"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="uil-bell"></i>
              <span className="badge bg-danger rounded-pill">3</span>
            </button>
            <div
              className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
              aria-labelledby="page-header-notifications-dropdown"
            >
              <div className="p-3">
                <div className="row align-items-center">
                  <div className="col">
                    <h5 className="m-0 font-size-16">Notifications</h5>
                  </div>
                  <div className="col-auto">
                    <a href="#!" className="small">
                      Mark read
                    </a>
                  </div>
                </div>
              </div>
              <div data-simplebar style={{ maxHeight: '230px' }}>
                <a href="" className="text-dark notification-item">
                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0 me-3">
                      <div className="avatar-xs">
                        <span className="avatar-title bg-primary rounded-circle font-size-16">
                          <i className="uil-shopping-basket"></i>
                        </span>
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mt-0 mb-1">Order placed</h6>
                      <div className="font-size-12 text-muted">
                        <p className="mb-1">Languages grammar</p>
                        <p className="mb-0">
                          <i className="mdi mdi-clock-outline"></i> 3 min ago
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
                <a href="" className="text-dark notification-item">
                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0 me-3">
                      <Image
                        src="/assets/images/users/avatar-3.jpg"
                        className="rounded-circle avatar-xs"
                        alt="user-pic"
                        width={32}
                        height={32}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mt-0 mb-1">James Lemire</h6>
                      <div className="font-size-12 text-muted">
                        <p className="mb-1">Simplified English</p>
                        <p className="mb-0">
                          <i className="mdi mdi-clock-outline"></i> 1 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
                <a href="" className="text-dark notification-item">
                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0 me-3">
                      <div className="avatar-xs">
                        <span className="avatar-title bg-success rounded-circle font-size-16">
                          <i className="uil-truck"></i>
                        </span>
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mt-0 mb-1">Item shipped</h6>
                      <div className="font-size-12 text-muted">
                        <p className="mb-1">Languages grammar</p>
                        <p className="mb-0">
                          <i className="mdi mdi-clock-outline"></i> 3 min ago
                        </p>
                      </div>
                    </div>
                  </div>
                </a>

                <a href="" className="text-dark notification-item">
                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0 me-3">
                      <Image
                        src="/assets/images/users/avatar-4.jpg"
                        className="rounded-circle avatar-xs"
                        alt="user-pic"
                        width={32}
                        height={32}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mt-0 mb-1">Salena Layfield</h6>
                      <div className="font-size-12 text-muted">
                        <p className="mb-1">Friend occidental</p>
                        <p className="mb-0">
                          <i className="mdi mdi-clock-outline"></i> 1 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
              <div className="p-2 border-top">
                <div className="d-grid">
                  <button
                    type="button"
                    className="btn btn-sm btn-link font-size-14 text-center"
                    onClick={(e) => {
                      e.preventDefault()
                      // Add your "View More" functionality here
                    }}
                  >
                    <i className="uil-arrow-circle-right me-1"></i> View More..
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="dropdown d-inline-block">
            <button
              type="button"
              className="btn header-item waves-effect"
              id="page-header-user-dropdown"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <Image
                className="rounded-circle header-profile-user"
                src="/assets/images/users/avatar-4.jpg"
                alt="Header Avatar"
                width={32}
                height={32}
              />
              <span className="d-none d-xl-inline-block ms-1 fw-medium font-size-15">
                {isImpersonating ? impersonatingUser?.name : user?.name || 'User'}
              </span>
              {isImpersonating && impersonatingUser?.roles && impersonatingUser.roles.length > 0 && (
                <span className="d-none d-xl-inline-block ms-2 badge bg-success-subtle text-success font-size-12">
                  {impersonatingUser.roles[0].name.toUpperCase()}
                </span>
              )}
              {!isImpersonating && user?.roles && user.roles.length > 0 && (
                <span className="d-none d-xl-inline-block ms-2 badge bg-primary-subtle text-primary font-size-12">
                  {user.roles[0].name.toUpperCase()}
                </span>
              )}
              {isImpersonating && (
                <span className="d-none d-xl-inline-block ms-2 badge bg-warning-subtle text-warning font-size-12">
                  IMPERSONATING
                </span>
              )}
              <i className="uil-angle-down d-none d-xl-inline-block font-size-15"></i>
            </button>
            <div className="dropdown-menu dropdown-menu-end">
              {isImpersonating && (
                <>
                  <div className="dropdown-item-text">
                    <small className="text-muted">Viewing as: <strong>{impersonatingUser?.name}</strong></small>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button
                    className="dropdown-item"
                    onClick={() => stopImpersonating().catch(console.error)}
                    style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}
                  >
                    <i className="uil uil-arrow-left font-size-18 align-middle me-1 text-warning"></i>{' '}
                    <span className="align-middle">Exit Doctor View</span>
                  </button>
                  <div className="dropdown-divider"></div>
                </>
              )}
              <Link className="dropdown-item" href="/profile">
                <i className="uil uil-user-circle font-size-18 align-middle text-muted me-1"></i>{' '}
                <span className="align-middle">View Profile</span>
              </Link>
              {canViewRoles && (
                <Link className="dropdown-item" href="/roles">
                  <i className="uil uil-shield font-size-18 align-middle me-1 text-muted"></i>{' '}
                  <span className="align-middle">Roles</span>
                </Link>
              )}
              {canViewPermissions && (
                <Link className="dropdown-item" href="/permissions">
                  <i className="uil uil-key-skeleton font-size-18 align-middle me-1 text-muted"></i>{' '}
                  <span className="align-middle">Permissions</span>
                </Link>
              )}
              <div className="dropdown-divider"></div>
              <button
                className="dropdown-item"
                onClick={logout}
                style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}
              >
                <i className="uil uil-sign-out-alt font-size-18 align-middle me-1 text-muted"></i>{' '}
                <span className="align-middle">Sign out</span>
              </button>
            </div>
          </div>

          <div className="dropdown d-inline-block">
            <button
              type="button"
              className="btn header-item noti-icon right-bar-toggle waves-effect"
              onClick={() => {
                const rightBar = document.querySelector('.right-bar')
                rightBar?.classList.toggle('right-bar-enabled')
              }}
            >
              <i className="uil-cog"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
