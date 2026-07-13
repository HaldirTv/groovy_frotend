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
  'Стати виконавцем',
  'Налаштування',
  'Обране',
  'Завантаження',
  'Історія',
  'Мої плейлисти',
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
  const { setActiveTab, tracks, likedTrackIds, selectTrack, currentTrack } = usePlayer()

  const {
    profileName, setProfileName,
    avatarUrl, setAvatarUrl,
    bannerUrl, setBannerUrl,
    profileData,
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

  const [settingOptions, setSettingsOptions] = useState({
    autoPlayNext: true,
    newReleases: false,
    recommendations: true,
    emailNotifications: false,
  })
  const [settingsLanguage, setSettingsLanguage] = useState<'uk' | 'en'>('uk')

  const [artistForm, setArtistForm] = useState({
    artistName: '',
    genre: '',
    country: '',
    platform: '',
  })

  const [atristAgreements, setArtistAgreements] = useState({
    ownsContent: false,
    acceptsTerms: false,
  }) 

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
    } else if (tab === 'Завантаження') {
      setActiveTab('Downloads')
      navigate('/main')
    } else if (tab === 'Мої плейлисти') {
      setActiveTab('Playlist')
      navigate('/main')
    } else if (
      tab === 'Мій акаунт' ||
      tab === 'Стати виконавцем' ||
      tab === 'Налаштування' ||
      tab === 'Обране' ||
      tab === 'Історія'
    ) {
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

      {activeProfileTab === 'Мій акаунт' && (
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
      )}

      {activeProfileTab === 'Стати виконавцем' && (
        <div className='ProfBody'>
          <div className='ProfPanel ArtistApplyPanel'>
            <div className='ArtistApplyFormCol'>
              <span className='ProfPanelTitle'>Стати виконавцем</span>
              <p className='ProfPanelSubtitle'>Приєднуйтесь до програми Groovra Creator Program та почніть ділитися своєю музикою зі слухачами по всьому світу.</p>
              
              <div className='ArtistApplyRow'>
                <span className='ProfInfoLabel'>Ім'я виконавця</span>
                <input type="text" className='BtnInput ArtistApplyInput' value={artistForm.artistName} onChange={(e) => setArtistForm((prev) => ({...prev, artistName: e.target.value}))} />
              </div>
              <div className='ArtistApplyRow'>
                <span className='ProfInfoLabel'>Музичний жанр</span>
                <input type="text" className='BtnInput ArtistApplyInput' value={artistForm.genre} onChange={(e) => setArtistForm((prev) => ({...prev, genre: e.target.value}))} />
              </div>
              <div className='ArtistApplyRow'>
                <span className='ProfInfoLabel'>Країна</span>
                <input type="text" className='BtnInput ArtistApplyInput' value={artistForm.country} onChange={(e) => setArtistForm((prev) => ({...prev, country: e.target.value}))} />
              </div>
              <div className='ArtistApplyRow'>
                <span className='ProfInfoLabel'>Головна платформа</span>
                <input type="text" className='BtnInput ArtistApplyInput' value={artistForm.platform} onChange={(e) => setArtistForm((prev) => ({...prev, platform: e.target.value}))} />
              </div>

              <div className='ArtistApplyAgreements'>
                <div className='ArtistApplyAgreementLabel'>
                  <span>Я підтверджую, що володію правами на контент, який завантажую</span>
                  <input type="checkbox" checked={atristAgreements.ownsContent} onChange={() => setArtistAgreements((prev) => ({...prev, ownsContent: !prev.ownsContent}))} className='ArtistApplyCheckbox' />
                </div>
                <div className='ArtistApplyAgreementLabel'>
                  <span>Я погоджуюся з Умовами використання Groovra Creator</span>
                  <input type="checkbox" checked={atristAgreements.acceptsTerms} onChange={() => setArtistAgreements((prev) => ({...prev, acceptsTerms: !prev.acceptsTerms}))} className='ArtistApplyCheckbox' />
                </div>
              </div>

              <div className='ArtistApplyButtonsRow'>
                <button className='ProfInfoChange' onClick={() => setActiveProfileTab('Мій акаунт')}>
                  Скасувати
                </button>
                <button className='ProfInfoChange ArtistApplySubmitBtn' onClick={() => alert('Заявку на статус автора буде розглянуто найближчим часом!')}>
                  Подати заявку на статус автора
                </button>
              </div>
            </div>

            <div className='ArtistApplyPerksCol'>
              <span className='ProfPanelTitle ArtistApplyPerksTitle'>Переваги для авторів</span>
              <div className='ArtistApplyPerksList'>
                {[
                  'Завантажуйте необмежену кількість треків',
                  'Аналітика для творців',
                  'Функції монетизації',
                  'Значок підтвердженого виконавця',
                  'Статистика аудиторії',
                  'Можливості просування плейлистів',
                ].map((perk) => (
                  <span key={perk} className='ArtistApplyPerkItem'>{perk}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeProfileTab === 'Налаштування' && (
        <div className='ProfBody'>
          <div className='ProfPanel SettingPanel'>
            <div className='SettingsFormCol'>
              <span className='ProfPanelTitle'>Налаштування </span>
              <p className='ProfPannelSubtitle'>Налаштовуйте сайт під себе</p>

              {[
                {key: 'autoPlayNext' as const, label: 'Автоматично запускати схожі треки після завершення плейлиста'},
                {key: 'newReleases' as const, label: 'Нові релізи виконавця'},
                {key: 'recommendations' as const, label: 'Рекомендації від Groovra'},
                {key: 'emailNotifications' as const, label: 'Email-сповіщення'},
              ].map((option) => (
                <div className='ProfInfoRow' key={option.key}>
                  <span className='ProfInfoLabel SettingsOptionLabel'>{option.label}</span>
                  <input type="checkbox" checked={settingOptions[option.key]} onChange={() => setSettingsOptions((prev) => ({...prev, [option.key]: !prev[option.key]}))} className='SettingsCheckbox' />
                </div>
              ))}
              <div className='ProfInfoRow'>
                <span className='ProfInfoLabel'>Мова</span>
                <div className='SettingsLanguageButtons'>
                  <button className="ProfInfoChange SettingsLangBtn" style={settingsLanguage === 'uk' ? { borderColor: '#80EF72', color: '#FFFFFF' } : { borderColor: '#EF7274', color: '#FFFFFF' }} onClick={() => setSettingsLanguage('uk')} >
                    Українська
                  </button>
                  <button className="ProfInfoChange SettingsLangBtn" style={settingsLanguage === 'en' ? { borderColor: '#80EF72', color: '#FFFFFF' } : { borderColor: '#EF7274', color: '#FFFFFF' }} onClick={() => setSettingsLanguage('en')} >
                    English
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeProfileTab === 'Обране' && (
        <div className='ProfRecent'>
          <span className='ProfRecentTitle'>
            Улюблене: {tracks.filter((t) => likedTrackIds.includes(t.trackId)).length} Треків
          </span>
          <div className='ProfRecentGrid'>
            {tracks.filter((t) => likedTrackIds.includes(t.trackId)).length === 0 ? (
              <p className='ProfRecentEmptyText'>У вас поки немає улюблених треків. Натисніть серце у плеєрі, щоб додати трек сюди!</p>
            ) : (
              tracks.filter((t) => likedTrackIds.includes(t.trackId)).map((track) => (
                <div className='ProfRecentCard ProfRecentCardClickable' key={track.trackId} onClick={() => selectTrack(track)}>
                  <img src={track.coverImageUrl || Cover} className='ProfRecentCardImg' onError={(e) => {(e.target as HTMLImageElement).src = Cover}} />
                  <span className='ProfRecentCardTitle'>{track.title}</span>
                  <span className='ProfRecentCardArtist'>{track.artistName}</span>
                </div>
              ))
            )
          }
          </div>
        </div>
      )}

      {activeProfileTab === 'Історія' && (
        <div className='ProfRecent'>
          <span className='ProfRecentTitle'>Історія Прослуховування</span>
          <div className='ProfRecentGrid'>
            {tracks.length === 0 ? (
              <p className='ProfRecentEmptyText'>Історія прослуховування порожня.</p>
            ) : (
              tracks.map((track) => (
                <div className={`ProfRecentCard ProfRecentCardClickable ${currentTrack?.trackId === track.trackId ? 'active-ink' : ''}`} key={track.trackId} onClick={() => selectTrack(track)}>
                  <img src={track.coverImageUrl || Cover} className='ProfRecentCardImg' onError={(e) => {(e.target as HTMLImageElement).src = Cover}} />
                  <span className='ProfRecentCardTitle'>{track.title}</span>
                  <span className='ProfRecentCardArtist'>{track.artistName}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

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