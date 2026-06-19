import { getAccessToken, storeAccessToken, clearAccessToken } from './token-store'

export const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:5274'

/**
 * Повертає існуючий DeviceId з localStorage або генерує та зберігає новий.
 * Спільний для всіх сторінок авторизації для уникнення дублювання.
 */
export const getOrCreateDeviceId = (): string => {
  let deviceId = localStorage.getItem('DeviceId')
  if (!deviceId) {
    deviceId = crypto.randomUUID()
    localStorage.setItem('DeviceId', deviceId)
  }
  return deviceId
}

/**
 * Безпечно декодує корисне навантаження JWT та витягує email користувача.
 * НЕ перевіряє підпис — суто для покращення UX (збереження email для оновлення).
 */
export const decodeTokenEmail = (token: string): string | null => {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(window.atob(base64))
    return (
      payload.email ||
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
      null
    )
  } catch {
    return null
  }
}

export const setAccessToken = (token: string | null) => {
  if (token === null) {
    clearAccessToken()
  } else {
    storeAccessToken(token)
  }
}

export { getAccessToken }

let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token))
  refreshSubscribers = []
}

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback)
}

export const clearAuth = () => {
  setAccessToken(null)
  localStorage.removeItem('UserEmail')
  
  const publicPaths = ['/login', '/reg', '/forgotpassword', '/emailcod', '/passwordrecovery']
  if (!publicPaths.includes(window.location.pathname)) {
    window.location.href = '/login'
  }
}

export const refreshSession = async (): Promise<string | null> => {
  const email = localStorage.getItem('UserEmail')
  const deviceId = localStorage.getItem('DeviceId')

  if (!email) {
    clearAuth()
    return null
  }

  try {
    const response = await fetch(`${GATEWAY_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ email, deviceId })
    })

    if (!response.ok) {
      throw new Error('Session expired')
    }

    const data = await response.json()
    setAccessToken(data.token)
    return data.token
  } catch {
    clearAuth()
    return null
  }
}

export const apiFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getAccessToken()
  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  }

  let response = await fetch(url, options)

  if (response.status === 401) {
    if (isRefreshing) {
      return new Promise((resolve) => {
        addRefreshSubscriber((token) => {
          options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
          }
          resolve(fetch(url, options))
        })
      })
    }

    isRefreshing = true
    let newToken: string | null = null
    try {
      newToken = await refreshSession()
    } finally {
      isRefreshing = false
    }

    if (newToken) {
      onRefreshed(newToken)
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${newToken}`
      }
      response = await fetch(url, options)
    }
  }

  return response
}
