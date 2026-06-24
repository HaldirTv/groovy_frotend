import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

const profileTabs = [
  'Мій акаунт',
  'Налаштування',
  'Обране',
  'Завантаження',
  'Історія',
  'Мої плейлисти',
  'Змінити акаунт',
  'Преміум-підписка',
  'Вийти',
]

const accountSideNav = [
  'Огляд акаунта',
  'Особиста інформація',
  'Підключені акаунти',
  'Підписка',
  'Конфіденційність',
]

const recentlyPlayed = [
  { id: 1, cover: Cover }
]

const User = {
  name: "testname",
  handle: "@test_username",
  bio: "Musik is the soundtrack of my life.",
  avatar: ProfileAvatar,
  banner: ProfileBanner,
  playlists: 35,
  following: 59,
  followers: 355,
  email: "test@gmail.com",
  country: "Україна",
  memberSince: "Квітень 2023",
  firstName: "",
  lastName: "",
  city: "",
}

type User = {
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
  firstName: string;
  lastName: string;
  city: string;
}

type ProfileProps = {
  user?: User
}

export const Profile = ({ user:initialUser = User }: ProfileProps) => {
  const navigate = useNavigate()
  const { setActiveTab } = usePlayer()
  
  const [activeAccountSection, setActiveAccountSection] = useState('Огляд акаунта')
  const [activeProfileTab, setActiveProfileTab] = useState('Мій акаунт')

  const [user, setUser] = useState(initialUser)
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
    return user.name
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
        const months = [
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

  const handleTabClick = (tab: string) => {
    if (tab === 'Вийти') {
      logoutUser()
    } else if (tab === 'Обране') {
      setActiveTab('Liked')
      navigate('/main')
    } else if (tab === 'Завантаження') {
      setActiveTab('Downloads')
      navigate('/main')
    } else if (tab === 'Мої плейлисти') {
      setActiveTab('Playlist')
      navigate('/main')
    } else if (tab === 'Налаштування') {
      setActiveTab('Settings')
      navigate('/main')
    } else if (tab === 'Мій акаунт') {
      setActiveProfileTab(tab)
    }
  }

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
          <span className="ProfEditButtonText">Редагувати профіль</span>
        </button>

        <div className="ProfStats">
          <div className="ProfStatItem">
            <span className="ProfStatNumber">{user.playlists}</span>
            <span className="ProfStatLabel">Плейлисти</span>
          </div>
          <div className="ProfStatItem">
            <span className="ProfStatNumber">{user.following}</span>
            <span className="ProfStatLabel">Підписки</span>
          </div>
          <div className="ProfStatItem">
            <span className="ProfStatNumber">{user.followers}</span>
            <span className="ProfStatLabel">Підписники</span>
          </div>
        </div>
      </div>

      <div className="ProfTabs">
        {profileTabs.map((tab) => (
          <span 
            key={tab} 
            className={`ProfTabItem ${activeProfileTab === tab ? 'ProfTabActive' : ''}`}
            onClick={() => handleTabClick(tab)}
            style={{ cursor: 'pointer' }}
          >
            {tab}
          </span>
        ))}
      </div>

      <div className="ProfBody">
        <div className="ProfSideNav">
          {accountSideNav.map((item) => (
            <div 
              key={item} 
              className={`ProfSideNavItem ${activeAccountSection === item ? 'ProfSideNavActive' : ''}`} 
              onClick={() => setActiveAccountSection(item)} 
            >
              {item}
            </div>
          ))}
        </div>

        <div className="ProfPanel">
          <span className="ProfPanelTitle">{activeAccountSection}</span>
          
          {activeAccountSection === 'Огляд акаунта' && (
            <>
              <p className="ProfPanelSubtitle">Керуйте своїм профілем та налаштуваннями акаунта</p>
              
              <div className="ProfInfoRow">
                <span className="ProfInfoLabel">Ім'я користувача</span>
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
                    <button onClick={handleNameChange} className="ProfInfoChange" style={{ background: '#72DEEF', color: '#16161F' }} type="button">Зберегти</button>
                    <button onClick={() => setIsEditingName(false)} className="ProfInfoChange" style={{ borderColor: '#ef4444', color: '#ef4444' }} type="button">Скасувати</button>
                  </div>
                ) : (
                  <>
                    <span className="ProfInfoValue">{finalName}</span>
                    <button className="ProfInfoChange" onClick={() => { setTempName(finalName); setIsEditingName(true) }} type="button">Змінити</button>
                  </>
                )}
              </div>
              <div className="ProfInfoRow">
                <span className="ProfInfoLabel">Електронна пошта</span>
                <span className="ProfInfoValue">{email}</span>
              </div>
              <div className="ProfInfoRow">
                <span className="ProfInfoLabel">Країна</span>
                <span className="ProfInfoValue">{user.country}</span>
              </div>
              <div className="ProfInfoRow">
                <span className="ProfInfoLabel">Учасник з</span>
                <span className="ProfInfoValue">{memberSince}</span>
              </div>
            </>
          )}

          {activeAccountSection === 'Особиста інформація' && (
            <>
              <p className="ProfPanelSubtitle">Ваші контактні дані та особисті налаштування</p>
              <div className="ProfInfoRow">
                <span className="ProfInfoLabel">Електронна пошта</span>
                <span className="ProfInfoValue">{email}</span>
              </div>
              <div className="ProfInfoRow">
                <span className="ProfInfoLabel">Країна</span>
                <span className="ProfInfoValue">{user.country}</span>
              </div>
              <div className="ProfInfoRow">
                <span className="ProfInfoLabel">Дата реєстрації</span>
                <span className="ProfInfoValue">{memberSince}</span>
              </div>
            </>
          )}

          {activeAccountSection === 'Підключені акаунти' && (
            <>
              <p className="ProfPanelSubtitle">Керуйте підключеними сторонніми сервісами</p>
              <div className="ProfInfoRow">
                <span className="ProfInfoLabel">Google</span>
                <span className="ProfInfoValue" style={{ color: '#10b981' }}>Підключено</span>
              </div>
              <div className="ProfInfoRow">
                <span className="ProfInfoLabel">Telegram</span>
                <span className="ProfInfoValue" style={{ color: '#a1a1aa' }}>Не підключено</span>
              </div>
            </>
          )}

          {activeAccountSection === 'Підписка' && (
            <>
              <p className="ProfPanelSubtitle">Інформація про ваш поточний тарифний план</p>
              <div className="ProfInfoRow">
                <span className="ProfInfoLabel">Поточний тариф</span>
                <span className="ProfInfoValue">Безкоштовна версія (Listener)</span>
              </div>
              <button className="ProfManageSub" onClick={() => alert('Преміум-підписка тимчасово недоступна')} type="button">
                <span className="ProfManageSubText">Керувати підпискою</span>
              </button>
            </>
          )}

          {activeAccountSection === 'Конфіденційність' && (
            <>
              <p className="ProfPanelSubtitle">Налаштування приватності вашого профілю</p>
              <div className="ProfInfoRow">
                <span className="ProfInfoLabel">Видимість профілю</span>
                <span className="ProfInfoValue">Публічний (усі користувачі бачать ваші плейлити)</span>
              </div>
              <div className="ProfInfoRow">
                <span className="ProfInfoLabel">Файли cookie</span>
                <span className="ProfInfoValue">Дозволено для покращення роботи сервісу</span>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="ProfRecent">
        <span className="ProfRecentTitle">Нещодавно прослухане</span>
        <div className="ProfRecentGrid">
          {recentlyPlayed.map((item) => (
            <div className="ProfRecentCard" key={item.id}>
              <img src={item.cover} className="ProfRecentCardImg" />
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