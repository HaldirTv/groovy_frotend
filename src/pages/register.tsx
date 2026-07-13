import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import LogoReg from '../assets/LogoReg.svg'
import MiddleLogo from '../assets/MiddleLogo.svg'
import Google from '../assets/Google.svg'
import { Link, useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { setAccessToken, GATEWAY_URL, getOrCreateDeviceId, decodeTokenEmail } from '../api/api-client'
import { translateServerError } from '../api/error-translator'

export const Reg = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const hasGoogleClientId = !!import.meta.env.VITE_GOOGLE_CLIENT_ID

  const loginWithGoogle = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      setError('')
      setIsLoading(true)
      try {
        const deviceId = getOrCreateDeviceId()
        const response = await fetch(`${GATEWAY_URL}/auth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ code: codeResponse.code, deviceId }),
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(data.message || t('errors.google_failed'))
        }

        if (data.token) {
          const emailFromToken = decodeTokenEmail(data.token)
          if (emailFromToken) {
            localStorage.setItem('UserEmail', emailFromToken)
          }
          setAccessToken(data.token)
        }

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
    },
    onError: () => {
      setError(t('errors.google_failed'))
    }
  })

  const handleGoogleClick = () => {
    if (!hasGoogleClientId) {
      setError(t('errors.google_not_configured'))
      return
    }
    loginWithGoogle()
  }

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError(t('errors.email_required'))
      return
    }
    localStorage.setItem('RegistrationEmail', email)
    navigate('/create')
  }

  return (
    <div className='auth-wrapper'>
      <div className='auth-header'>
        <img src={LogoReg} className='auth-logo' alt='RegLogo' />
      </div>

      <div className='auth-content'>
        <div className='auth-container'>
          <img src={MiddleLogo} className='auth-middle-logo' alt='MiddleLogo' />
          <span className='auth-title'>{t('auth.title_reg')}</span>

          {error && <div className='auth-error' role="alert">{error}</div>}

          <form onSubmit={handleContinue} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className='auth-form-group'>
              <label htmlFor="reg-email" className='auth-label'>{t('auth.email')}</label>
              <div className='auth-input-wrapper'>
                <input
                  id="reg-email"
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

            <button type="submit" className='auth-button' disabled={isLoading}>
              {t('auth.continue')}
            </button>
          </form>

          <span className='auth-or-text'>{t('auth.or')}</span>

          <button className='auth-google-btn' onClick={handleGoogleClick} disabled={isLoading} type="button">
            <img src={Google} alt='Google' />
            <span>{t('auth.google_reg')}</span>
          </button>

          <div className='auth-footer'>
            <span className='auth-footer-text'>{t('auth.have_account')}</span>
            <Link to="/login" className="auth-footer-link">{t('auth.login_btn')}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}