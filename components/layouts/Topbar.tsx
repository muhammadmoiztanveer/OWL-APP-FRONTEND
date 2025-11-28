'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useHasPermission } from '@/hooks/useHasPermission'

export default function Topbar() {
  const { user, logout } = useAuth()
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
          <form className="app-search d-none d-lg-block">
            <div className="position-relative">
              <input type="text" className="form-control" placeholder="Search..." />
              <span className="uil-search"></span>
            </div>
          </form>
        </div>

        <div className="d-flex">
          <div className="dropdown d-inline-block d-lg-none ms-2">
            <button
              type="button"
              className="btn header-item noti-icon waves-effect"
              id="page-header-search-dropdown"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="uil-search"></i>
            </button>
            <div
              className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
              aria-labelledby="page-header-search-dropdown"
            >
              <form className="p-3">
                <div className="form-group m-0">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search..."
                      aria-label="Recipient's username"
                    />
                    <div className="input-group-append">
                      <button className="btn btn-primary" type="submit">
                        <i className="mdi mdi-magnify"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="dropdown d-inline-block language-switch">
            <button
              type="button"
              className="btn header-item waves-effect"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <Image
                src="/assets/images/flags/us.jpg"
                alt="Header Language"
                height={16}
                width={16}
              />
            </button>
            <div className="dropdown-menu dropdown-menu-end">
              <Link href="/dashboard?lang=en" className="dropdown-item notify-item">
                <Image
                  src="/assets/images/flags/us.jpg"
                  alt="user-image"
                  className="me-1"
                  height={12}
                  width={12}
                />{' '}
                <span className="align-middle">English</span>
              </Link>
              <Link href="/dashboard?lang=es" className="dropdown-item notify-item">
                <Image
                  src="/assets/images/flags/spain.jpg"
                  alt="user-image"
                  className="me-1"
                  height={12}
                  width={12}
                />{' '}
                <span className="align-middle">Spanish</span>
              </Link>
              <Link href="/dashboard?lang=de" className="dropdown-item notify-item">
                <Image
                  src="/assets/images/flags/germany.jpg"
                  alt="user-image"
                  className="me-1"
                  height={12}
                  width={12}
                />{' '}
                <span className="align-middle">German</span>
              </Link>
              <Link href="/dashboard?lang=it" className="dropdown-item notify-item">
                <Image
                  src="/assets/images/flags/italy.jpg"
                  alt="user-image"
                  className="me-1"
                  height={12}
                  width={12}
                />{' '}
                <span className="align-middle">Italian</span>
              </Link>
              <Link href="/dashboard?lang=ru" className="dropdown-item notify-item">
                <Image
                  src="/assets/images/flags/russia.jpg"
                  alt="user-image"
                  className="me-1"
                  height={12}
                  width={12}
                />{' '}
                <span className="align-middle">Russian</span>
              </Link>
            </div>
          </div>

          <div className="dropdown d-none d-lg-inline-block ms-1">
            <button
              type="button"
              className="btn header-item noti-icon waves-effect"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="uil-apps"></i>
            </button>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
              <div className="px-lg-2">
                <div className="row g-0">
                  <div className="col">
                    <a className="dropdown-icon-item" href="#">
                      <Image src="/assets/images/brands/github.png" alt="Github" width={20} height={20} />
                      <span>GitHub</span>
                    </a>
                  </div>
                  <div className="col">
                    <a className="dropdown-icon-item" href="#">
                      <Image
                        src="/assets/images/brands/bitbucket.png"
                        alt="bitbucket"
                        width={20}
                        height={20}
                      />
                      <span>Bitbucket</span>
                    </a>
                  </div>
                  <div className="col">
                    <a className="dropdown-icon-item" href="#">
                      <Image
                        src="/assets/images/brands/dribbble.png"
                        alt="dribbble"
                        width={20}
                        height={20}
                      />
                      <span>Dribbble</span>
                    </a>
                  </div>
                </div>

                <div className="row g-0">
                  <div className="col">
                    <a className="dropdown-icon-item" href="#">
                      <Image
                        src="/assets/images/brands/dropbox.png"
                        alt="dropbox"
                        width={20}
                        height={20}
                      />
                      <span>Dropbox</span>
                    </a>
                  </div>
                  <div className="col">
                    <a className="dropdown-icon-item" href="#">
                      <Image
                        src="/assets/images/brands/mail_chimp.png"
                        alt="mail_chimp"
                        width={20}
                        height={20}
                      />
                      <span>Mail Chimp</span>
                    </a>
                  </div>
                  <div className="col">
                    <a className="dropdown-icon-item" href="#">
                      <Image
                        src="/assets/images/brands/slack.png"
                        alt="slack"
                        width={20}
                        height={20}
                      />
                      <span>Slack</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                  <a className="btn btn-sm btn-link font-size-14 text-center" href="javascript:void(0)">
                    <i className="uil-arrow-circle-right me-1"></i> View More..
                  </a>
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
                {user?.name || 'User'}
              </span>
              <i className="uil-angle-down d-none d-xl-inline-block font-size-15"></i>
            </button>
            <div className="dropdown-menu dropdown-menu-end">
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
