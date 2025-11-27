'use client'

import Breadcrumb from '@/components/common/Breadcrumb'

export default function ButtonsPage() {
  return (
    <>
      <Breadcrumb pagetitle="UI Elements" title="Buttons" />

      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Default Buttons</h4>
              <p className="card-title-desc">
                Bootstrap includes six predefined button styles, each serving its own semantic purpose.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <button type="button" className="btn btn-primary waves-effect waves-light">
                  Primary
                </button>
                <button type="button" className="btn btn-light waves-effect">
                  Light
                </button>
                <button type="button" className="btn btn-success waves-effect waves-light">
                  Success
                </button>
                <button type="button" className="btn btn-info waves-effect waves-light">
                  Info
                </button>
                <button type="button" className="btn btn-warning waves-effect waves-light">
                  Warning
                </button>
                <button type="button" className="btn btn-danger waves-effect waves-light">
                  Danger
                </button>
                <button type="button" className="btn btn-dark waves-effect waves-light">
                  Dark
                </button>
                <button type="button" className="btn btn-link waves-effect">
                  Link
                </button>
                <button type="button" className="btn btn-secondary waves-effect waves-light">
                  Secondary
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Outline Buttons</h4>
              <p className="card-title-desc">
                Replace the default modifier classes with the <code className="highlighter-rouge">.btn-outline-*</code> ones to
                remove all background images and colors on any button.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <button type="button" className="btn btn-outline-primary waves-effect waves-light">
                  Primary
                </button>
                <button type="button" className="btn btn-outline-light waves-effect">
                  Light
                </button>
                <button type="button" className="btn btn-outline-success waves-effect waves-light">
                  Success
                </button>
                <button type="button" className="btn btn-outline-info waves-effect waves-light">
                  Info
                </button>
                <button type="button" className="btn btn-outline-warning waves-effect waves-light">
                  Warning
                </button>
                <button type="button" className="btn btn-outline-danger waves-effect waves-light">
                  Danger
                </button>
                <button type="button" className="btn btn-outline-dark waves-effect waves-light">
                  Dark
                </button>
                <button type="button" className="btn btn-outline-secondary waves-effect">
                  Secondary
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Rounded Buttons</h4>
              <p className="card-title-desc">
                Use class <code>.btn-rounded</code> for button round border.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <button type="button" className="btn btn-primary btn-rounded waves-effect waves-light">
                  Primary
                </button>
                <button type="button" className="btn btn-light btn-rounded waves-effect">
                  Light
                </button>
                <button type="button" className="btn btn-success btn-rounded waves-effect waves-light">
                  Success
                </button>
                <button type="button" className="btn btn-info btn-rounded waves-effect waves-light">
                  Info
                </button>
                <button type="button" className="btn btn-warning btn-rounded waves-effect waves-light">
                  Warning
                </button>
                <button type="button" className="btn btn-danger btn-rounded waves-effect waves-light">
                  Danger
                </button>
                <button type="button" className="btn btn-dark btn-rounded waves-effect waves-light">
                  Dark
                </button>
                <button type="button" className="btn btn-link btn-rounded waves-effect">
                  Link
                </button>
                <button type="button" className="btn btn-secondary btn-rounded waves-effect waves-light">
                  Secondary
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Soft Background Buttons</h4>
              <p className="card-title-desc">
                Add <code>.btn-soft-*</code> class with <code>.btn-*</code> color button for a Soft background buttons.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <button type="button" className="btn btn-primary btn-soft-primary waves-effect waves-light">
                  Primary
                </button>
                <button type="button" className="btn btn-success btn-soft-success waves-effect waves-light">
                  Success
                </button>
                <button type="button" className="btn btn-info btn-soft-info waves-effect waves-light">
                  Info
                </button>
                <button type="button" className="btn btn-warning btn-soft-warning waves-effect waves-light">
                  Warning
                </button>
                <button type="button" className="btn btn-danger btn-soft-danger waves-effect waves-light">
                  Danger
                </button>
                <button type="button" className="btn btn-dark btn-soft-dark waves-effect waves-light">
                  Dark
                </button>
                <button type="button" className="btn btn-secondary btn-soft-secondary waves-effect waves-light">
                  Secondary
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Buttons with Icon</h4>
              <p className="card-title-desc">Add icon in button.</p>

              <div className="d-flex flex-wrap gap-2">
                <button type="button" className="btn btn-primary waves-effect waves-light">
                  Primary <i className="uil uil-arrow-right ms-2"></i>
                </button>
                <button type="button" className="btn btn-success waves-effect waves-light">
                  <i className="uil uil-check me-2"></i> Success
                </button>
                <button type="button" className="btn btn-warning waves-effect waves-light">
                  <i className="uil uil-exclamation-triangle me-2"></i> Warning
                </button>
                <button type="button" className="btn btn-danger waves-effect waves-light">
                  <i className="uil uil-exclamation-octagon me-2"></i> Danger
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Buttons Sizes</h4>
              <p className="card-title-desc">
                Add <code>.btn-lg</code> or <code>.btn-sm</code> for additional sizes.
              </p>

              <div className="d-flex flex-wrap gap-2 align-items-center">
                <button type="button" className="btn btn-primary btn-lg waves-effect waves-light">
                  Large button
                </button>
                <button type="button" className="btn btn-light btn-lg waves-effect waves-light">
                  Large button
                </button>
                <button type="button" className="btn btn-primary btn-sm waves-effect waves-light">
                  Small button
                </button>
                <button type="button" className="btn btn-light btn-sm waves-effect waves-light">
                  Small button
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Buttons Width</h4>
              <p className="card-title-desc">
                Add <code>.w-xs</code>, <code>.w-sm</code>, <code>.w-md</code> and <code> .w-lg</code> class for additional
                buttons width.
              </p>

              <div className="d-flex flex-wrap gap-2">
                <button type="button" className="btn btn-primary w-xs waves-effect waves-light">
                  Xs
                </button>
                <button type="button" className="btn btn-danger w-sm waves-effect waves-light">
                  Small
                </button>
                <button type="button" className="btn btn-warning w-md waves-effect waves-light">
                  Medium
                </button>
                <button type="button" className="btn btn-success w-lg waves-effect waves-light">
                  Large
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Button Tags</h4>
              <p className="card-title-desc">
                The <code className="highlighter-rouge">.btn</code> classes are designed to be used with the{' '}
                <code className="highlighter-rouge">&lt;button&gt;</code> element. However, you can also use these classes on{' '}
                <code className="highlighter-rouge">&lt;a&gt;</code> or <code className="highlighter-rouge">&lt;input&gt;</code>{' '}
                elements (though some browsers may apply a slightly different rendering).
              </p>

              <div className="d-flex flex-wrap gap-2">
                <a className="btn btn-primary waves-effect waves-light" href="#" role="button">
                  Link
                </a>
                <button className="btn btn-success waves-effect waves-light" type="submit">
                  Button
                </button>
                <input className="btn btn-info" type="button" value="Input" />
                <input className="btn btn-danger" type="submit" value="Submit" />
                <input className="btn btn-warning" type="reset" value="Reset" />
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Toggle States</h4>
              <p className="card-title-desc">
                Add <code className="highlighter-rouge">data-bs-toggle="button"</code> to toggle a button&apos;s{' '}
                <code className="highlighter-rouge">active</code> state. If you&apos;re pre-toggling a button, you must manually
                add the <code className="highlighter-rouge">.active</code> class <strong>and</strong>{' '}
                <code className="highlighter-rouge">aria-pressed="true"</code> to the{' '}
                <code className="highlighter-rouge">&lt;button&gt;</code>.
              </p>

              <div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-primary waves-effect waves-light"
                  data-bs-toggle="button"
                  aria-pressed="false"
                >
                  Single toggle
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Block Buttons</h4>
              <p className="card-title-desc">
                Create block level buttons—those that span the full width of a parent—by adding{' '}
                <code className="highlighter-rouge"> gap-2</code>.
              </p>

              <div className="d-grid gap-2">
                <button type="button" className="btn btn-primary btn-lg waves-effect waves-light mb-1">
                  Block level button
                </button>
                <button type="button" className="btn btn-light btn-sm waves-effect waves-light">
                  Block level button
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Checkbox & Radio Buttons</h4>
              <p className="card-title-desc">
                Bootstrap&apos;s <code className="highlighter-rouge">.button</code> styles can be applied to other elements, such
                as <code className="highlighter-rouge">&lt;label&gt;</code>s, to provide checkbox or radio style button
                toggling. Add <code className="highlighter-rouge">data-bs-toggle="buttons"</code> to a{' '}
                <code className="highlighter-rouge">.btn-group</code> containing those modified buttons to enable toggling in
                their respective styles.
              </p>

              <div className="row">
                <div className="col-xl-6">
                  <div className="btn-group" role="group" aria-label="Basic checkbox toggle button group">
                    <input type="checkbox" className="btn-check" id="btncheck1" autoComplete="off" defaultChecked />
                    <label className="btn btn-primary" htmlFor="btncheck1">
                      Checkbox 1
                    </label>

                    <input type="checkbox" className="btn-check" id="btncheck2" autoComplete="off" />
                    <label className="btn btn-primary" htmlFor="btncheck2">
                      Checkbox 2
                    </label>

                    <input type="checkbox" className="btn-check" id="btncheck3" autoComplete="off" />
                    <label className="btn btn-primary" htmlFor="btncheck3">
                      Checkbox 3
                    </label>
                  </div>
                </div>

                <div className="col-xl-6">
                  <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                    <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" defaultChecked />
                    <label className="btn btn-light" htmlFor="btnradio1">
                      Radio 1
                    </label>

                    <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" />
                    <label className="btn btn-light" htmlFor="btnradio2">
                      Radio 2
                    </label>

                    <input type="radio" className="btn-check" name="btnradio" id="btnradio3" autoComplete="off" />
                    <label className="btn btn-light" htmlFor="btnradio3">
                      Radio 3
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Button Group</h4>
              <p className="card-title-desc">
                Wrap a series of buttons with <code className="highlighter-rouge">.btn</code> in{' '}
                <code className="highlighter-rouge">.btn-group</code>.
              </p>

              <div className="row">
                <div className="col-md-6">
                  <div className="d-flex flex-wrap gap-2">
                    <div className="btn-group" role="group" aria-label="Basic example">
                      <button type="button" className="btn btn-primary">
                        Left
                      </button>
                      <button type="button" className="btn btn-primary">
                        Middle
                      </button>
                      <button type="button" className="btn btn-primary">
                        Right
                      </button>
                    </div>

                    <div className="btn-group" role="group" aria-label="Basic example">
                      <a href="javascript:void(0);" className="btn btn-outline-primary active" aria-current="page">
                        Left
                      </a>
                      <a href="javascript:void(0);" className="btn btn-outline-primary">
                        Middle
                      </a>
                      <a href="javascript:void(0);" className="btn btn-outline-primary">
                        Right
                      </a>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex flex-wrap gap-3 mt-4 mt-md-0">
                    <div className="btn-group" role="group" aria-label="Basic example">
                      <button type="button" className="btn btn-light">
                        <i className="bx bx-menu-alt-right"></i>
                      </button>
                      <button type="button" className="btn btn-light">
                        <i className="bx bx-menu"></i>
                      </button>
                      <button type="button" className="btn btn-light">
                        <i className="bx bx-menu-alt-left"></i>
                      </button>
                    </div>

                    <div className="btn-group" role="group" aria-label="Basic example">
                      <button type="button" className="btn btn-outline-secondary">
                        <i className="bx bx-menu-alt-right"></i>
                      </button>
                      <button type="button" className="btn btn-outline-secondary">
                        <i className="bx bx-menu"></i>
                      </button>
                      <button type="button" className="btn btn-outline-secondary">
                        <i className="bx bx-menu-alt-left"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Button Toolbar</h4>
              <p className="card-title-desc">
                Combine sets of button groups into button toolbars for more complex components. Use utility classes as needed to
                space out groups, buttons, and more.
              </p>

              <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                <div className="btn-group me-2" role="group" aria-label="First group">
                  <button type="button" className="btn btn-light">
                    1
                  </button>
                  <button type="button" className="btn btn-light">
                    2
                  </button>
                  <button type="button" className="btn btn-light">
                    3
                  </button>
                  <button type="button" className="btn btn-light">
                    4
                  </button>
                </div>
                <div className="btn-group me-2" role="group" aria-label="Second group">
                  <button type="button" className="btn btn-light">
                    5
                  </button>
                  <button type="button" className="btn btn-light">
                    6
                  </button>
                  <button type="button" className="btn btn-light">
                    7
                  </button>
                </div>
                <div className="btn-group" role="group" aria-label="Third group">
                  <button type="button" className="btn btn-light">
                    8
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Button Group Sizing</h4>
              <p className="card-title-desc">
                Instead of applying button sizing classes to every button in a group, just add{' '}
                <code className="highlighter-rouge">.btn-group-*</code> to each <code className="highlighter-rouge">.btn-group</code>
                , including each one when nesting multiple groups.
              </p>

              <div className="d-flex flex-wrap gap-3 align-items-center">
                <div className="btn-group btn-group-lg" role="group" aria-label="Basic example">
                  <button type="button" className="btn btn-primary">
                    Left
                  </button>
                  <button type="button" className="btn btn-primary">
                    Middle
                  </button>
                  <button type="button" className="btn btn-primary">
                    Right
                  </button>
                </div>

                <div className="btn-group" role="group" aria-label="Basic example">
                  <button type="button" className="btn btn-light">
                    Left
                  </button>
                  <button type="button" className="btn btn-light">
                    Middle
                  </button>
                  <button type="button" className="btn btn-light">
                    Right
                  </button>
                </div>

                <div className="btn-group btn-group-sm" role="group" aria-label="Basic example">
                  <button type="button" className="btn btn-danger">
                    Left
                  </button>
                  <button type="button" className="btn btn-danger">
                    Middle
                  </button>
                  <button type="button" className="btn btn-danger">
                    Right
                  </button>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-3 align-items-center mt-3">
                <div className="btn-group btn-group-lg" role="group" aria-label="Basic example">
                  <button type="button" className="btn btn-outline-primary">
                    Left
                  </button>
                  <button type="button" className="btn btn-outline-primary">
                    Middle
                  </button>
                  <button type="button" className="btn btn-outline-primary">
                    Right
                  </button>
                </div>

                <div className="btn-group" role="group" aria-label="Basic example">
                  <button type="button" className="btn btn-outline-dark">
                    Left
                  </button>
                  <button type="button" className="btn btn-outline-dark">
                    Middle
                  </button>
                  <button type="button" className="btn btn-outline-dark">
                    Right
                  </button>
                </div>

                <div className="btn-group btn-group-sm" role="group" aria-label="Basic example">
                  <button type="button" className="btn btn-outline-danger">
                    Left
                  </button>
                  <button type="button" className="btn btn-outline-danger">
                    Middle
                  </button>
                  <button type="button" className="btn btn-outline-danger">
                    Right
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Vertical Variation</h4>
              <p className="card-title-desc">
                Make a set of buttons appear vertically stacked rather than horizontally. Split button dropdowns are not supported
                here.
              </p>

              <div className="d-flex flex-wrap gap-3 align-items-center">
                <div className="btn-group-vertical" role="group" aria-label="Vertical button group">
                  <button type="button" className="btn btn-light">
                    Button
                  </button>
                  <div className="btn-group" role="group">
                    <button
                      id="btnGroupVerticalDrop1"
                      type="button"
                      className="btn btn-light dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      Dropdown <i className="mdi mdi-chevron-down"></i>
                    </button>
                    <div className="dropdown-menu" aria-labelledby="btnGroupVerticalDrop1">
                      <a className="dropdown-item" href="#">
                        Dropdown link
                      </a>
                      <a className="dropdown-item" href="#">
                        Dropdown link
                      </a>
                    </div>
                  </div>
                  <button type="button" className="btn btn-light">
                    Button
                  </button>
                </div>

                <div className="btn-group-vertical" role="group" aria-label="Vertical radio toggle button group">
                  <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio1" autoComplete="off" defaultChecked />
                  <label className="btn btn-outline-danger" htmlFor="vbtn-radio1">
                    Radio 1
                  </label>
                  <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio2" autoComplete="off" />
                  <label className="btn btn-outline-danger" htmlFor="vbtn-radio2">
                    Radio 2
                  </label>
                  <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio3" autoComplete="off" />
                  <label className="btn btn-outline-danger" htmlFor="vbtn-radio3">
                    Radio 3
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

