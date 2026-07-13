import { useState } from 'react'
import LogoReg from '../assets/LogoReg.svg'
import MiddleLogo from '../assets/MiddleLogo.svg'
import Google from '../assets/Google.svg'
import { Link, useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { setAccessToken, GATEWAY_URL, getOrCreateDeviceId } from '../api/api-client'

export const Log = () => {
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
    onError: () => {
      setError('Помилка при авторизації через Google')
    }
  })

  const handleGoogleClick = () => {
    if (!hasGoogleClientId) {
      setError('Вхід через Google не налаштовано (відсутній VITE_GOOGLE_CLIENT_ID).')
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

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Помилка авторизації')
      }

      // Зберігаємо email для автоматичного оновлення та зберігаємо Access Token у пам'яті
      localStorage.setItem('UserEmail', email)
      setAccessToken(data.token)

      navigate('/main')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Сталася помилка при вході')
      } else {
        setError('Сталася невідома помилка')
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
          <span className='auth-title'>З поверненням!</span>

          {error && <div className='auth-error' role="alert">{error}</div>}

          <form onSubmit={(e) => { e.preventDefault(); handleLogin() }} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className='auth-form-group'>
              <label htmlFor="login-email" className='auth-label'>Електронна пошта</label>
              <div className='auth-input-wrapper'>
                <input
                  id="login-email"
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

            <div className='auth-form-group'>
              <label htmlFor="login-password" className='auth-label'>Пароль</label>
              <div className='auth-input-wrapper'>
                <input
                  id="login-password"
                  type="password"
                  placeholder='Пароль'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <Link to="/forgotpassword" className='auth-forgot-pass'>Забули пароль?</Link>

            <button type="submit" className='auth-button' disabled={isLoading}>
              {isLoading ? 'Зачекайте...' : 'Продовжити'}
            </button>
          </form>

          <span className='auth-or-text'>Або</span>

          <button className='auth-google-btn' onClick={handleGoogleClick} disabled={isLoading} type="button">
            <img src={Google} alt='Google' />
            <span>Увійти через Google</span>
          </button>

          <div className='auth-footer'>
            <span className='auth-footer-text'>Ще не маєте акаунту?</span>
            <Link to="/reg" className="auth-footer-link">Зареєструватися</Link>
          </div>
        </div>
      </div>
    </div>
  )
}