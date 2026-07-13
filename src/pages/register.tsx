import { useState } from 'react'
import LogoReg from '../assets/LogoReg.svg'
import MiddleLogo from '../assets/MiddleLogo.svg'
import Google from '../assets/Google.svg'
import { Link, useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { useUsernameCheck } from '../hooks/use-username-check'

const statusColor: Record<string, string> = {
  idle:      'transparent',
  checking:  '#888',
  available: '#5ce07a',
  taken:     '#e05c5c',
  invalid:   '#e0a45c',
  error:     '#e0a45c',
}

export const Reg = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [isLoading] = useState(false)

  const { status: unStatus, message: unMessage } = useUsernameCheck(username)

  const hasGoogleClientId = !!import.meta.env.VITE_GOOGLE_CLIENT_ID

  const loginWithGoogle = useGoogleLogin({
    flow: 'auth-code',
    ux_mode: 'redirect',
    redirect_uri: 'http://localhost:5178/auth/callback',
  })

  const handleGoogleClick = () => {
    if (!hasGoogleClientId) {
      setError('Реєстрація через Google не налаштована.')
      return
    }
    loginWithGoogle()
  }

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !username) {
      setError('Будь ласка, введіть email')
      return
    }
    if (unStatus === 'invalid' || unStatus === 'taken') {
      setError('Виберіть інший нікнейм')
      return
    }
    if (unStatus === 'checking') {
      setError('Зачекайте, перевіряємо нікнейм…')
      return
    }
    localStorage.setItem('RegistrationEmail', email)
    localStorage.setItem('RegistrationUsername', username)
    navigate('/create')
  }

  const isSubmitDisabled = isLoading || unStatus === 'taken' || unStatus === 'checking' || unStatus === 'invalid'

  return (
    <div className='auth-wrapper'>
      <div className='auth-header'>
        <img src={LogoReg} className='auth-logo' alt='RegLogo' />
      </div>

      <div className='auth-content'>
        <div className='auth-container'>
          <img src={MiddleLogo} className='auth-middle-logo' alt='MiddleLogo' />
          <span className='auth-title'>Доєднайся до нашої музичної спільноти!</span>

          {error && <div className='auth-error' role="alert">{error}</div>}

          <form onSubmit={handleContinue} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
            <div className='auth-form-group'>
              <label htmlFor="reg-username" className='auth-label'>Нікнейм</label>
              <div className='auth-input-wrapper' style={{ position: 'relative' }}>
                <input
                  id="reg-username"
                  type="text"
                  placeholder='Введіть свій нікнейм'
                  value={username}
                  onChange={(e) => { setError(''); setUsername(e.target.value) }}
                  required
                  disabled={isLoading}
                  autoComplete="username"
                  style={{ paddingRight: '2rem' }}
                />
                {unStatus !== 'idle' && (
                  <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: statusColor[unStatus], fontWeight: 700, pointerEvents: 'none', }} >
                    {unStatus === 'checking'  && '⏳'}
                    {unStatus === 'available' && '✓'}
                    {unStatus === 'taken'     && '✗'}
                    {unStatus === 'invalid'   && '!'}
                    {unStatus === 'error'     && '?'}
                  </span>
                )}
              </div>

              {unMessage && (
                <span className='auth-hint' role="status" aria-live="polite" style={{ color: statusColor[unStatus], marginTop: '0.3rem' }} >
                  {unMessage}
                </span>
              )}
            </div>

            <div className='auth-form-group'>
              <label htmlFor="reg-email" className='auth-label'>E-Mail</label>
              <div className='auth-input-wrapper'>
                <input
                  id="reg-email"
                  type="email"
                  placeholder='Уведіть пошту'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            <button type="submit" className='auth-button' disabled={isSubmitDisabled}>
              Продовжити
            </button>
          </form>

          <span className='auth-or-text'>Або</span>

          <button className='auth-google-btn' onClick={handleGoogleClick} disabled={isLoading} type="button">
            <img src={Google} alt='Google' />
            <span>Зареєструватися через Google</span>
          </button>

          <div className='auth-footer'>
            <span className='auth-footer-text'>Вже маєте акаунт?</span>
            <Link to="/login" className="auth-footer-link">Увійти</Link>
          </div>
        </div>
      </div>
    </div>
  )
}