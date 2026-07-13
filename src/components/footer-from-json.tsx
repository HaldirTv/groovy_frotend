import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './footer-from-json.css'

export function FooterFromJson(): React.JSX.Element {
  const { t } = useTranslation()
  const { lang } = useParams<{ lang?: string }>()
  
  const prefix = lang === 'en' ? '/en' : ''

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
        <Link className="ffj-link" to={`${prefix}/privacy-policy`} tabIndex={0} aria-label={t('cookies.necessary_list.privacy') || 'Privacy Policy'}>
          <span className="ffj-link-text">{t('privacy.title')}</span>
        </Link>
        <Link className="ffj-link" to={`${prefix}/cookies`} tabIndex={0} aria-label="Cookies">
          <span className="ffj-link-text">Cookies</span>
        </Link>
        <Link className="ffj-link" to={`${prefix}/about`} tabIndex={0} aria-label={t('about.title')}>
          <span className="ffj-link-text ffj-link-text--light">{t('about.title')}</span>
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
