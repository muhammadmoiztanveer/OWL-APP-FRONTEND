'use client'

export default function RightSidebar() {
  return (
    <>
      <div className="right-bar">
        <div data-simplebar className="h-100">
          <div className="rightbar-title d-flex align-items-center p-3">
            <h5 className="m-0 me-2">Settings</h5>
            <a href="javascript:void(0);" className="right-bar-toggle ms-auto">
              <i className="mdi mdi-close noti-icon"></i>
            </a>
          </div>

          {/* Settings */}
          <hr className="m-0" />

          <div className="p-4">
            <h6 className="mb-3">Layout</h6>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="layout"
                id="layout-vertical"
                value="vertical"
                defaultChecked
              />
              <label className="form-check-label" htmlFor="layout-vertical">
                Vertical
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="layout"
                id="layout-horizontal"
                value="horizontal"
              />
              <label className="form-check-label" htmlFor="layout-horizontal">
                Horizontal
              </label>
            </div>

            <h6 className="mt-4 mb-3 pt-2">Layout Mode</h6>

            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="layout-mode"
                id="layout-mode-light"
                value="light"
                defaultChecked
              />
              <label className="form-check-label" htmlFor="layout-mode-light">
                Light
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="layout-mode"
                id="layout-mode-dark"
                value="dark"
              />
              <label className="form-check-label" htmlFor="layout-mode-dark">
                Dark
              </label>
            </div>

            <h6 className="mt-4 mb-3 pt-2">Layout Width</h6>

            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="layout-width"
                id="layout-width-fuild"
                value="fuild"
                onChange={(e) => {
                  if (e.target.checked) {
                    document.body.setAttribute('data-layout-size', 'fluid')
                  }
                }}
              />
              <label className="form-check-label" htmlFor="layout-width-fuild">
                Fluid
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="layout-width"
                id="layout-width-boxed"
                value="boxed"
                onChange={(e) => {
                  if (e.target.checked) {
                    document.body.setAttribute('data-layout-size', 'boxed')
                  }
                }}
              />
              <label className="form-check-label" htmlFor="layout-width-boxed">
                Boxed
              </label>
            </div>

            <h6 className="mt-4 mb-3 pt-2">Topbar Color</h6>

            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="topbar-color"
                id="topbar-color-light"
                value="light"
                defaultChecked
                onChange={(e) => {
                  if (e.target.checked) {
                    document.body.setAttribute('data-topbar', 'light')
                  }
                }}
              />
              <label className="form-check-label" htmlFor="topbar-color-light">
                Light
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="topbar-color"
                id="topbar-color-dark"
                value="dark"
                onChange={(e) => {
                  if (e.target.checked) {
                    document.body.setAttribute('data-topbar', 'dark')
                  }
                }}
              />
              <label className="form-check-label" htmlFor="topbar-color-dark">
                Dark
              </label>
            </div>

            <h6 className="mt-4 mb-3 pt-2 sidebar-setting">Sidebar Size</h6>

            <div className="form-check sidebar-setting">
              <input
                className="form-check-input"
                type="radio"
                name="sidebar-size"
                id="sidebar-size-default"
                value="default"
                defaultChecked
                onChange={(e) => {
                  if (e.target.checked) {
                    document.body.setAttribute('data-sidebar-size', 'lg')
                  }
                }}
              />
              <label className="form-check-label" htmlFor="sidebar-size-default">
                Default
              </label>
            </div>
            <div className="form-check sidebar-setting">
              <input
                className="form-check-input"
                type="radio"
                name="sidebar-size"
                id="sidebar-size-compact"
                value="compact"
                onChange={(e) => {
                  if (e.target.checked) {
                    document.body.setAttribute('data-sidebar-size', 'small')
                  }
                }}
              />
              <label className="form-check-label" htmlFor="sidebar-size-compact">
                Compact
              </label>
            </div>
            <div className="form-check sidebar-setting">
              <input
                className="form-check-input"
                type="radio"
                name="sidebar-size"
                id="sidebar-size-small"
                value="small"
                onChange={(e) => {
                  if (e.target.checked) {
                    document.body.setAttribute('data-sidebar-size', 'sm')
                  }
                }}
              />
              <label className="form-check-label" htmlFor="sidebar-size-small">
                Small (Icon View)
              </label>
            </div>

            <h6 className="mt-4 mb-3 pt-2 sidebar-setting">Sidebar Color</h6>

            <div className="form-check sidebar-setting">
              <input
                className="form-check-input"
                type="radio"
                name="sidebar-color"
                id="sidebar-color-light"
                value="light"
                defaultChecked
                onChange={(e) => {
                  if (e.target.checked) {
                    document.body.setAttribute('data-sidebar', 'light')
                  }
                }}
              />
              <label className="form-check-label" htmlFor="sidebar-color-light">
                Light
              </label>
            </div>
            <div className="form-check sidebar-setting">
              <input
                className="form-check-input"
                type="radio"
                name="sidebar-color"
                id="sidebar-color-dark"
                value="dark"
                onChange={(e) => {
                  if (e.target.checked) {
                    document.body.setAttribute('data-sidebar', 'dark')
                  }
                }}
              />
              <label className="form-check-label" htmlFor="sidebar-color-dark">
                Dark
              </label>
            </div>
            <div className="form-check sidebar-setting">
              <input
                className="form-check-input"
                type="radio"
                name="sidebar-color"
                id="sidebar-color-colored"
                value="colored"
                onChange={(e) => {
                  if (e.target.checked) {
                    document.body.setAttribute('data-sidebar', 'colored')
                  }
                }}
              />
              <label className="form-check-label" htmlFor="sidebar-color-colored">
                Colored
              </label>
            </div>

            <h6 className="mt-4 mb-3 pt-2">Direction</h6>

            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="layout-direction"
                id="layout-direction-ltr"
                value="ltr"
                defaultChecked
              />
              <label className="form-check-label" htmlFor="layout-direction-ltr">
                LTR
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="layout-direction"
                id="layout-direction-rtl"
                value="rtl"
              />
              <label className="form-check-label" htmlFor="layout-direction-rtl">
                RTL
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Right bar overlay*/}
      <div className="rightbar-overlay"></div>
    </>
  )
}

