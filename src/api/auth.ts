import { GATEWAY_URL, clearAuth } from './api-client'

export interface RegisterData {
  username: string
  email: string
  password: string
  role?: string
}

export const register = async (data: RegisterData) => {
  const res = await fetch(`${GATEWAY_URL}/auth/register`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    credentials: 'include' 
  })

  const result = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(result?.Message || result?.title || `Помилка з'єднання: ${res.status}`)
  }

  return result
}

export interface ConfirmData {
  email: string
  code: string
}

export const confirmRegister = async (data: ConfirmData) => {
  const res = await fetch(`${GATEWAY_URL}/auth/confirmregister`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    credentials: 'include'
  })

  const result = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(result?.Message || result?.title || `Помилка з'єднання: ${res.status}`)
  }

  return result
}

export interface LogoutPayload {
  email: string
  deviceId?: string
}

export const logoutApi = async ({ email, deviceId }: LogoutPayload): Promise<void> => {
  try {
    await fetch(`${GATEWAY_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', 
      body: JSON.stringify({
        email,
        deviceId: deviceId || 'default_web_client'
      }),
    })
  } catch (error) {
    console.error("Ошибка при логауте на сервере:", error)
  }
}

export interface GoogleAuthData {
  code: string
  deviceId: string
}

export const loginWithGoogleApi = async (data: GoogleAuthData) => {
  const res = await fetch(`${GATEWAY_URL}/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    credentials: 'include'
  })

  const result = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(result?.message || result?.Message || result?.title || `Помилка з'єднання: ${res.status}`)
  }

  return result
}

export const logoutUser = async () => {
  const email = localStorage.getItem('UserEmail') || ''
  const deviceId = localStorage.getItem('DeviceId') || 'default_web_client'
  
  try {
    await logoutApi({ email, deviceId })
  } catch (error) {
    console.error("Помилка логауту:", error)
  }
  
  
  localStorage.removeItem('UserEmail')
  localStorage.removeItem('RegistrationEmail')
  localStorage.removeItem('profileName')
  
  clearAuth()
}
