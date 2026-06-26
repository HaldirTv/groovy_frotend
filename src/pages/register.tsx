import { useState } from 'react'
import LogoReg from '../assets/LogoReg.svg'
import MiddleLogo from '../assets/MiddleLogo.svg'
import Google from '../assets/Google.svg'
import { Link, useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { setAccessToken, GATEWAY_URL, getOrCreateDeviceId, decodeTokenEmail } from '../api/api-client'

export const Reg = () => {
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
          throw new Error(data.message || 'Помилка реєстрації через Google')
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
          setError(err.message || 'Сталася помилка при реєстрації')
        } else {
          setError('Сталася невідома помилка')
        }
      } finally {
        setIsLoading(false)
      }
    },
    onError: () => {
      setError('Не вдалося зареєструватися через Google')
    }
  })

  const handleGoogleClick = () => {
    if (!hasGoogleClientId) {
      setError('Реєстрація через Google не налаштована (відсутній VITE_GOOGLE_CLIENT_ID).')
      return
    }
    loginWithGoogle()
  }

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError('Будь ласка, введіть email')
      return
    }
    // Save email for next step (create.tsx)
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
          <span className='auth-title'>Доєднайся до нашої музичної спільноти!</span>

          {error && <div className='auth-error' role="alert">{error}</div>}

          <form onSubmit={handleContinue} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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

            <button type="submit" className='auth-button' disabled={isLoading}>
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