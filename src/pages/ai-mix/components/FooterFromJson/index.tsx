import React from "react"
import "./style.css"

export const FooterFromJson = (): React.JSX.Element => {
  return (
    <div className="footer-from-json">
      {/* Logo */}
      <div className="ffj-margin">
        <div className="ffj-container">
          <div className="ffj-logo-wrapper">
            <div className="ffj-logo">Groovra</div>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <div className="ffj-links">
        <a className="ffj-link" href="#" tabIndex={0} aria-label="Політика конфіденційності">
          <span className="ffj-link-text">Політика конфіденційності</span>
        </a>
        <a className="ffj-link" href="#" tabIndex={0} aria-label="Cookies">
          <span className="ffj-link-text">Cookies</span>
        </a>
        <a className="ffj-link" href="#" tabIndex={0} aria-label="Про нас">
          <span className="ffj-link-text ffj-link-text--light">Про нас</span>
        </a>
      </div>

      {/* Copyright */}
      <div className="ffj-copyright-wrapper">
        <div className="ffj-copyright-inner">
          <p className="ffj-copyright">© 2026 Groovra Premium Music</p>
        </div>
      </div>
    </div>
  )
}
