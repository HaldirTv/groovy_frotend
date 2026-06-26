import LogoReg from '../assets/LogoReg.svg'
import MiddleLogo from '../assets/MiddleLogo.svg'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GATEWAY_URL } from '../api/api-client'

export const Recovery = () => {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const email = localStorage.getItem('RecoveryEmail')
    const token = localStorage.getItem('RecoveryToken')
    if (!email || !token) {
      navigate('/forgotpassword')
    }
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Пароль має містити не менше 8 символів!')
      return
    }

    if (password !== confirmPassword) {
      setError('Паролі не співпадають!')
      return
    }

    const email = localStorage.getItem('RecoveryEmail')
    const token = localStorage.getItem('RecoveryToken')
    if (!email || !token) {
      setError('Дані відновлення не знайдено. Почніть відновлення знову.')
      navigate('/forgotpassword')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${GATEWAY_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword: password }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'Помилка зміни паролю')
      }

      // Очищаємо дані відновлення
      localStorage.removeItem('RecoveryEmail')
      localStorage.removeItem('RecoveryToken')
      navigate('/login')
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
              <label htmlFor="recovery-password" className='auth-label'>Введіть новий пароль</label>
              <div className='auth-input-wrapper'>
                <input
                  id="recovery-password"
                  type="password"
                  placeholder='Пароль'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
                />
              </div>
              <span className='auth-hint'>Має містити не менше 8 символів!</span>
            </div>

            <div className='auth-form-group'>
              <label htmlFor="recovery-confirm-password" className='auth-label'>Підтвердити пароль</label>
              <div className='auth-input-wrapper'>
                <input
                  id="recovery-confirm-password"
                  type="password"
                  placeholder='Повторіть пароль'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button type="submit" className='auth-button' disabled={isLoading}>
              {isLoading ? 'Зачекайте...' : 'Продовжити'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}