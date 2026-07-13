import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { loginWithGoogleApi } from '../api/auth'
import { setAccessToken, getOrCreateDeviceId, decodeTokenEmail } from '../api/api-client'
import { translateServerError } from '../api/error-translator'

export const AuthCallback = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')

      if (!code) {
        setError(t('errors.callback_code_missing'))
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
          throw new Error(t('errors.callback_token_missing'))
        }
      } catch (err: unknown) {
        console.error("Google auth callback error:", err)
        if (err instanceof Error) {
          setError(translateServerError(err.message, t))
        } else {
          setError(t('errors.google_failed'))
        }
      }
    }

    handleCallback()
  }, [navigate, t])

  return (
    <div style={{ color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#131313', fontFamily: 'SUSE, sans-serif' }}>
      {error ? (
        <div style={{ color: '#ef4444', marginBottom: '20px', fontSize: '18px' }}>{error}</div>
      ) : (
        <div style={{ fontSize: '18px' }}>{t('auth.callback_loading')}</div>
      )}
    </div>
  )
}
