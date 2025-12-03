export default function Footer() {
  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-6">
            {new Date().getFullYear()} © MENTAL HEALTH ASSESSMENT SYSTEM.
          </div>
          <div className="col-sm-6">
            <div className="text-sm-end d-none d-sm-block">
              Crafted with <i className="mdi mdi-heart text-danger"></i> by{' '}
              <a href="https://themesbrand.com/" target="_blank" rel="noopener noreferrer" className="text-reset">
                Themesbrand
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

