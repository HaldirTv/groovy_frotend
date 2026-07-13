import React from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import './LangSwitcher.css'

export const LangSwitcher: React.FC = () => {
  const { lang } = useParams<{ lang?: string }>()
  const location = useLocation()
  const navigate = useNavigate()

  const currentLang = lang === 'en' ? 'en' : 'uk'

  const handleLanguageChange = (targetLang: 'uk' | 'en') => {
    if (targetLang === currentLang) return

    localStorage.setItem('lang', targetLang)

    if (targetLang === 'en') {
      navigate(`/en${location.pathname}`, { replace: true })
    } else {
      const newPath = location.pathname.replace(/^\/en/, '') || '/'
      navigate(newPath, { replace: true })
    }
  }

  return (
    <div className="lang-switcher" role="radiogroup" aria-label="Language Selector">
      <button
        type="button"
        className={`lang-btn ${currentLang === 'uk' ? 'active' : ''}`}
        onClick={() => handleLanguageChange('uk')}
        role="radio"
        aria-checked={currentLang === 'uk'}
        aria-label="Ukrainian Language"
      >
        UA
      </button>
      <button
        type="button"
        className={`lang-btn ${currentLang === 'en' ? 'active' : ''}`}
        onClick={() => handleLanguageChange('en')}
        role="radio"
        aria-checked={currentLang === 'en'}
        aria-label="English Language"
      >
        EN
      </button>
    </div>
  )
}
