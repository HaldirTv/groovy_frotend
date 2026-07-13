import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { usePlayer } from '../context/player-context'
import { logoutUser } from '../api/auth'
import { getAccessToken } from '../api/api-client'
import Cover from '../assets/Cover.svg'
import ProfileAvatar from '../assets/avatartest.jpg'
import ProfileBanner from '../assets/bannertest.jpg'
import '../app.css'
import './profile.css'
import { EditProfile } from './editprofile'
import type { ProfileData } from './editprofile'

const PROFILE_TABS = [
  'account',
  'settings',
  'favorites',
  'downloads',
  'history',
  'playlists',
  'change_account',
  'premium',
  'logout'
]

const ACCOUNT_SIDE_NAV = [
  'overview',
  'info',
  'connected',
  'subscription',
  'privacy'
]

const recentlyPlayed = [
  { id: 1, cover: Cover }
]

interface UserType {
  name: string
  handle: string
  bio: string
  avatar: string
  banner: string
  playlists: number
  following: number
  followers: number
  email: string
  country: string
  memberSince: string
  firstName: string
  lastName: string
  city: string
}

export const Profile = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { setActiveTab } = usePlayer()

  const defaultUser: UserType = {
    name: "testname",
    handle: "@test_username",
    bio: "Music is the soundtrack of my life.",
    avatar: ProfileAvatar,
    banner: ProfileBanner,
    playlists: 35,
    following: 59,
    followers: 355,
    email: "test@gmail.com",
    country: i18n.language === 'en' ? 'Ukraine' : 'Україна',
    memberSince: i18n.language === 'en' ? 'April 2023' : 'Квітень 2023',
    firstName: "",
    lastName: "",
    city: "",
  }

  const [activeAccountSection, setActiveAccountSection] = useState('overview')
  const [activeProfileTab, setActiveProfileTab] = useState('account')

  const [user, setUser] = useState(defaultUser)
  const [EditProfileOpen, setEditProfileOpen] = useState(false)
  
  const [profileName, setProfileName] = useState(() => {
    const stored = localStorage.getItem('profileName')
    if (stored) return stored
    
    const token = getAccessToken()
    if (token) {
      try {
        const base64Url = token.split('.')[1]
        if (base64Url) {
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
          const payload = JSON.parse(window.atob(base64))
          const name = payload.unique_name || payload.name || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
          if (name) {
            localStorage.setItem('profileName', name)
            return name
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
    return defaultUser.name
  })

  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState('')

  const decodeToken = (t: string) => {
    try {
      const base64Url = t.split('.')[1]
      if (!base64Url) return null
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      return JSON.parse(window.atob(base64))
    } catch {
      return null
    }
  }

  const token = getAccessToken()
  const payload = token ? decodeToken(token) : null

  const email = payload?.email || payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || localStorage.getItem('UserEmail') || user.email
  const finalName = profileName || user.name
  const handle = payload?.unique_name ? `@${payload.unique_name}` : `@${finalName.toLowerCase().replace(/\s+/g, '_')}`

  const getMemberSince = () => {
    if (payload?.nbf) {
      try {
        const date = new Date(payload.nbf * 1000)
        const months = i18n.language === 'en' ? [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ] : [
          'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
          'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
        ]
        return `${months[date.getMonth()]} ${date.getFullYear()}`
      } catch {
        return user.memberSince
      }
    }
    return user.memberSince
  }
  const memberSince = getMemberSince()

  const handleNameChange = () => {
    const trimmed = tempName.trim()
    if (trimmed) {
      setProfileName(trimmed)
      localStorage.setItem('profileName', trimmed)
    }
    setIsEditingName(false)
  }

  const handleSaveProfile = (data: ProfileData) => {
    const trimmedName = data.displayName.trim()
    if (trimmedName) {
      setProfileName(trimmedName)
      localStorage.setItem('profileName', trimmedName)
    }

    setUser((prev) => ({
      ...prev,
      firstName: data.firstName,
      lastName: data.lastName,
      city: data.city,
      country: data.country,
      bio: data.bio,
      avatar: data.avatarPreviewUrl,
    }))
    setEditProfileOpen(false)
  }

  const handleTabClick = (tabKey: string) => {
    if (tabKey === 'logout') {
      logoutUser()
    } else if (tabKey === 'favorites') {
      setActiveTab('Liked')
      navigate('/main')
    } else if (tabKey === 'downloads') {
      setActiveTab('Downloads')
      navigate('/main')
    } else if (tabKey === 'playlists') {
      setActiveTab('Playlist')
      navigate('/main')
    } else if (tabKey === 'settings') {
      setActiveTab('Settings')
      navigate('/main')
    } else if (tabKey === 'account') {
      setActiveProfileTab(tabKey)
    }
  }

  const playlistLabel = t('playlists_count', { count: user.playlists }).replace(/^\d+\s*/, '')
  const followingLabel = t('following_count', { count: user.following }).replace(/^\d+\s*/, '')
  const followersLabel = t('followers_count', { count: user.followers }).replace(/^\d+\s*/, '')

  return (
    <div className="ProfMain2">
      <div className="ProfileUser">
        <img src={user.banner} className="ProfileUserBg" alt="User Banner" />
        <div className="ProfileUserOverlay"></div>

        <div className="ProfAvatarWrap">
          <img src={user.avatar} className="ProfAvatarImg" alt="User Avatar" />
        </div>

        <div className="ProfNameBlock">
          <span className="ProfName">{finalName}</span>
          <span className="ProfHandle">{handle}</span>
          <span className="ProfBio">{user.bio}</span>
        </div>

        <button className="ProfEditButton" onClick={() => {setEditProfileOpen(true)}}>
          <span className="ProfEditButtonText">{t('profile.edit_btn')}</span>
        </button>

        <div className="ProfStats">
          <div className="ProfStatItem">
            <span className="ProfStatNumber">{user.playlists}</span>
            <span className="ProfStatLabel" style={{ textTransform: 'capitalize' }}>{playlistLabel}</span>
          </div>
          <div className="ProfStatItem">
            <span className="ProfStatNumber">{user.following}</span>
            <span className="ProfStatLabel" style={{ textTransform: 'capitalize' }}>{followingLabel}</span>
          </div>
          <div className="ProfStatItem">
            <span className="ProfStatNumber">{user.followers}</span>
            <span className="ProfStatLabel" style={{ textTransform: 'capitalize' }}>{followersLabel}</span>
          </div>
        </div>
      </div>

      <div className="ProfTabs">
        {PROFILE_TABS.map((tabKey) => (
          <span 
            key={tabKey} 
            className={`ProfTabItem ${activeProfileTab === tabKey ? 'ProfTabActive' : ''}`}
            onClick={() => handleTabClick(tabKey)}
            style={{ cursor: 'pointer' }}
          >
            {t(`profile.tabs.${tabKey}`)}
          </span>
        ))}
      </div>

      <div className="ProfBody">
        <div className="ProfSideNav">
          {ACCOUNT_SIDE_NAV.map((itemKey) => (
            <div 
              key={itemKey} 
              className={`ProfSideNavItem ${activeAccountSection === itemKey ? 'ProfSideNavActive' : ''}`} 
              onClick={() => setActiveAccountSection(itemKey)} 
            >
              {t(`profile.side.${itemKey}`)}
            </div>
          ))}
        </div>

        <div className="ProfPanel">
          <span className="ProfPanelTitle">{t(`profile.side.${activeAccountSection}`)}</span>
          
          {activeAccountSection === 'overview' && (
            <>
              <p className="ProfPanelSubtitle">{t('profile.overview_desc')}</p>
              
              <div className="ProfInfoRow">
                <span className="ProfInfoLabel">{t('profile.username')}</span>
                {isEditingName ? (
                  <div style={{ display: 'flex', gap: '8px', flex: 1, alignItems: 'center' }}>
                    <input
                      type="text"
                      style={{
                        background: '#13131D',
                        border: '1px solid #72DEEF',
                        borderRadius: '8px',
                        color: '#F5F5F5',
                        padding: '4px 12px',
                        fontFamily: 'Manrope, sans-serif',
                        fontSize: '16px',
                        outline: 'none',
                        width: '200px'
                      }}
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleNameChange()
                        if (e.key === 'Escape') setIsEditingName(false)
                      }}
                      autoFocus
                    />
                    <button onClick={handleNameChange} className="ProfInfoChange" style={{ background: '#72DEEF', color: '#16161F' }} type="button">{t('profile.save_btn')}</button>
                    <button onClick={() => setIsEditingName(false)} className="ProfInfoChange" style={{ borderColor: '#ef4444', color: '#ef4444' }} type="button">{t('profile.cancel_btn')}</button>
                  </div>
                ) : (
                  <>
                    <span className="ProfInfoValue">{finalName}</span>
                    <button className="ProfInfoChange" onClick={() => { setTempName(finalName); setIsEditingName(true) }} type="button">{t('profile.change_btn')}</button>
                  </>
                )}
              </div>
              <div className="ProfInfoRow">
                <span className="ProfInfoLabel">{t('profile.email')}</span>
                <span className="ProfInfoValue">{email}</span>
              </div>
              <div className="ProfInfoRow">
                <span className="ProfInfoLabel">{t('profile.country')}</span>
                <span className="ProfInfoValue">{user.country}</span>
              </div>
              <div className="ProfInfoRow">
                <span className="ProfInfoLabel">{t('profile.joined')}</span>
                <span className="ProfInfoValue">{memberSince}</span>
              </div>
            </>
          )}

          {activeAccountSection === 'info' && (
            <>
              <p className="ProfPanelSubtitle">{t('profile.info_desc')}</p>
              <div className="ProfInfoRow">
                <span className="ProfInfoLabel">{t('profile.email')}</span>
                <span className="ProfInfoValue">{email}</span>
              </div>
              <div className="ProfInfoRow">
                <span className="ProfInfoLabel">{t('profile.country')}</span>
                <span className="ProfInfoValue">{user.country}</span>
              </div>
              <div className="ProfInfoRow">
                <span className="ProfInfoLabel">{t('profile.joined_date')}</span>
                <span className="ProfInfoValue">{memberSince}</span>
              </div>
            </>
          )}

          {activeAccountSection === 'connected' && (
            <>
              <p className="ProfPanelSubtitle">{t('profile.connected_desc')}</p>
              <div className="ProfInfoRow">
                <span className="ProfInfoLabel">Google</span>
                <span className="ProfInfoValue" style={{ color: '#10b981' }}>{t('profile.status_connected')}</span>
              </div>
              <div className="ProfInfoRow">
                <span className="ProfInfoLabel">Telegram</span>
                <span className="ProfInfoValue" style={{ color: '#a1a1aa' }}>{t('profile.status_not_connected')}</span>
              </div>
            </>
          )}

          {activeAccountSection === 'subscription' && (
            <>
              <p className="ProfPanelSubtitle">{t('profile.sub_desc')}</p>
              <div className="ProfInfoRow">
                <span className="ProfInfoLabel">{t('profile.current_plan')}</span>
                <span className="ProfInfoValue">{t('profile.free_version')}</span>
              </div>
              <button className="ProfManageSub" onClick={() => alert(t('profile.premium_unavailable'))} type="button">
                <span className="ProfManageSubText">{t('profile.manage_sub')}</span>
              </button>
            </>
          )}

          {activeAccountSection === 'privacy' && (
            <>
              <p className="ProfPanelSubtitle">{t('profile.privacy_desc')}</p>
              <div className="ProfInfoRow">
                <span className="ProfInfoLabel">{t('profile.visibility')}</span>
                <span className="ProfInfoValue">{t('profile.visibility_public')}</span>
              </div>
              <div className="ProfInfoRow">
                <span className="ProfInfoLabel">{t('profile.cookies_title')}</span>
                <span className="ProfInfoValue">{t('profile.cookies_allowed')}</span>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="ProfRecent">
        <span className="ProfRecentTitle">{t('profile.recent_played')}</span>
        <div className="ProfRecentGrid">
          {recentlyPlayed.map((item) => (
            <div className="ProfRecentCard" key={item.id}>
              <img src={item.cover} className="ProfRecentCardImg" alt="" />
            </div>
          ))}
        </div>
      </div>
      {EditProfileOpen && (
        <EditProfile
          user={{
            avatar: user.avatar,
            name: finalName,
            firstName: user.firstName,
            lastName: user.lastName,
            city: user.city,
            country: user.country,
            bio: user.bio,
          }}
          onClose={() => setEditProfileOpen(false)}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  )
}