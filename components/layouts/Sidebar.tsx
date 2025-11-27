'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useHasPermission } from '@/hooks/useHasPermission'

export default function Sidebar() {
  const pathname = usePathname()
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set())
  const canViewRoles = useHasPermission('view roles')
  const canViewPermissions = useHasPermission('view permissions')

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
  }, [])

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
              <Link href="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
                <i className="uil-home-alt"></i>
                <span className="badge rounded-pill bg-primary float-end">01</span>
                <span>Dashboard</span>
              </Link>
            </li>

            <li>
              <a
                href="javascript: void(0);"
                className={`has-arrow waves-effect ${isExpanded('layouts') ? 'mm-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  toggleMenu('layouts')
                }}
              >
                <i className="uil-window-section"></i>
                <span>Layouts</span>
              </a>
              <ul className={`sub-menu ${isExpanded('layouts') ? 'mm-show' : ''}`} aria-expanded={isExpanded('layouts')}>
                <li>
                  <a
                    href="javascript: void(0);"
                    className={`has-arrow ${isExpanded('layouts-vertical') ? 'mm-active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault()
                      toggleMenu('layouts-vertical')
                    }}
                  >
                    Vertical
                  </a>
                  <ul className={`sub-menu ${isExpanded('layouts-vertical') ? 'mm-show' : ''}`}>
                    <li>
                      <Link href="/layouts/dark-sidebar">Dark Sidebar</Link>
                    </li>
                    <li>
                      <Link href="/layouts/compact-sidebar">Compact Sidebar</Link>
                    </li>
                    <li>
                      <Link href="/layouts/icon-sidebar">Icon Sidebar</Link>
                    </li>
                    <li>
                      <Link href="/layouts/boxed">Boxed Width</Link>
                    </li>
                    <li>
                      <Link href="/layouts/preloader">Preloader</Link>
                    </li>
                    <li>
                      <Link href="/layouts/colored-sidebar">Colored Sidebar</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a
                    href="javascript: void(0);"
                    className={`has-arrow ${isExpanded('layouts-horizontal') ? 'mm-active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault()
                      toggleMenu('layouts-horizontal')
                    }}
                  >
                    Horizontal
                  </a>
                  <ul className={`sub-menu ${isExpanded('layouts-horizontal') ? 'mm-show' : ''}`}>
                    <li>
                      <Link href="/layouts/horizontal">Horizontal</Link>
                    </li>
                    <li>
                      <Link href="/layouts/hori-topbar-dark">Dark Topbar</Link>
                    </li>
                    <li>
                      <Link href="/layouts/hori-boxed-width">Boxed Width</Link>
                    </li>
                    <li>
                      <Link href="/layouts/hori-preloader">Preloader</Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>

            <li className="menu-title">Apps</li>

            <li>
              <Link href="/apps/calendar" className={isActive('/apps/calendar') ? 'active' : ''}>
                <i className="uil-calender"></i>
                <span>Calendar</span>
              </Link>
            </li>

            <li>
              <Link href="/apps/chat" className={isActive('/apps/chat') ? 'active' : ''}>
                <i className="uil-comments-alt"></i>
                <span>Chat</span>
              </Link>
            </li>

            <li>
              <Link href="/apps/file-manager" className={isActive('/apps/file-manager') ? 'active' : ''}>
                <i className="uil-comments-alt"></i>
                <span>File Manager</span>
              </Link>
            </li>

            <li>
              <a
                href="javascript: void(0);"
                className={`has-arrow waves-effect ${isExpanded('ecommerce') ? 'mm-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  toggleMenu('ecommerce')
                }}
              >
                <i className="uil-store"></i>
                <span>Ecommerce</span>
              </a>
              <ul className={`sub-menu ${isExpanded('ecommerce') ? 'mm-show' : ''}`}>
                <li>
                  <Link href="/ecommerce/products">Products</Link>
                </li>
                <li>
                  <Link href="/ecommerce/product-detail">Product Detail</Link>
                </li>
                <li>
                  <Link href="/ecommerce/orders">Orders</Link>
                </li>
                <li>
                  <Link href="/ecommerce/customers">Customers</Link>
                </li>
                <li>
                  <Link href="/ecommerce/cart">Cart</Link>
                </li>
                <li>
                  <Link href="/ecommerce/checkout">Checkout</Link>
                </li>
                <li>
                  <Link href="/ecommerce/shops">Shops</Link>
                </li>
                <li>
                  <Link href="/ecommerce/add-product">Add Product</Link>
                </li>
              </ul>
            </li>

            <li>
              <a
                href="javascript: void(0);"
                className={`has-arrow waves-effect ${isExpanded('email') ? 'mm-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  toggleMenu('email')
                }}
              >
                <i className="uil-envelope"></i>
                <span>Email</span>
              </a>
              <ul className={`sub-menu ${isExpanded('email') ? 'mm-show' : ''}`}>
                <li>
                  <Link href="/email/inbox">Inbox</Link>
                </li>
                <li>
                  <Link href="/email/read">Read Email</Link>
                </li>
              </ul>
            </li>

            <li>
              <a
                href="javascript: void(0);"
                className={`has-arrow waves-effect ${isExpanded('invoices') ? 'mm-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  toggleMenu('invoices')
                }}
              >
                <i className="uil-invoice"></i>
                <span>Invoices</span>
              </a>
              <ul className={`sub-menu ${isExpanded('invoices') ? 'mm-show' : ''}`}>
                <li>
                  <Link href="/invoices/list">Invoice List</Link>
                </li>
                <li>
                  <Link href="/invoices/detail">Invoice Detail</Link>
                </li>
              </ul>
            </li>

            <li>
              <a
                href="javascript: void(0);"
                className={`has-arrow waves-effect ${isExpanded('contacts') ? 'mm-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  toggleMenu('contacts')
                }}
              >
                <i className="uil-book-alt"></i>
                <span>Contacts</span>
              </a>
              <ul className={`sub-menu ${isExpanded('contacts') ? 'mm-show' : ''}`}>
                <li>
                  <Link href="/contacts/grid">User Grid</Link>
                </li>
                <li>
                  <Link href="/contacts/list">User List</Link>
                </li>
                <li>
                  <Link href="/contacts/profile">Profile</Link>
                </li>
              </ul>
            </li>

            <li className="menu-title">Pages</li>

            <li>
              <Link href="/profile" className={isActive('/profile') ? 'active' : ''}>
                <i className="uil-user"></i>
                <span>Profile</span>
              </Link>
            </li>

            {(canViewRoles || canViewPermissions) && (
              <li>
                <a
                  href="javascript: void(0);"
                  className={`has-arrow waves-effect ${isExpanded('admin') ? 'mm-active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault()
                    toggleMenu('admin')
                  }}
                >
                  <i className="uil-shield-check"></i>
                  <span>Access Control</span>
                </a>
                <ul className={`sub-menu ${isExpanded('admin') ? 'mm-show' : ''}`}>
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
                </ul>
              </li>
            )}

            <li>
              <a
                href="javascript: void(0);"
                className={`has-arrow waves-effect ${isExpanded('auth') ? 'mm-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  toggleMenu('auth')
                }}
              >
                <i className="uil-user-circle"></i>
                <span>Authentication</span>
              </a>
              <ul className={`sub-menu ${isExpanded('auth') ? 'mm-show' : ''}`}>
                <li>
                  <Link href="/auth/login">Login</Link>
                </li>
                <li>
                  <Link href="/auth/register">Register</Link>
                </li>
                <li>
                  <Link href="/auth/recover-password">Recover Password</Link>
                </li>
                <li>
                  <Link href="/auth/lock-screen">Lock Screen</Link>
                </li>
              </ul>
            </li>

            <li>
              <a
                href="javascript: void(0);"
                className={`has-arrow waves-effect ${isExpanded('utility') ? 'mm-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  toggleMenu('utility')
                }}
              >
                <i className="uil-file-alt"></i>
                <span>Utility</span>
              </a>
              <ul className={`sub-menu ${isExpanded('utility') ? 'mm-show' : ''}`}>
                <li>
                  <Link href="/pages/starter">Starter Page</Link>
                </li>
                <li>
                  <Link href="/pages/maintenance">Maintenance</Link>
                </li>
                <li>
                  <Link href="/pages/coming-soon">Coming Soon</Link>
                </li>
                <li>
                  <Link href="/pages/timeline">Timeline</Link>
                </li>
                <li>
                  <Link href="/pages/faqs">FAQs</Link>
                </li>
                <li>
                  <Link href="/pages/pricing">Pricing</Link>
                </li>
                <li>
                  <Link href="/pages/404">Error 404</Link>
                </li>
                <li>
                  <Link href="/pages/500">Error 500</Link>
                </li>
              </ul>
            </li>

            <li className="menu-title">Components</li>

            <li>
              <a
                href="javascript: void(0);"
                className={`has-arrow waves-effect ${isExpanded('ui') ? 'mm-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  toggleMenu('ui')
                }}
              >
                <i className="uil-flask"></i>
                <span>UI Elements</span>
              </a>
              <ul className={`sub-menu ${isExpanded('ui') ? 'mm-show' : ''}`}>
                <li>
                  <Link href="/ui/alerts">Alerts</Link>
                </li>
                <li>
                  <Link href="/ui/buttons">Buttons</Link>
                </li>
                <li>
                  <Link href="/ui/cards">Cards</Link>
                </li>
                <li>
                  <Link href="/ui/carousel">Carousel</Link>
                </li>
                <li>
                  <Link href="/ui/dropdowns">Dropdowns</Link>
                </li>
                <li>
                  <Link href="/ui/grid">Grid</Link>
                </li>
                <li>
                  <Link href="/ui/images">Images</Link>
                </li>
                <li>
                  <Link href="/ui/lightbox">Lightbox</Link>
                </li>
                <li>
                  <Link href="/ui/modals">Modals</Link>
                </li>
                <li>
                  <Link href="/ui/offcanvas">Offcanvas</Link>
                </li>
                <li>
                  <Link href="/ui/rangeslider">Range Slider</Link>
                </li>
                <li>
                  <Link href="/ui/session-timeout">Session Timeout</Link>
                </li>
                <li>
                  <Link href="/ui/progressbars">Progress Bars</Link>
                </li>
                <li>
                  <Link href="/ui/placeholders">Placeholders</Link>
                </li>
                <li>
                  <Link href="/ui/sweet-alert">Sweet Alert</Link>
                </li>
                <li>
                  <Link href="/ui/tabs-accordions">Tabs & Accordions</Link>
                </li>
                <li>
                  <Link href="/ui/typography">Typography</Link>
                </li>
                <li>
                  <Link href="/ui/utilities">Utilities</Link>
                </li>
                <li>
                  <Link href="/ui/toasts">Toasts</Link>
                </li>
                <li>
                  <Link href="/ui/video">Video</Link>
                </li>
                <li>
                  <Link href="/ui/general">General</Link>
                </li>
                <li>
                  <Link href="/ui/colors">Colors</Link>
                </li>
                <li>
                  <Link href="/ui/rating">Rating</Link>
                </li>
                <li>
                  <Link href="/ui/notifications">Notifications</Link>
                </li>
              </ul>
            </li>

            <li>
              <a
                href="javascript: void(0);"
                className={`waves-effect ${isExpanded('forms') ? 'mm-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  toggleMenu('forms')
                }}
              >
                <i className="uil-shutter-alt"></i>
                <span className="badge rounded-pill bg-info float-end">9</span>
                <span>Forms</span>
              </a>
              <ul className={`sub-menu ${isExpanded('forms') ? 'mm-show' : ''}`}>
                <li>
                  <Link href="/forms/elements">Basic Elements</Link>
                </li>
                <li>
                  <Link href="/forms/validation">Validation</Link>
                </li>
                <li>
                  <Link href="/forms/advanced">Advanced Plugins</Link>
                </li>
                <li>
                  <Link href="/forms/editors">Editors</Link>
                </li>
                <li>
                  <Link href="/forms/uploads">File Upload</Link>
                </li>
                <li>
                  <Link href="/forms/xeditable">Xeditable</Link>
                </li>
                <li>
                  <Link href="/forms/repeater">Repeater</Link>
                </li>
                <li>
                  <Link href="/forms/wizard">Wizard</Link>
                </li>
                <li>
                  <Link href="/forms/mask">Mask</Link>
                </li>
              </ul>
            </li>

            <li>
              <a
                href="javascript: void(0);"
                className={`has-arrow waves-effect ${isExpanded('tables') ? 'mm-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  toggleMenu('tables')
                }}
              >
                <i className="uil-list-ul"></i>
                <span>Tables</span>
              </a>
              <ul className={`sub-menu ${isExpanded('tables') ? 'mm-show' : ''}`}>
                <li>
                  <Link href="/tables/basic">Bootstrap Basic</Link>
                </li>
                <li>
                  <Link href="/tables/datatable">Datatables</Link>
                </li>
                <li>
                  <Link href="/tables/responsive">Responsive</Link>
                </li>
                <li>
                  <Link href="/tables/editable">Editable</Link>
                </li>
              </ul>
            </li>

            <li>
              <a
                href="javascript: void(0);"
                className={`has-arrow waves-effect ${isExpanded('charts') ? 'mm-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  toggleMenu('charts')
                }}
              >
                <i className="uil-chart"></i>
                <span>Charts</span>
              </a>
              <ul className={`sub-menu ${isExpanded('charts') ? 'mm-show' : ''}`}>
                <li>
                  <Link href="/charts/apex">Apex</Link>
                </li>
                <li>
                  <Link href="/charts/chartjs">Chartjs</Link>
                </li>
                <li>
                  <Link href="/charts/flot">Flot</Link>
                </li>
                <li>
                  <Link href="/charts/knob">Jquery Knob</Link>
                </li>
                <li>
                  <Link href="/charts/sparkline">Sparkline</Link>
                </li>
              </ul>
            </li>

            <li>
              <a
                href="javascript: void(0);"
                className={`has-arrow waves-effect ${isExpanded('icons') ? 'mm-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  toggleMenu('icons')
                }}
              >
                <i className="uil-streering"></i>
                <span>Icons</span>
              </a>
              <ul className={`sub-menu ${isExpanded('icons') ? 'mm-show' : ''}`}>
                <li>
                  <Link href="/icons/unicons">Unicons</Link>
                </li>
                <li>
                  <Link href="/icons/boxicons">Boxicons</Link>
                </li>
                <li>
                  <Link href="/icons/materialdesign">Material Design</Link>
                </li>
                <li>
                  <Link href="/icons/dripicons">Dripicons</Link>
                </li>
                <li>
                  <Link href="/icons/fontawesome">Font Awesome</Link>
                </li>
              </ul>
            </li>

            <li>
              <a
                href="javascript: void(0);"
                className={`has-arrow waves-effect ${isExpanded('maps') ? 'mm-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  toggleMenu('maps')
                }}
              >
                <i className="uil-location-point"></i>
                <span>Maps</span>
              </a>
              <ul className={`sub-menu ${isExpanded('maps') ? 'mm-show' : ''}`}>
                <li>
                  <Link href="/maps/google">Google</Link>
                </li>
                <li>
                  <Link href="/maps/vector">Vector</Link>
                </li>
                <li>
                  <Link href="/maps/leaflet">Leaflet</Link>
                </li>
              </ul>
            </li>

            <li>
              <a
                href="javascript: void(0);"
                className={`has-arrow waves-effect ${isExpanded('multilevel') ? 'mm-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  toggleMenu('multilevel')
                }}
              >
                <i className="uil-share-alt"></i>
                <span>Multi Level</span>
              </a>
              <ul className={`sub-menu ${isExpanded('multilevel') ? 'mm-show' : ''}`}>
                <li>
                  <a href="javascript: void(0);">Level 1.1</a>
                </li>
                <li>
                  <a href="javascript: void(0);" className="has-arrow">
                    Level 1.2
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
