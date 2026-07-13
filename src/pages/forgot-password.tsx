import LogoReg from '../assets/LogoReg.svg'
import MiddleLogo from '../assets/MiddleLogo.svg'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { GATEWAY_URL } from '../api/api-client'

export const Forgot = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Будь ласка, введіть email')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${GATEWAY_URL}/auth/requestresetpassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'Помилка надсилання листа')
      }

      // Зберігаємо email для використання на кроці введення коду підтвердження
      localStorage.setItem('RecoveryEmail', email)
      navigate('/emailcod')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
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
          <img src={MiddleLogo} className='auth-middle-logo' alt="Logo" />
          <span className='auth-title'>Відновлення паролю</span>

          {error && <div className='auth-error' role="alert">{error}</div>}

          <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className='auth-form-group'>
              <label htmlFor="forgot-email" className='auth-label'>E-Mail</label>
              <div className='auth-input-wrapper'>
                <input
                  id="forgot-email"
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
              {isLoading ? 'Зачекайте...' : 'Продовжити'}
            </button>
          </form>

          <div className='auth-footer'>
            <Link to="/reg" className='auth-footer-link'>Повернутися до сторінки реєстрації</Link>
          </div>
        </div>
      </div>
    </div>
  )
}