import LogoReg from '../assets/LogoReg.svg'
import MiddleLogo from '../assets/MiddleLogo.svg'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { GATEWAY_URL, getOrCreateDeviceId, setAccessToken } from '../api/api-client'
import { translateServerError } from '../api/error-translator'

export const Create = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const email = localStorage.getItem('RegistrationEmail')
    if (!email) {
      navigate('/reg')
    }
  }, [navigate])

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (username.length < 3) {
      setError(t('errors.username_short'))
      return
    }

    if (username.length > 50) {
      setError(t('errors.username_long'))
      return
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
      setError(t('errors.username_invalid'))
      return
    }

    if (password.length < 8) {
      setError(t('errors.password_length'))
      return
    }

    if (password !== confirmPassword) {
      setError(t('errors.password_mismatch'))
      return
    }

    const email = localStorage.getItem('RegistrationEmail')
    if (!email) {
      setError(t('errors.email_not_found_reg'))
      navigate('/reg')
      return
    }

    setIsLoading(true)
    try {
      const deviceId = getOrCreateDeviceId()
      const response = await fetch(`${GATEWAY_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, username, password, deviceId }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.message || t('errors.reg_failed'))
      }

      if (data.token) {
        localStorage.setItem('UserEmail', email)
        setAccessToken(data.token)
      }

      localStorage.removeItem('RegistrationEmail')
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
          <img src={MiddleLogo} className='auth-middle-logo' alt='Logo' />
          <span className='auth-title'>{t('auth.create_title')}</span>

          {error && <div className='auth-error' role="alert">{error}</div>}

          <form onSubmit={handleContinue} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className='auth-form-group'>
              <label htmlFor="create-username" className='auth-label'>{t('auth.username_label')}</label>
              <div className='auth-input-wrapper'>
                <input
                  id="create-username"
                  type="text"
                  placeholder={t('auth.username_placeholder')}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <span className='auth-hint'>{t('auth.username_hint')}</span>
            </div>

            <div className='auth-form-group'>
              <label htmlFor="create-password" className='auth-label'>{t('auth.password')}</label>
              <div className='auth-input-wrapper'>
                <input
                  id="create-password"
                  type="password"
                  placeholder={t('auth.password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={isLoading}
                  required
                />
              </div>
              <span className='auth-hint'>{t('auth.hint_chars')}</span>
            </div>

            <div className='auth-form-group'>
              <label htmlFor="create-confirm-password" className='auth-label'>{t('auth.confirm_password')}</label>
              <div className='auth-input-wrapper'>
                <input
                  id="create-confirm-password"
                  type="password"
                  placeholder={t('auth.confirm_password_placeholder')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <button type="submit" className='auth-button' disabled={isLoading}>
              {isLoading ? t('auth.wait') : t('auth.continue')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
