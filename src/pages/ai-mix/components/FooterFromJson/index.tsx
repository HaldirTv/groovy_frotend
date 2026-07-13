import React from "react"
import { Link } from "react-router-dom"
import "./style.css"

export const FooterFromJson = (): React.JSX.Element => {
  return (
    <div className="footer-from-json">

      <div className="ffj-margin">
        <div className="ffj-container">
          <div className="ffj-logo-wrapper">
            <div className="ffj-logo">Groovra</div>
          </div>
        </div>
      </div>


      <div className="ffj-links">
        <Link className="ffj-link" to="/privacy-policy" tabIndex={0} aria-label="Політика конфіденційності">
          <span className="ffj-link-text">Політика конфіденційності</span>
        </Link>
        <Link className="ffj-link" to="/cookies" tabIndex={0} aria-label="Cookies">
          <span className="ffj-link-text">Cookies</span>
        </Link>
        <Link className="ffj-link" to="/about" tabIndex={0} aria-label="Про нас">
          <span className="ffj-link-text ffj-link-text--light">Про нас</span>
        </Link>
      </div>


      <div className="ffj-copyright-wrapper">
        <div className="ffj-copyright-inner">
          <p className="ffj-copyright">© 2026 Groovra Premium Music</p>
        </div>
      </div>
    </div>
  )
}
