import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { usePlayer } from '../context/player-context'
import { UserMenu } from './user-menu'
import Logo from '../assets/Logo.svg'
import Home from '../assets/IconHome.svg'
import Search from '../assets/IconSearch.svg'
import Library from '../assets/IconLibrary.svg'
import Playlist from '../assets/IconPlaylist.svg'
import Liked from '../assets/IconLiked.svg'
import AI from '../assets/IconAI.svg'
import Downloads from '../assets/IconDownloads.svg'
import HeaderSearch from '../assets/HeaderSearch.svg'
import Notification from '../assets/IconNotification.svg'
import Right from '../assets/IconRight.svg'
import Volume from '../assets/IconVolume.svg'
import Button from '../assets/Button.svg'
import Remix from '../assets/IconRemix.svg'
import Settings from '../assets/IconSettings.svg'
import LeftArrow from '../assets/LeftArrowLogo.svg'
import Pause from '../assets/IconPause.svg'
import RightArrow from '../assets/RightArrowLogo.svg'
import Ref from '../assets/IconRef.svg'
import Cover from '../assets/Cover.svg'
import { NotificationDropdown } from './notification-dropdown'
import { useTranslation } from 'react-i18next'
import { LangSwitcher } from './LangSwitcher'
import '../app.css'

const PLAY_ICON_DATA = "data:image/svg+xml,%3csvg%20width='15'%20height='18'%20viewBox='0%200%2015%2018'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M0%2018V0L15%209L0%2018Z'%20fill='%230D0D12'/%3e%3c/svg%3e"

const BurgerIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#72DEEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
)

const CloseIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A98FDB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
)

export const Layout: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    currentTime,
    duration,
    isShuffle,
    isRepeat,
    searchQuery,
    isLiked,
    activeTab,
    setActiveTab,
    togglePlayPause,
    playNext,
    playPrevious,
    toggleShuffle,
    toggleRepeat,
    toggleMute,
    applyVolume,
    seekTo,
    handleSearchChange,
    toggleLiked,
    formatTime,
  } = usePlayer()

  const trackRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const isDraggingVolume = useRef(false)

  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)

  const profileName = localStorage.getItem('profileName') || 'Profile'

  useEffect(() => {
    if (activeTab === 'Search' && searchInputRef.current && location.pathname.replace(/^\/en/, '') === '/search') {
      searchInputRef.current.focus()
    }
  }, [activeTab, location.pathname])

  useEffect(() => {
    const cleanPath = location.pathname.replace(/^\/en/, '') || '/'
    if (cleanPath === '/downloads') {
      setActiveTab('Downloads')
    } else if (cleanPath === '/ai-mix') {
      setActiveTab('AI')
    } else if (cleanPath === '/profile') {
      setActiveTab('Profile')
    } else if (cleanPath === '/library') {
      setActiveTab('Library')
    } else if (cleanPath === '/liked') {
      setActiveTab('Liked')
    } else if (cleanPath === '/playlists') {
      setActiveTab('Playlist')
    } else if (cleanPath === '/search') {
      setActiveTab('Search')
    } else if (cleanPath === '/main') {
      setActiveTab('Home')
    }
  }, [location.pathname, setActiveTab])

  useEffect(() => {
    setIsMobileSearchOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSidebarClick = (tab: string) => {
    setActiveTab(tab)
    setIsSidebarOpen(false)
    
    const savedLang = localStorage.getItem('lang') || 'uk'
    const prefix = savedLang === 'en' ? '/en' : ''

    if (tab === 'Downloads') {
      navigate(`${prefix}/downloads`)
    } else if (tab === 'AI') {
      navigate(`${prefix}/ai-mix`)
    } else if (tab === 'Library') {
      navigate(`${prefix}/library`)
    } else if (tab === 'Liked') {
      navigate(`${prefix}/liked`)
    } else if (tab === 'Playlist') {
      navigate(`${prefix}/playlists`)
    } else if (tab === 'Search') {
      navigate(`${prefix}/search`)
    } else if (tab === 'Home') {
      navigate(`${prefix}/main`)
    } else if (tab === 'Settings') {
      navigate(`${prefix}/main`)
    } else {
      navigate(`${prefix}/main`)
    }
  }

  const handleSearchFocus = () => {
    const savedLang = localStorage.getItem('lang') || 'uk'
    const prefix = savedLang === 'en' ? '/en' : ''
    
    if (location.pathname.replace(/^\/en/, '') !== '/search') {
      setActiveTab('Search')
      navigate(`${prefix}/search`)
    } else {
      if (searchInputRef.current) {
        searchInputRef.current.focus()
      }
    }
  }

  const calcVolumeFromEvent = useCallback((clientX: number): number => {
    if (!trackRef.current) return volume
    const rect = trackRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    return Math.max(0, Math.min(100, Math.round((x / rect.width) * 100)))
  }, [volume])

  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isDraggingVolume.current) return
    applyVolume(calcVolumeFromEvent(e.clientX))
  }

  const handleVolumeMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    isDraggingVolume.current = true
    applyVolume(calcVolumeFromEvent(e.clientX))

    const onMouseMove = (ev: MouseEvent) => {
      if (!isDraggingVolume.current) return
      applyVolume(calcVolumeFromEvent(ev.clientX))
    }
    const onMouseUp = () => {
      isDraggingVolume.current = false
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!timelineRef.current || duration === 0) return
    const rect = timelineRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const width = rect.width
    const clickPercent = Math.max(0, Math.min(1, clickX / width))
    seekTo(clickPercent)
  }

  const isTrackPage = location.pathname.endsWith('/track')

  const handleFullscreenClick = () => {
    const savedLang = localStorage.getItem('lang') || 'uk'
    const prefix = savedLang === 'en' ? '/en' : ''
    navigate(`${prefix}/track`)
  }

  return (
    <div className={`Main ${isTrackPage ? 'fullscreen-active' : ''}`}>

      {!isTrackPage && (
        <>
          {isSidebarOpen && (
            <div
              className="SidebarBackdrop"
              onClick={() => setIsSidebarOpen(false)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsSidebarOpen(false) }}
              role="button"
              tabIndex={0}
              aria-label="Close sidebar menu"
            />
          )}
          <aside className={`Sidebar ${isSidebarOpen ? 'open' : ''}`}>
            <div className="SidebarHeader">
              <img src={Logo} className="Logo" alt="Logo" />
              <span className="Groovra">GROOVRA</span>
              <button
                className="SidebarCloseBtn"
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Close sidebar menu"
              >
                <CloseIcon />
              </button>
            </div>

        <div className={`NavItem ${activeTab === 'Home' ? 'active' : ''}`} onClick={() => handleSidebarClick('Home')}>
          {activeTab === 'Home' && <div className="ActiveLine" />}
          <img src={Home} alt="Home" />
          <span className="NavText">{t('nav.home')}</span>
        </div>

        <div className={`NavItem ${activeTab === 'Search' ? 'active' : ''}`} onClick={() => handleSidebarClick('Search')}>
          {activeTab === 'Search' && <div className="ActiveLine" />}
          <img src={Search} alt="Search" />
          <span className="NavText">{t('nav.search')}</span>
        </div>

        <div className={`NavItem ${activeTab === 'Library' ? 'active' : ''}`} onClick={() => handleSidebarClick('Library')}>
          {activeTab === 'Library' && <div className="ActiveLine" />}
          <img src={Library} alt="Library" />
          <span className="NavText">{t('nav.library')}</span>
        </div>

        <div className="ContTextColl">
          <span className="TextColl">{t('nav.collections')}</span>
        </div>

        <div className={`NavItem ${activeTab === 'Playlist' ? 'active' : ''}`} onClick={() => handleSidebarClick('Playlist')}>
          {activeTab === 'Playlist' && <div className="ActiveLine" />}
          <img src={Playlist} alt="Playlist" />
          <span className="NavText">{t('nav.playlists')}</span>
        </div>

        <div className={`NavItem ${activeTab === 'Liked' ? 'active' : ''}`} onClick={() => handleSidebarClick('Liked')}>
          {activeTab === 'Liked' && <div className="ActiveLine" />}
          <img src={Liked} alt="Liked" />
          <span className="NavText">{t('nav.liked')}</span>
        </div>

        <div className={`NavItem ${activeTab === 'AI' ? 'active' : ''}`} onClick={() => handleSidebarClick('AI')}>
          {activeTab === 'AI' && <div className="ActiveLine" />}
          <img src={AI} alt="AI mix" />
          <span className="NavText">{t('nav.aiMix')}</span>
        </div>

        <div className={`NavItem ${activeTab === 'Downloads' ? 'active' : ''}`} onClick={() => handleSidebarClick('Downloads')}>
          {activeTab === 'Downloads' && <div className="ActiveLine" />}
          <img src={Downloads} alt="Downloads" />
          <span className="NavText">{t('nav.downloads')}</span>
        </div>

        <div className={`NavItem ${activeTab === 'Settings' ? 'active' : ''}`} onClick={() => handleSidebarClick('Settings')}>
          {activeTab === 'Settings' && <div className="ActiveLine" />}
          <img src={Settings} alt="Settings" />
          <span className="NavText">{t('nav.settings')}</span>
        </div>

        <div className="SidebarLangSwitcher">
          <LangSwitcher />
        </div>
      </aside>
        </>
      )}
      <div className='RightColumn'>
        {!isTrackPage && (
          <header className={`MainHeader ${(activeTab === 'Search' || isMobileSearchOpen) ? 'search-active' : ''}`}>
            <button
              className="BurgerMenuBtn"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar menu"
            >
              <BurgerIcon />
            </button>

            <button
              className="HeaderBackBtnMobile"
              onClick={() => {
                setIsMobileSearchOpen(false)
                if (activeTab === 'Search') {
                  const savedLang = localStorage.getItem('lang') || 'uk'
                  const prefix = savedLang === 'en' ? '/en' : ''
                  navigate(`${prefix}/main`)
                }
              }}
              aria-label="Back"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#72DEEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            
            <div className="HeaderTitle">
              {activeTab === 'Profile' 
                ? profileName 
                : activeTab === 'Playlist' 
                  ? t('nav.playlists') 
                  : t(`nav.${activeTab === 'AI' ? 'aiMix' : activeTab.toLowerCase()}`)}
            </div>

            <div className="ContSearch">
            <div className="SecContHeader">
              <img src={HeaderSearch} className="HeaderSearch" alt="Search" />
              <input
                ref={searchInputRef}
                type="text"
                className="InputSearch"
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={handleSearchFocus}
              />
            </div>
          </div>

          <div className="UserCont">
            {activeTab !== 'Search' && !isMobileSearchOpen && (
              <button
                type="button"
                className="HeaderSearchBtnMobile"
                onClick={() => {
                  const savedLang = localStorage.getItem('lang') || 'uk'
                  const prefix = savedLang === 'en' ? '/en' : ''
                  navigate(`${prefix}/search`)
                  setIsMobileSearchOpen(true)
                  setTimeout(() => {
                    searchInputRef.current?.focus()
                  }, 100)
                }}
                title={t('search.placeholder')}
                aria-label="Search"
              >
                <img src={HeaderSearch} className="HeaderSearchIcon" alt="Search" />
              </button>
            )}

            <div className="NotificationContainer" ref={notificationRef}>
              <button
                type="button"
                className={`NotificationBtn ${isNotificationOpen ? 'active' : ''}`}
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                title={t('notifications.title')}
                aria-label={t('notifications.title')}
              >
                <img src={Notification} className="Notificationicon" alt={t('notifications.title')} />
              </button>
              <NotificationDropdown isOpen={isNotificationOpen} />
            </div>
            <LangSwitcher />
            <UserMenu profileName={profileName} />
          </div>
        </header>
        )}

        <Outlet />


        {!isTrackPage && (
          <footer className="FooterPlayer">
          <div className="TrackContainer" onClick={handleFullscreenClick} style={{ cursor: 'pointer' }}>
            <div className="CurrentPlaying">
              <img
                src={currentTrack?.coverImageUrl || Cover}
                className="CoverImg"
                style={{ borderRadius: '8px' }}
                alt="Cover"
                onError={(e) => { (e.target as HTMLImageElement).src = Cover }}
              />
            </div>

            <span className="NameOfTrack">{currentTrack ? currentTrack.title : t('player.track')}</span>
            <span className="Author">{currentTrack ? currentTrack.artistName : t('player.artist')}</span>

            <button
              className={`IconLiked ${isLiked ? 'liked' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                toggleLiked()
              }}
              title={isLiked ? t('player.unlike') : t('player.like')}
            >
              <img src={Liked} alt="Like icon" />
            </button>
          </div>

          <div className="ContPlayBack">
            <div className="PlayeerCont">
              <button className={`ButtonRemix ${isShuffle ? 'active' : ''}`} onClick={toggleShuffle} title={t('player.shuffle')}>
                <img src={Remix} className="LogoRemix" alt="Shuffle" />
              </button>
              <button className="LeftArrowButton" onClick={playPrevious} title={t('player.previous')}>
                <img src={LeftArrow} className="LeftArrow" alt="Previous" />
              </button>
              <button className="PauseButton" onClick={togglePlayPause} title={isPlaying ? t('player.pause') : t('player.play')}>
                <img src={isPlaying ? Pause : PLAY_ICON_DATA} className="PauseLogo" style={isPlaying ? undefined : { marginLeft: '2px' }} alt="Play/Pause" />
              </button>
              <button className="ButtonRightArrow" onClick={playNext} title={t('player.next')}>
                <img src={RightArrow} className="RightArrowLogo" alt="Next" />
              </button>
              <button className={`RefButton ${isRepeat ? 'active' : ''}`} onClick={toggleRepeat} title={isRepeat ? t('player.repeatOn') : t('player.repeat')}>
                <img src={Ref} className="RefLogo" alt="Repeat" />
              </button>
            </div>

            <div className="ContStartTime">
              <span className="StartTime">{formatTime(currentTime)}</span>
              <div className="PlayBackLine" ref={timelineRef} onClick={handleTimelineClick}>
                <div className="PlayBackFill" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}></div>
              </div>
              <span className="EndTime">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="Volume">
            <button
              className={`MuteButton ${isMuted ? 'muted' : ''}`}
              onClick={toggleMute}
              title={isMuted ? t('player.unmute') : t('player.mute')}
            >
              <img src={Button} className="MuteIcon" alt="Mute" />
            </button>
            <img src={Volume} className="VolumeIcon" alt="Volume" />
            <div
              className="ContVolume"
              ref={trackRef}
              onClick={handleSliderClick}
              onMouseDown={handleVolumeMouseDown}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              <div className="VolumeFill" style={{ width: `${isMuted ? 0 : volume}%` }}></div>
            </div>
            <button className="ButtonRight" onClick={handleFullscreenClick} title={t('player.fullscreen')}>
              <img src={Right} alt="Fullscreen" />
            </button>
          </div>
        </footer>
        )}
      </div>
    </div>
  )
}