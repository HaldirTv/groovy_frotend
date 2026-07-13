import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { refreshSession } from './api/api-client'
import { Reg } from './pages/register'
import { Log } from './pages/login'
import { Create } from './pages/create'
import { Profile } from './pages/profile'
import { Forgot } from './pages/forgot-password'
import { Cod } from './pages/email-code'
import { Recovery } from './pages/password-recovery'
import { Main } from './pages/main-page'
import { AiMixPage } from './pages/ai-mix'
import { DownloadsPage } from './pages/downloads'
import { SearchPage } from './pages/search'
import { LibraryPage } from './pages/library'
import { LikedPage } from './pages/liked'
import { PrivacyPolicy } from './pages/privacy-policy'
import { CookiesPolicy } from './pages/cookies'
import { AboutPage } from './pages/about'
import { TrackPage } from './pages/track'
import { AuthCallback } from './pages/auth-callback'
import { ProtectedRoute } from './components/protected-route'
import { PublicRoute } from './components/public-route'
import { Layout } from './components/layout'
import { PlayerProvider } from './context/player-context'
import { ProfileProvider } from './context/profile context'
import './app.css'

const detectLanguage = (activeI18nLanguage?: string): 'en' | 'uk' => {
  const saved = localStorage.getItem('lang')
  console.log('detectLanguage input:', { saved, activeI18nLanguage, navLanguage: navigator.language, navLanguages: navigator.languages })
  if (saved === 'en' || saved === 'uk') {
    return saved
  }
  
  if (activeI18nLanguage) {
    const code = activeI18nLanguage.toLowerCase()
    if (code.startsWith('en')) return 'en'
    if (code.startsWith('uk') || code.startsWith('ua')) return 'uk'
  }

  if (navigator.languages && navigator.languages.length > 0) {
    for (const lang of navigator.languages) {
      const code = lang.toLowerCase()
      if (code.startsWith('en')) return 'en'
      if (code.startsWith('uk') || code.startsWith('ua')) return 'uk'
    }
  }

  const browserLang = (navigator.language || '').toLowerCase()
  if (browserLang.startsWith('en')) {
    return 'en'
  }
  
  return 'uk'
}

const LanguageSync = ({ children }: { children: React.ReactNode }) => {
  const { lang } = useParams<{ lang?: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const [isSynced, setIsSynced] = useState(false)

  useEffect(() => {
    const savedLang = detectLanguage(i18n.language)
    console.log('LanguageSync useEffect:', { langParam: lang, pathname: location.pathname, i18nLanguage: i18n.language, detectedLang: savedLang })

    const hasEnPrefix = location.pathname.startsWith('/en/') || location.pathname === '/en'

    if (lang === 'en') {
      if (i18n.language !== 'en') {
        i18n.changeLanguage('en')
      }
      localStorage.setItem('lang', 'en')
      setIsSynced(true)
    } else if (lang === 'ua' || lang === 'uk') {
      const newPath = location.pathname.replace(/^\/(ua|uk)/, '') || '/'
      localStorage.setItem('lang', 'uk')
      if (i18n.language !== 'uk') {
        i18n.changeLanguage('uk')
      }
      navigate(newPath, { replace: true })
    } else {
      if (savedLang === 'en') {
        if (!hasEnPrefix) {
          const newPath = `/en${location.pathname}`
          console.log('Redirecting to EN:', newPath)
          navigate(newPath, { replace: true })
        } else {
          if (i18n.language !== 'en') {
            i18n.changeLanguage('en')
          }
          setIsSynced(true)
        }
      } else {
        if (hasEnPrefix) {
          const newPath = location.pathname.replace(/^\/en/, '') || '/'
          console.log('Redirecting away from EN:', newPath)
          navigate(newPath, { replace: true })
        } else {
          if (i18n.language !== 'uk') {
            i18n.changeLanguage('uk')
          }
          localStorage.setItem('lang', 'uk')
          setIsSynced(true)
        }
      }
    }
  }, [lang, location.pathname, i18n, navigate])

  if (!isSynced) {
    const isEn = lang === 'en' || (!lang && detectLanguage(i18n.language) === 'en')
    return (
      <div
        className="Loader"
        style={{ color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#131313', fontFamily: 'SUSE, sans-serif' }}
        aria-live="polite"
        aria-busy="true"
      >
        {isEn ? 'Loading...' : 'Завантаження...'}
      </div>
    )
  }

  return <>{children}</>
}

const LanguageRedirect = () => {
  const { lang } = useParams<{ lang?: string }>()
  const { i18n } = useTranslation()
  const savedLang = detectLanguage(i18n.language)

  if (lang === 'en' || (savedLang === 'en' && !lang)) {
    return <Navigate to="/en/main" replace />
  }
  return <Navigate to="/main" replace />
}

const WildcardRedirect = () => {
  const { lang } = useParams<{ lang?: string }>()
  const { i18n } = useTranslation()
  const savedLang = detectLanguage(i18n.language)
  
  const targetLang = lang === 'en' || (savedLang === 'en' && !lang) ? 'en' : 'uk'
  const prefix = targetLang === 'en' ? '/en' : ''
  return <Navigate to={`${prefix}/main`} replace />
}

export const App = () => {
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const initApp = async () => {
      if (localStorage.getItem('UserEmail')) {
        await refreshSession()
      }
      setIsInitializing(false)
    }
    initApp()
  }, [])

  if (isInitializing) {
    const isEn = localStorage.getItem('lang') === 'en'
    return (
      <div
        className="Loader"
        style={{ color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#131313', fontFamily: 'SUSE, sans-serif' }}
        aria-live="polite"
        aria-busy="true"
      >
        {isEn ? 'Loading...' : 'Завантаження...'}
      </div>
    )
  }

  return (
    <ProfileProvider>
      <PlayerProvider>
        <Router>
          <Routes>
            <Route path="/:lang?">
              <Route index element={<LanguageRedirect />} />
              
              <Route path="reg" element={<LanguageSync><PublicRoute><Reg /></PublicRoute></LanguageSync>} />
              <Route path="login" element={<LanguageSync><PublicRoute><Log /></PublicRoute></LanguageSync>} />
              <Route path="create" element={<LanguageSync><PublicRoute><Create /></PublicRoute></LanguageSync>} />
              <Route path="forgotpassword" element={<LanguageSync><PublicRoute><Forgot /></PublicRoute></LanguageSync>} />
              <Route path="emailcod" element={<LanguageSync><PublicRoute><Cod /></PublicRoute></LanguageSync>} />
              <Route path="passwordrecovery" element={<LanguageSync><PublicRoute><Recovery /></PublicRoute></LanguageSync>} />
              <Route path="auth/callback" element={<LanguageSync><PublicRoute><AuthCallback /></PublicRoute></LanguageSync>} />
              
              <Route element={<LanguageSync><ProtectedRoute><Layout /></ProtectedRoute></LanguageSync>}>
                <Route path="profile" element={<Profile />} />
                <Route path="main" element={<Main />} />
                <Route path="ai-mix" element={<AiMixPage />} />
                <Route path="downloads" element={<DownloadsPage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="library" element={<LibraryPage />} />
                <Route path="liked" element={<LikedPage />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="cookies" element={<CookiesPolicy />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="track" element={<TrackPage />} />
              </Route>
              
              <Route path="*" element={<WildcardRedirect />} />
            </Route>
          </Routes>
        </Router>
      </PlayerProvider>
    </ProfileProvider>
  )
}

export default App