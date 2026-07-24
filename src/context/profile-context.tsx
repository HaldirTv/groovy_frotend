import React, { createContext, useContext, useState, useEffect } from 'react'
import { getAccessToken, onAccessTokenChange } from '../api/api-client'
import { getProfile, resolveMediaUrl } from '../api/profile'

interface ProfileContextType {
    profileName: string
    avatarUrl: string | null
    bannerUrl: string | null
    isLoadingProfile: boolean
    setProfileName: (name: string) => void
    setAvatarUrl: (url: string) => void
    setBannerUrl: (url: string) => void
    profileData: {
        firstName: string
        lastName: string
        bio: string
        city: string
        country: string
        phone: string
        birthday: string
        gender: string
        linkUrl: string
        linkLabel: string
        supportLink: string
    }
    setProfileData: React.Dispatch<React.SetStateAction<ProfileContextType['profileData']>>
    refreshProfile: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

const decodeNameFromToken = (): string | null => {
    const token = getAccessToken()
    if (!token) return null
    try {
        const base64Url = token.split('.')[1]
        if (!base64Url) return null
        const base64 =  base64Url.replace(/-/g, '+').replace(/_/g, '/')
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
}

export const ProfileProvider: React.FC<{children: React.ReactNode}> = ({children}) =>
    {
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
        const [isLoadingProfile, setIsLoadingProfile] = useState(true)

        const setProfileName = (name: string) => {
            setProfileNameState(name)
            localStorage.setItem('profileName', name)
        }

        const setAvatarUrl = (url: string) => {
            setAvatarUrlState(url)
            try {
                localStorage.setItem('profileAvatarUrl', url)
            } catch {

            }
        }

        const setBannerUrl = (url: string) => {
            setBannerUrlState(url)
            try {
                localStorage.setItem('profileBannerUrl', url)
            } catch {

            }
        }
        
        const refreshProfile = async () => {
            const token = getAccessToken()
            if (!token) {
                setIsLoadingProfile(false)
                return
            }

            try {
                const data = await getProfile()

                if (data.displayName) {
                    setProfileName(data.displayName)
                }

                const resolvedAvatar = resolveMediaUrl(data.avatarUrl)
                if (resolvedAvatar) {
                    setAvatarUrl(resolvedAvatar)
                }

                const resolvedBanner = resolveMediaUrl(data.bannerUrl)
                if (resolvedBanner) {
                    setBannerUrl(resolvedBanner)
                }

                setProfileData({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    bio: data.bio || '',
                    city: data.city || '',
                    country: data.country || '',
                    phone: data.phone || '',
                    birthday: data.birthday || '',
                    gender: data.gender || '',
                    linkUrl: data.linkUrl || '',
                    linkLabel: data.linkLabel || '',
                    supportLink: data.supportLink || '',
                })
            } catch (err) {
                console.error('Не вдалося завантажити профіль з сервера:', err)
            } finally {
                setIsLoadingProfile(false)
            }
        }

        useEffect(() => {
            refreshProfile()
        }, [])

        // The mount-time refreshProfile() above runs before any login attempt (this
        // provider sits above <Router>, so it never remounts on navigation from
        // /login to /main). Without this, profileName stays stuck at its initial
        // fallback ("Profile") after logging in until a full page reload.
        useEffect(() => {
            const unsubscribe = onAccessTokenChange((token) => {
                if (token) refreshProfile()
            })
            return unsubscribe
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])

        return (
            <ProfileContext.Provider value={{
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
            }}>
                {children}
            </ProfileContext.Provider>
        )
    }

    export const useProfile = () => {
        const context = useContext(ProfileContext)
        if (!context) {
            throw new Error('useProfile must be used within a ProfileProvider')
        }
        return context
    }