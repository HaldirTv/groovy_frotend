import React, { useState, useEffect, useCallback } from 'react'
import { getAccessToken } from '../api/api-client'
import { resolveMediaUrl } from '../api/profile'
import { ProfileContext } from './profile-context'
import { useGetProfileQuery } from '../store/api/profileApi'

const decodeNameFromToken = (): string | null => {
  const token = getAccessToken()
  if (!token) return null
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(window.atob(base64))
    return payload.unique_name || payload.name || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || null
  } catch {
    return null
  }
}

const emptyProfileData = {
  firstName: '',
  lastName: '',
  bio: '',
  city: '',
  country: '',
  phone: '',
  birthday: '',
  gender: '',
  linkUrl: '',
  linkLabel: '',
  supportLink: '',
  createdAt: '',
}

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = getAccessToken()
  const { data: profileFromRtk, isLoading: isLoadingProfile, refetch } = useGetProfileQuery(undefined, {
    skip: !token,
  })

  const [profileName, setProfileNameState] = useState<string>(() => {
    const stored = localStorage.getItem('profileName')
    if (stored) return stored
    const fromToken = decodeNameFromToken()
    if (fromToken) {
      localStorage.setItem('profileName', fromToken)
      return fromToken
    }
    return 'Profile'
  })

  const [avatarUrl, setAvatarUrlState] = useState<string | null>(() => {
    return localStorage.getItem('profileAvatarUrl')
  })

  const [bannerUrl, setBannerUrlState] = useState<string | null>(() => {
    return localStorage.getItem('profileBannerUrl')
  })

  const [profileData, setProfileData] = useState(emptyProfileData)

  const setProfileName = (name: string) => {
    setProfileNameState(name)
    localStorage.setItem('profileName', name)
  }

  const setAvatarUrl = (url: string) => {
    setAvatarUrlState(url)
    try {
      localStorage.setItem('profileAvatarUrl', url)
    } catch {
      // ignore
    }
  }

  const setBannerUrl = (url: string) => {
    setBannerUrlState(url)
    try {
      localStorage.setItem('profileBannerUrl', url)
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    if (!profileFromRtk) return

    if (profileFromRtk.displayName) {
      setProfileName(profileFromRtk.displayName)
    }

    const resolvedAvatar = resolveMediaUrl(profileFromRtk.avatarUrl)
    setAvatarUrl(resolvedAvatar || '')

    const resolvedBanner = resolveMediaUrl(profileFromRtk.bannerUrl)
    setBannerUrl(resolvedBanner || '')

    if (profileFromRtk.settingsJson) {
      try {
        localStorage.setItem('userSettings', profileFromRtk.settingsJson)
      } catch {
        // ignore
      }
    }

    setProfileData({
      firstName: profileFromRtk.firstName ?? '',
      lastName: profileFromRtk.lastName ?? '',
      bio: profileFromRtk.bio ?? '',
      city: profileFromRtk.city ?? '',
      country: profileFromRtk.country ?? '',
      phone: profileFromRtk.phone ?? '',
      birthday: profileFromRtk.birthday ?? '',
      gender: profileFromRtk.gender ?? '',
      linkUrl: profileFromRtk.linkUrl ?? '',
      linkLabel: profileFromRtk.linkLabel ?? '',
      supportLink: profileFromRtk.supportLink ?? '',
      createdAt: profileFromRtk.createdAt ?? '',
    })
  }, [profileFromRtk])

  const refreshProfile = useCallback(async () => {
    if (token) {
      await refetch()
    }
  }, [token, refetch])

  return (
    <ProfileContext.Provider
      value={{
        profileName,
        avatarUrl,
        bannerUrl,
        isLoadingProfile,
        setProfileName,
        setAvatarUrl,
        setBannerUrl,
        profileData,
        setProfileData,
        refreshProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}