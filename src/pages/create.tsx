import LogoReg from '../assets/LogoReg.svg'
import MiddleLogo from '../assets/MiddleLogo.svg'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { GATEWAY_URL, getOrCreateDeviceId } from '../api/api-client'
import { usePasswordStrength } from '../hooks/use-password-strength'

export const Create = () => {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showRules, setShowRules] = useState(false)

  const strength = usePasswordStrength(password)

  const confirmFilled     = confirmPassword.length > 0
  const passwordsMatch    = confirmFilled && password === confirmPassword
  const passwordsMismatch = confirmFilled && password !== confirmPassword

  useEffect(() => {
    const email = localStorage.getItem('RegistrationEmail')
    if (!email) {
      navigate('/reg')
    }
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
      setError('Email не знайдено. Поверніться до попереднього кроку.')
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
        throw new Error(data.message || data.Message || 'Помилка реєстрації')
      }

      navigate('/confirm-reg')
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

  const isSubmitDisabled = isLoading || passwordsMismatch || strength.level === 'weak' || !password

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

          <form onSubmit={handleContinue} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
            <div className='auth-form-group'>
              <label htmlFor="create-password" className='auth-label'>Пароль</label>
              <div className='auth-input-wrapper'>
                <input
                  id="create-password"
                  type="password"
                  placeholder='Пароль'
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setShowRules(true) }}
                  onFocus={() => setShowRules(true)}
                  autoComplete="new-password"
                  disabled={isLoading}
                  required
                />
              </div>

              {password.length > 0 && (
                <div style={{ marginTop: '0.5rem', width: '100%' }}>

                  <div style={{ display: 'flex', gap: '4px', height: '4px' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        style={{ flex: 1, borderRadius: '2px', backgroundColor: i < strength.score ? strength.color : '#3a3a3a', transition: 'background-color 0.25s ease',}} />
                    ))}
                  </div>

                  {strength.labelText && (
                    <span style={{ fontSize: '0.72rem', color: strength.color, marginTop: '3px', display: 'block' }}>
                      {strength.labelText}
                    </span>
                  )}

                  {showRules && (
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0.4rem 0 0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {strength.rules.map(rule => (
                        <li
                          key={rule.label}
                          style={{ fontSize: '0.72rem', color: rule.passed ? '#5ce07a' : '#888', display: 'flex', alignItems: 'center', gap: '5px', transition: 'color 0.2s', }} >
                          <span style={{ fontWeight: 700 }}>{rule.passed ? '✓' : '○'}</span>
                          {rule.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div className='auth-form-group'>
              <label htmlFor="create-confirm-password" className='auth-label'>Підтвердити пароль</label>
              <div className='auth-input-wrapper' style={{ position: 'relative' }}>
                <input
                  id="create-confirm-password"
                  type="password"
                  placeholder='Повторіть пароль'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={isLoading}
                  required
                  style={{ paddingRight: '2rem' }}
                />
                {confirmFilled && (
                  <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: passwordsMatch ? '#5ce07a' : '#e05c5c', fontWeight: 700, pointerEvents: 'none', }}>
                    {passwordsMatch ? '✓' : '✗'}
                  </span>
                )}
              </div>

              {confirmFilled && (
                <span
                  className='auth-hint'
                  role="status"
                  aria-live="polite"
                  style={{ color: passwordsMatch ? '#5ce07a' : '#e05c5c', marginTop: '0.3rem' }}
                >
                  {passwordsMatch ? 'Паролі збігаються' : 'Паролі не збігаються'}
                </span>
              )}
            </div>

            <button type="submit" className='auth-button' disabled={isSubmitDisabled}>
              {isLoading ? 'Зачекайте...' : 'Продовжити'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}