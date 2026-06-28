import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlayer } from '../context/player-context'
import { logoutUser } from '../api/auth'
import { getAccessToken } from '../api/api-client'
import { updateProfile, uploadAvatar, uploadBanner, deleteBanner as deleteBannerApi, resolveMediaUrl } from '../api/profile'
import Cover from '../assets/Cover.svg'
import ProfileAvatar from '../assets/avatartest.jpg'
import ProfileBanner from '../assets/bannertest.jpg'
import '../app.css'
import './profile.css'
import { EditProfile } from './editprofile'
import type { ProfileData } from './editprofile'
import { useProfile } from '../context/profile context'

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
  playlists: 0,
  following: 0,
  followers: 0,
  email: "test@gmail.com",
  country: "Україна",
  memberSince: "Квітень 2023",
  firstName: "",
  lastName: "",
  city: "",
  phone: "",
  birthday: "",
  gender: "",
  username: "",
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
  phone: string;
  birthday: string;
  gender: string;
  username: string;
}

type ProfileProps = {
  user?: User
}

type EditableField = 'username' | 'phone' | 'country' |'city' | 'birthday' | 'gender'

export const Profile = ({ user:initialUser = User }: ProfileProps) => {
  const navigate = useNavigate()
  const { setActiveTab } = usePlayer()

  const {
    profileName, setProfileName,
    avatarUrl, setAvatarUrl,
    bannerUrl, setBannerUrl,
    profileData, setProfileData,
  } = useProfile()

  const [activeAccountSection, setActiveAccountSection] = useState('Огляд акаунта')
  const [activeProfileTab, setActiveProfileTab] = useState('Мій акаунт')

  const [user, setUser] = useState({
    ...initialUser,
    firstName: profileData.firstName || initialUser.firstName,
    lastName: profileData.lastName || initialUser.lastName,
    city: profileData.city || initialUser.city,
    country: profileData.country || initialUser.country,
    bio: profileData.bio || initialUser.bio,
    phone: profileData.phone || initialUser.phone,
    birthday: profileData.birthday || initialUser.birthday,
    gender: profileData.gender || initialUser.gender,
  })

  useEffect(() => {
    setUser((prev) => ({
      ...prev,
      firstName: profileData.firstName || prev.firstName,
      lastName: profileData.lastName || prev.lastName,
      city: profileData.city || prev.city,
      country: profileData.country || prev.country,
      bio: profileData.bio || prev.bio,
      phone: profileData.phone || prev.phone,
      birthday: profileData.birthday || prev.birthday,
      gender: profileData.gender || prev.gender,
    }))
  }, [profileData])

  const [EditProfileOpen, setEditProfileOpen] = useState(false)
  
  const [BannerMenuOpen, setBannerMenuOpen] = useState(false)
  const bannerMenuRef = useRef<HTMLDivElement>(null)
  const bannerFileInputRef = useRef<HTMLInputElement>(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [connectedAccounts, setConnectedAccounts] = useState({
    google: false,
    appleIdd: false,
    facebook: false,
    discord: false,
  })

  const [editingField, setEditingField] = useState<EditableField | null> (null)
  const [tempFieldValue, setTempFieldValue] = useState('')

  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    if (!BannerMenuOpen) return
    const handleOutsideClick = (e: MouseEvent) => {
      if (bannerMenuRef.current && !bannerMenuRef.current.contains(e.target as Node)) {
        setBannerMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [BannerMenuOpen])

  const handleBannerFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    setUser((prev) => ({ ...prev, banner: previewUrl }))
    setBannerMenuOpen(false)

    try {
      const { bannerUrl: newBannerUrl } = await uploadBanner(file)
      setBannerUrl(resolveMediaUrl(newBannerUrl) || newBannerUrl)
    } catch (err) {
      console.error('Не вдалося завантажити банер:', err)
      setSaveError(err instanceof Error ? err.message : 'Не вдалося завантажити банер')
    }
  }

  const handleRemoveBanner = async () => {
    setUser((prev) => ({...prev, banner: ''}))
    setBannerUrl('')
    setBannerMenuOpen(false)

    try {
      await deleteBannerApi()
    } catch (err) {
      console.error('Не вдалося видалити банер на сервері:', err)
    }
  }

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

  const personalUsername = user.username || handle
  const currentAvatar = avatarUrl || user.avatar

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

  const handleNameChange = async () => {
    const trimmed = tempName.trim()
    if (trimmed) {
      setProfileName(trimmed)
      try {
        await updateProfile({ displayName: trimmed })
      } catch (err) {
        console.error('Не вдалося зберегти ім\'я на сервері:', err)
        setSaveError(err instanceof Error ? err.message : 'Не вдалося зберегти ім\'я')
      }
    }
    setIsEditingName(false)
  }

  const handleFieldEditStart = (field: EditableField, currentValue: string) => {
    setTempFieldValue(currentValue)
    setEditingField(field)
  }

  const fieldToPayloadKey: Record<EditableField, string> = {
    username: 'displayName', 
    phone: 'phone',
    country: 'country',
    city: 'city',
    birthday: 'birthday',
    gender: 'gender',
  }

  const handleFieldSave = async () => {
    if (!editingField) return
    const trimmed = tempFieldValue.trim()
    setUser((prev) => ({...prev, [editingField]: trimmed}))

    if (editingField !== 'username') {
      try {
        await updateProfile({ [fieldToPayloadKey[editingField]]: trimmed })
      } catch (err) {
        console.error('Не вдалося зберегти поле на сервері:', err)
        setSaveError(err instanceof Error ? err.message : 'Не вдалося зберегти зміни')
      }
    }

    setEditingField(null)
  }

  const handleFieldCancel = () => {
    setEditingField(null)
  }

  const handleSaveProfile = async (data: ProfileData) => {
    setSaveError('')

    const trimmedName = data.displayName.trim()
    if (trimmedName) {
      setProfileName(trimmedName)
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

    try {
      await updateProfile({
        displayName: trimmedName,
        firstName: data.firstName,
        lastName: data.lastName,
        city: data.city,
        country: data.country,
        bio: data.bio,
        linkUrl: data.linkUrl,
        linkLabel: data.linkLabel,
        supportLink: data.supportLink,
      })

      if (data.avatarFile) {
        const { avatarUrl: newAvatarUrl } = await uploadAvatar(data.avatarFile)
        setAvatarUrl(resolveMediaUrl(newAvatarUrl) || newAvatarUrl)
      } else {
        setAvatarUrl(data.avatarPreviewUrl)
      }

      setEditProfileOpen(false)
    } catch (err) {
      console.error('Не вдалося зберегти профіль на сервері:', err)
      setSaveError(err instanceof Error ? err.message : 'Не вдалося зберегти профіль')
    }
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

  const toggleConnectedAccount = (account: keyof typeof connectedAccounts) => {
    setConnectedAccounts((prev) => ({ ...prev, [account]: !prev[account] }))
  }

  const renderEditableRow = (label: string, field: EditableField, value:string) => (
    <div className='ProfInfoRow'>
      <span className='ProfInfoLabel'>{label}</span>
      {editingField === field ? (
        <div style={{display: 'flex', gap: '8px', flex: 1, alignItems: 'center'}}>
          <input type="text" className='BtnInput' value={tempFieldValue} onChange={(e) => setTempFieldValue(e.target.value)} onKeyDown={(e) => { 
            if (e.key === 'Enter') handleFieldSave()
            if (e.key === 'Escape') handleFieldCancel()
          }} autoFocus />
          <button onClick={handleFieldSave} className='ProfInfoChange' style={{background: '#72DEEF', color: '#16161F'}}>
            Зберегти
          </button>
          <button onClick={handleFieldCancel} className='ProfInfoChange' style={{borderColor: '#EF4444', color: '#EF4444'}}>
            Скасувати
          </button>
        </div>
  ) : (
    <>
    <span className='ProfInfoValue'>{value || '-'}</span>
    <button className='ProfInfoChange' onClick={() => handleFieldEditStart(field, value)}>
      Змінити
    </button>
    </>
  )}
    </div>
  )

  return (
    <div className="ProfMain2">
      {saveError && (
        <div className="auth-error" role="alert" style={{ width: '100%' }}>
          {saveError}
        </div>
      )}
      <div className="ProfileUser">
        <img src={bannerUrl || user.banner} className="ProfileUserBg" />
        <div className="ProfileUserOverlay"></div>

        <div className='BannerEditWrap' ref={bannerMenuRef}>
          <button className='BannerEditButton' onClick={() => setBannerMenuOpen((prev) => !prev)}>
            <span className='BannerEditButtonText'>Редагувати банер</span>
          </button>
        

        {BannerMenuOpen && (
          <div className='BannerEditMenu'>
            <button className='BannerEditMenuItem BannerEditMenuItemActive' onClick={() => bannerFileInputRef.current?.click()}>
              Замінити фото
            </button>
            <button className='BannerEditMenuItem' onClick={handleRemoveBanner}>
              Видалити фото
            </button>
          </div>
        )}

        <input type="file" accept='image/*' ref={bannerFileInputRef} onChange={handleBannerFileChange} style={{display: 'none'}} />
        </div>
        
        <div className="ProfAvatarWrap">
          <img src={currentAvatar} className="ProfAvatarImg" />
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
          
          {activeAccountSection === 'Огляд акаунта' && (
            <>
              <span className="ProfPanelTitle">Огляд акаунта</span>
              <p className="ProfPanelSubtitle">Керуйте своїм профілем та налаштуваннями акаунта</p>
              
              <div className="ProfInfoRow">
                <span className="ProfInfoLabel">Ім'я користувача</span>
                {isEditingName ? (
                  <div style={{ display: 'flex', gap: '8px', flex: 1, alignItems: 'center' }}>
                    <input
                      type="text"
                      className='BtnInput'
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleNameChange()
                        if (e.key === 'Escape') setIsEditingName(false)
                      }}
                      autoFocus
                    />
                    <button onClick={handleNameChange} className="ProfInfoChange" style={{ background: '#72DEEF', color: '#16161F' }}>Зберегти</button>
                    <button onClick={() => setIsEditingName(false)} className="ProfInfoChange" style={{ borderColor: '#ef4444', color: '#ef4444' }}>Скасувати</button>
                  </div>
                ) : (
                  <>
                    <span className="ProfInfoValue">{finalName}</span>
                    <button className="ProfInfoChange" onClick={() => { setTempName(finalName); setIsEditingName(true) }}>Змінити</button>
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

              <button className="ProfManageSub" onClick={() => alert('Преміум-підписка тимчасово недоступна')}>
                <span className='ProfManageSubText'>Керувати підпискою</span>
              </button>
            </>
          )}

          {activeAccountSection === 'Особиста інформація' && (
            <>
              <span className="ProfPanelTitle">Особиста інформація</span>
              <p className="ProfPanelSubtitle">Оновіть свої особисті дані, зображення профілю, ім'я користувача, адресу електронної пошти та інформацію про країну.</p>
              <div className="ProfInfoRow">
                <span className="ProfInfoLabel">Повне Ім'я</span>
                {isEditingName ?  (
                  <div style={{display:'flex', gap:'8px', flex:1, alignItems:'center'}}>
                    <input type="text" className='BtnInput' value={tempName} onChange={(e) => setTempName(e.target.value)} onKeyDown={(e) => {
                      if (e.key === 'Enter') handleNameChange()
                      if (e.key === 'Escape') setIsEditingName(false) 
                    }} autoFocus/>
                    <button onClick={handleNameChange} className="ProfInfoChange" style={{ background: '#72DEEF', color: '#16161F' }}>
                      Зберегти
                    </button>
                    <button onClick={() => setIsEditingName(false)} className="ProfInfoChange" style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                      Скасувати
                    </button>
                  </div>
                ) : (
                  <>
                  <span className='ProfInfoValue'>{finalName}</span>
                  <button className='ProfInfoChange' onClick={() => {setTempName(finalName); setIsEditingName(true)}}>
                    Змінити
                  </button>
              </>
              )}
              </div>

              {renderEditableRow("Ім'я користувача", 'username', personalUsername)}
              {renderEditableRow("Номер телефону", 'phone', user.phone)}
              {renderEditableRow("Краіна", 'country', user.country)}

              {renderEditableRow('Місто', 'city', user.city)}
              {renderEditableRow('День народження', 'birthday', user.birthday)}
              {renderEditableRow('Стать', 'gender', user.gender)}

              <div className='ProfInfoRow'>
                <span className='ProfInfoLabel'>Дата реєстрації</span>
                <span className='ProfInfoValue'>{memberSince}</span>
              </div>
            </>
          )}

          {activeAccountSection === 'Підключені акаунти' && (
            <>
            <span className='ProfPanelTitle'>Підключені акаунти</span>
              <p className="ProfPanelSubtitle">Керуйте пов'язаними сервісами та обліковими записами соціальних мереж, підключеними до вашого профілю Groovra.</p>
              {(
                [
                  {key: 'google', label: 'Google'},
                  {key: 'appleId', label: 'Apple ID'},
                  {key: 'facebook', label: 'Facebook'},
                  {key: 'discord', label: 'Discord'},
                ] as {key: keyof typeof connectedAccounts; label: string } []
              ).map(({key, label}) => (
                <div className='ProfInfoRow' key={key}>
                  <span className='ProfInfoLabel'>{label}</span>
                  <span className='ProfInfoValue' />
                  <button className='ProfInfoChange' style={connectedAccounts[key] ? {borderColor: '#8BEF72', color: '#8BEF72'} : {borderColor: '#EF7274', color: '#EF7274'}} onClick={() => toggleConnectedAccount(key)}>
                    {connectedAccounts[key] ? 'Підключено' : 'Підключити'}
                  </button>
                </div>
              ))}
            </>
          )}

          {activeAccountSection === 'Підписка' && (
            <>
              <span className='ProfPanelTitle'>Підписка</span>
              <p className="ProfPanelSubtitle">Перегляньте свій поточний план підписки, платіжну інформацію та історію платежів.</p>
              <div className="ProfInfoRow">
                <span className="ProfInfoLabel">Поточний тариф</span>
                <span className="ProfInfoValue">Безкоштовна версія (Listener)</span>
                <button className='ProfInfoChange' onClick={() => alert('Зміна тарифу тимчасово недоступна')}>
                  Змінити
                </button>
              </div>
              <div className='ProfInfoRow'>
                <span className='ProfInfoLabel'>Спосіб оплати</span>
                <span className='ProfInfoValue'>Не вказано</span>
                <button className='ProfInfoChange' onClick={() => alert('Вибір способу оплати тимчасово недоступний')}>
                  Обрати
                </button>
              </div>
              <div className='ProfInfoRow'>
                <span className='ProfInfoLabel'>Історія платежів</span>
                <span className='ProfInfoValue'></span>
                <button className='ProfInfoChange' onClick={() => alert('Історія платежів тимчасово недоступна')}>
                  Переглянути
                </button>
              </div>
              <button className="ProfManageSub" onClick={() => alert('Преміум-підписка тимчасово недоступна')}>
                <span className="ProfManageSubText">Керувати підпискою</span>
              </button>
            </>
          )}

          {activeAccountSection === 'Конфіденційність' && (
          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', width: '100%' }}>
            <div style={{flex:1, minWidth: 0}}>
              <span className='ProfPanelTitle'>Конфіденційність та безпека</span>
              <p className='ProfPanelSubtitle'>Захистіть свій обліковий запис і контролюйте, як поширюється ваша інформація.</p>

              <div className='ProfInfoRow'>
                <span className='ProfInfoLabel'>Поточний пароль</span>
                <input type="text" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder='********' className='ProfPasswordInput' />
              </div>
              <div className='ProfInfoRow'>
                <span className='ProfInfoLabel'>Новий пароль</span>
                <input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder='********' className='ProfPasswordInput' />
              </div>
              <div className='ProfInfoRow'>
                <span className='ProfInfoLabel'>Підтвердьте пароль</span>
                <input type="text" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder='********' className='ProfPasswordInput' />
              </div>
              <div>
                <button className='ProfInfoChange' onClick={() => {if (newPassword && newPassword === confirmPassword) {
                  alert('Пароль змінено!')
                  setCurrentPassword('')
                  setNewPassword('')
                  setConfirmPassword('')
                } else {
                  alert('Паролі не збігаються або порожні')
                }}}>
                  Зберегти пароль
                </button>
              </div>
            </div>
            <div style={{width: '380px', flexShrink: 0, borderLeft: '1px solid #A1A1AA', paddingLeft: '32px'}}>
              <span className='ProfPanelTitle'>Двофакторна автентифікація</span>
              <p style={{fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: '20px', lineHeight: '27px', color: '#72DEEF', margin: '8px 0 16px'}}>
                Статус: Вимкнено
              </p>
              <p style={{fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: '16px', lineHeight: '22px', color: '#A1A1AA', margin: 0}}>
                Додайте додатковий рівень безпеки до свого облікового запису, увімкнувши двофакторну автентифікацію.
              </p>
              <button className='ProfInfoChange' onClick={() => alert('Налаштування 2FA тимчасово недоступне')}>
                Налаштувати 2FA
              </button>
            </div>
          </div>
          )}
        </div>
      </div>
      <div className="ProfRecent">
        <span className="ProfRecentTitle">Нещодавно прослухане</span>
        <div className="ProfRecentGrid">
          {recentlyPlayed.map((item) => (
            <div className="ProfRecentCard" key={item.id}>
            </div>
          ))}
        </div>
      </div>
      {EditProfileOpen && (
        <EditProfile
        user={{
          avatar: currentAvatar,
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