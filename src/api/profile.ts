import { apiFetch, GATEWAY_URL } from './api-client'

export interface ProfileResponse {
  displayName: string
  firstName: string
  lastName: string
  bio: string
  city: string
  country: string
  phone: string
  birthday: string
  gender: string
  avatarUrl: string
  bannerUrl: string
  linkUrl: string
  linkLabel: string
  supportLink: string
}

export interface UpdateProfilePayload {
  displayName?: string
  firstName?: string
  lastName?: string
  bio?: string
  city?: string
  country?: string
  phone?: string
  birthday?: string
  gender?: string
  linkUrl?: string
  linkLabel?: string
  supportLink?: string
}

export const resolveMediaUrl = (path?: string | null): string | undefined => {
  if (!path) return undefined
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${GATEWAY_URL}${path}`
}

export const getProfile = async (): Promise<ProfileResponse> => {
  const res = await apiFetch(`${GATEWAY_URL}/profile`, {
    method: 'GET',
  })

   if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.Message || data?.message || `Не вдалося завантажити профіль: ${res.status}`)
  }
 
  return res.json()
}

export const updateProfile = async (payload: UpdateProfilePayload): Promise<ProfileResponse> => {
  const res = await apiFetch(`${GATEWAY_URL}/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
 
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.Message || data?.message || `Не вдалося оновити профіль: ${res.status}`)
  }
 
  return res.json()
}

export const uploadAvatar = async (file: File): Promise<{ avatarUrl: string }> => {
  const formData = new FormData()
  formData.append('file', file)
 
  const res = await apiFetch(`${GATEWAY_URL}/profile/avatar`, {
    method: 'POST',
    body: formData,
  })
 
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.Message || data?.message || `Не вдалося завантажити аватар: ${res.status}`)
  }
 
  const data = await res.json()
  return { avatarUrl: data.AvatarUrl || data.avatarUrl }
}

export const uploadBanner = async (file: File): Promise<{ bannerUrl: string }> => {
  const formData = new FormData()
  formData.append('file', file)
 
  const res = await apiFetch(`${GATEWAY_URL}/profile/banner`, {
    method: 'POST',
    body: formData,
  })
 
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.Message || data?.message || `Не вдалося завантажити банер: ${res.status}`)
  }
 
  const data = await res.json()
  return { bannerUrl: data.BannerUrl || data.bannerUrl }
}

export const deleteAvatar = async (): Promise<void> => {
  const res = await apiFetch(`${GATEWAY_URL}/profile/avatar`, {
    method: 'DELETE',
  })
 
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.Message || data?.message || `Не вдалося видалити аватар: ${res.status}`)
  }
}
 
export const deleteBanner = async (): Promise<void> => {
  const res = await apiFetch(`${GATEWAY_URL}/profile/banner`, {
    method: 'DELETE',
  })
 
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.Message || data?.message || `Не вдалося видалити банер: ${res.status}`)
  }
}
 