// src/pages/register.tsx
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
  const [username, setUsername] = useState('') // ДОБАВЛЕНО: Никнейм
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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
      setError('Будь ласка, заповніть усі поля')
      return
    }
    // Зберігаємо дані для наступного кроку
    localStorage.setItem('RegistrationEmail', email)
    localStorage.setItem('RegistrationUsername', username) // Зберігаємо нікнейм
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
            
            {/* ДОБАВЛЕНО: Поле Нікнейм */}
            <div className='auth-form-group'>
              <label htmlFor="reg-username" className='auth-label'>Нікнейм</label>
              <div className='auth-input-wrapper'>
                <input
                  id="reg-username"
                  type="text"
                  placeholder='Введіть свій нікнейм'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
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