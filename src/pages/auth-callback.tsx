import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginWithGoogleApi } from '../api/auth'
import { setAccessToken, getOrCreateDeviceId, decodeTokenEmail } from '../api/api-client'

export const AuthCallback = () => {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [status, setStatus] = useState('Обробка даних Google, зачекайте...')

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
        setStatus('Зв\'язок з сервером Groovra...')
        const result = await loginWithGoogleApi({ code, deviceId })
        const token = result?.token || result?.Token

        if (token) {
          const email = decodeTokenEmail(token)
          if (email) {
            localStorage.setItem('UserEmail', email)
          }
          setAccessToken(token)
          navigate('/main')
        } else {
          throw new Error('Сервер повернув успішну відповідь, але токен доступу відсутній.')
        }
      } catch (err: any) {
        console.error("Помилка Google Auth:", err)
        setError(err.message || 'Сталася помилка на бекенді при обміні коду Google.')
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div style={{ color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#131313', fontFamily: 'SUSE, sans-serif', padding: '20px', textAlign: 'center' }}>
      {error ? (
        <div style={{ maxWidth: '500px' }}>
          <h2 style={{ color: '#ff4a4a', marginBottom: '15px' }}>Помилка авторизації</h2>
          <p style={{ color: '#b3b3b3', marginBottom: '20px' }}>{error}</p>
          <button onClick={() => navigate('/login')} style={{ backgroundColor: '#fff', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Повернутися до входу
          </button>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: '18px', color: '#e0e0e0' }}>{status}</p>
        </div>
      )}
    </div>
  )
}
