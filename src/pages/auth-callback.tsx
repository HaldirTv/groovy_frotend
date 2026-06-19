import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginWithGoogleApi } from '../api/auth'
import { setAccessToken, getOrCreateDeviceId, decodeTokenEmail } from '../api/api-client'

export const AuthCallback = () => {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')

      if (!code) {
        setError('Код авторизації відсутній у URL.')
        return
      }

      try {
        const deviceId = getOrCreateDeviceId()
        const result = await loginWithGoogleApi({ code, deviceId })

        if (result.token) {
          const email = decodeTokenEmail(result.token)
          if (email) {
            localStorage.setItem('UserEmail', email)
          }
          setAccessToken(result.token)
          navigate('/main')
        } else {
          throw new Error('Токен відсутній у відповіді сервера')
        }
      } catch (err: unknown) {
        console.error("Помилка авторизації через Google:", err)
        if (err instanceof Error) {
          setError(err.message || 'Помилка авторизації через Google')
        } else {
          setError('Помилка авторизації через Google')
        }
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div style={{ color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#131313', fontFamily: 'SUSE, sans-serif' }}>
      {error ? (
        <div style={{ color: '#ef4444', marginBottom: '20px', fontSize: '18px' }}>{error}</div>
      ) : (
        <div style={{ fontSize: '18px' }}>Авторизація через Google...</div>
      )}
    </div>
  )
}
