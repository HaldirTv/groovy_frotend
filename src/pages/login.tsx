import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import LogoReg from '../assets/LogoReg.svg'
import MiddleLogo from '../assets/MiddleLogo.svg'
import Google from '../assets/Google.svg'
import { Link, useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { setAccessToken, GATEWAY_URL, getOrCreateDeviceId } from '../api/api-client'
import { translateServerError } from '../api/error-translator'

export const Log = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const hasGoogleClientId = !!import.meta.env.VITE_GOOGLE_CLIENT_ID
  const loginWithGoogle = useGoogleLogin({
    flow: 'auth-code',
    ux_mode: 'redirect',
    redirect_uri: 'http://localhost:5173/auth/callback',
  })

  const handleGoogleClick = () => {
    if (!hasGoogleClientId) {
      setError(t('errors.google_not_configured'))
      return
    }
    loginWithGoogle()
  }

  const handleLogin = async () => {
    setError('')
    setIsLoading(true)
    try {
      const deviceId = getOrCreateDeviceId()
      const response = await fetch(`${GATEWAY_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, deviceId }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.message || t('errors.auth_failed'))
      }

      localStorage.setItem('UserEmail', email)
      setAccessToken(data.token)

      navigate('/main')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(translateServerError(err.message, t))
      } else {
        setError(t('errors.unknown'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='auth-wrapper'>
      <div className='auth-header'>
        <img src={LogoReg} className='auth-logo' alt='RegLogo' />
      </div>

      <div className='auth-content'>
        <div className='auth-container'>
          <img src={MiddleLogo} className='auth-middle-logo' alt='MiddleLogo' />
          <span className='auth-title'>{t('auth.welcome_back')}</span>

          {error && <div className='auth-error' role="alert">{error}</div>}

          <form onSubmit={(e) => { e.preventDefault(); handleLogin() }} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className='auth-form-group'>
              <label htmlFor="login-email" className='auth-label'>{t('auth.email_label')}</label>
              <div className='auth-input-wrapper'>
                <input
                  id="login-email"
                  type="email"
                  placeholder={t('auth.enter_email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className='auth-form-group'>
              <label htmlFor="login-password" className='auth-label'>{t('auth.password')}</label>
              <div className='auth-input-wrapper'>
                <input
                  id="login-password"
                  type="password"
                  placeholder={t('auth.password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <Link to="/forgotpassword" className='auth-forgot-pass'>{t('auth.forgot_password')}</Link>

            <button type="submit" className='auth-button' disabled={isLoading}>
              {isLoading ? t('auth.wait') : t('auth.continue')}
            </button>
          </form>

          <span className='auth-or-text'>{t('auth.or')}</span>

          <button className='auth-google-btn' onClick={handleGoogleClick} disabled={isLoading} type="button">
            <img src={Google} alt='Google' />
            <span>{t('auth.google_login')}</span>
          </button>

          <div className='auth-footer'>
            <span className='auth-footer-text'>{t('auth.no_account')}</span>
            <Link to="/reg" className="auth-footer-link">{t('auth.register_btn')}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}