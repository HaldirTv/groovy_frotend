// src/pages/create.tsx
import LogoReg from '../assets/LogoReg.svg'
import MiddleLogo from '../assets/MiddleLogo.svg'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { GATEWAY_URL } from '../api/api-client'

export const Create = () => {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const email = localStorage.getItem('RegistrationEmail')
    if (!email) navigate('/reg')
  }, [navigate])

  const handleContinue = async (e: React.FormEvent) => {
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

    const email = localStorage.getItem('RegistrationEmail')
    const username = localStorage.getItem('RegistrationUsername')
    if (!email || !username) {
      setError('Дані не знайдено. Поверніться до початку.')
      return
    }

    setIsLoading(true)
    try {
      // Виклик твого бекенду: /auth/register
      const response = await fetch(`${GATEWAY_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username }), // Відправляємо Username!
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.message || data.Message || 'Помилка реєстрації')
      }

      // Успіх! Твій бекенд каже: "You have 10 minutes to verify."
      // Переходимо на сторінку введення коду для реєстрації
      navigate('/confirm-reg')
    } catch (err: any) {
      setError(err.message || 'Сталася невідома помилка')
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
          <span className='auth-title'>Створення акаунту</span>

          {error && <div className='auth-error' role="alert">{error}</div>}

          <form onSubmit={handleContinue} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className='auth-form-group'>
              <label htmlFor="create-password" className='auth-label'>Пароль</label>
              <div className='auth-input-wrapper'>
                <input
                  id="create-password"
                  type="password"
                  placeholder='Пароль'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={isLoading}
                  required
                />
              </div>
              <span className='auth-hint'>Має містити не менше 8 символів!</span>
            </div>

            <div className='auth-form-group'>
              <label htmlFor="create-confirm-password" className='auth-label'>Підтвердити пароль</label>
              <div className='auth-input-wrapper'>
                <input
                  id="create-confirm-password"
                  type="password"
                  placeholder='Повторіть пароль'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={isLoading}
                  required
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