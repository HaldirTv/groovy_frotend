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
import { useProfile } from '../context/profile context'
import { NotificationDropdown } from './notification-dropdown'
import '../app.css'

const PLAY_ICON_DATA = "data:image/svg+xml,%3csvg%20width='15'%20height='18'%20viewBox='0%200%2015%2018'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M0%2018V0L15%209L0%2018Z'%20fill='%230D0D12'/%3e%3c/svg%3e"

export const Layout: React.FC = () => {
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
  const notificationRef = useRef<HTMLDivElement>(null)

  const { profileName, avatarUrl } = useProfile()

  useEffect(() => {
    if (activeTab === 'Search' && searchInputRef.current && location.pathname === '/main') {
      searchInputRef.current.focus()
    }
  }, [activeTab, location.pathname])

  useEffect(() => {
    if (location.pathname === '/downloads') {
      setActiveTab('Downloads')
    } else if (location.pathname === '/ai-mix') {
      setActiveTab('AI')
    } else if (location.pathname === '/profile') {
      setActiveTab('Profile')
    } else if (location.pathname === '/main') {
      if (activeTab === 'Downloads' || activeTab === 'AI' || activeTab === 'Profile') {
        setActiveTab('Home')
      }
    }
  }, [location.pathname, setActiveTab])

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
    if (tab === 'Downloads') {
      navigate('/downloads')
    } else if (tab === 'AI') {
      navigate('/ai-mix')
    } else {
      if (location.pathname !== '/main') {
        navigate('/main')
      }
    }
  }

  const handleSearchFocus = () => {
    if (location.pathname !== '/main') {
      setActiveTab('Search')
      navigate('/main')
    } else {
      setActiveTab('Search')
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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error("Error enabling fullscreen:", err)
      })
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <div className="Main">

      <aside className="Sidebar">
        <div className="SidebarHeader">
          <img src={Logo} className="Logo" alt="Logo" />
          <span className="Groovra">GROOVRA</span>
        </div>

        <div className={`NavItem ${activeTab === 'Home' ? 'active' : ''}`} onClick={() => handleSidebarClick('Home')}>
          {activeTab === 'Home' && <div className="ActiveLine" />}
          <img src={Home} alt="Home" />
          <span className="NavText">Головна</span>
        </div>

        <div className={`NavItem ${activeTab === 'Search' ? 'active' : ''}`} onClick={() => handleSidebarClick('Search')}>
          {activeTab === 'Search' && <div className="ActiveLine" />}
          <img src={Search} alt="Search" />
          <span className="NavText">Пошук</span>
        </div>

        <div className={`NavItem ${activeTab === 'Library' ? 'active' : ''}`} onClick={() => handleSidebarClick('Library')}>
          {activeTab === 'Library' && <div className="ActiveLine" />}
          <img src={Library} alt="Library" />
          <span className="NavText">Бібліотека</span>
        </div>

        <div className="ContTextColl">
          <span className="TextColl">Ваші Колекції</span>
        </div>

        <div className={`NavItem ${activeTab === 'Playlist' ? 'active' : ''}`} onClick={() => handleSidebarClick('Playlist')}>
          {activeTab === 'Playlist' && <div className="ActiveLine" />}
          <img src={Playlist} alt="Playlist" />
          <span className="NavText">Плейлисти</span>
        </div>

        <div className={`NavItem ${activeTab === 'Liked' ? 'active' : ''}`} onClick={() => handleSidebarClick('Liked')}>
          {activeTab === 'Liked' && <div className="ActiveLine" />}
          <img src={Liked} alt="Liked" />
          <span className="NavText">Улюблене</span>
        </div>

        <div className={`NavItem ${activeTab === 'AI' ? 'active' : ''}`} onClick={() => handleSidebarClick('AI')}>
          {activeTab === 'AI' && <div className="ActiveLine" />}
          <img src={AI} alt="AI mix" />
          <span className="NavText">AI мікс</span>
        </div>

        <div className={`NavItem ${activeTab === 'Downloads' ? 'active' : ''}`} onClick={() => handleSidebarClick('Downloads')}>
          {activeTab === 'Downloads' && <div className="ActiveLine" />}
          <img src={Downloads} alt="Downloads" />
          <span className="NavText">Завантаження</span>
        </div>

        <div className={`NavItem ${activeTab === 'Settings' ? 'active' : ''}`} onClick={() => handleSidebarClick('Settings')}>
          {activeTab === 'Settings' && <div className="ActiveLine" />}
          <img src={Settings} alt="Settings" />
          <span className="NavText">Налаштування</span>
        </div>
      </aside>
      <div className='RightColumn'>
        <header className="MainHeader">
          <div className="ContSearch">
            <div className="SecContHeader">
              <img src={HeaderSearch} className="HeaderSearch" alt="Search" />
              <input
                ref={searchInputRef}
                type="text"
                className="InputSearch"
                placeholder="Пошук треків, виконавців або настроїв..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={handleSearchFocus}
              />
            </div>
          </div>

          <div className="UserCont">
            <div className="NotificationContainer" ref={notificationRef}>
              <button
                type="button"
                className={`NotificationBtn ${isNotificationOpen ? 'active' : ''}`}
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                title="Сповіщення"
                aria-label="Сповіщення"
              >
                <img src={Notification} className="Notificationicon" alt="Сповіщення" />
              </button>
              <NotificationDropdown isOpen={isNotificationOpen} />
            </div>
            <UserMenu profileName={profileName} avatarUrl={avatarUrl} />
            <button
              type="button"
              className="NotificationBtn"
              onClick={() => alert('Сповіщень поки немає')}
              title="Сповіщення"
              aria-label="Сповіщення"
            >
              <img src={Notification} className="Notificationicon" alt="Сповіщення" />
            </button>
            <UserMenu profileName={profileName} avatarUrl={avatarUrl} />
          </div>
        </header>

        <Outlet />


        <footer className="FooterPlayer">
          <div className="TrackContainer">
            <div className="CurrentPlaying">
              <img
                src={currentTrack?.coverImageUrl || Cover}
                className="CoverImg"
                style={{ borderRadius: '8px' }}
                alt="Cover"
                onError={(e) => { (e.target as HTMLImageElement).src = Cover }}
              />
            </div>

            <span className="NameOfTrack">{currentTrack ? currentTrack.title : 'Трек'}</span>
            <span className="Author">{currentTrack ? currentTrack.artistName : 'Виконавець'}</span>

            <button
              className={`IconLiked ${isLiked ? 'liked' : ''}`}
              onClick={toggleLiked}
              title={isLiked ? 'Видалити з улюбленого' : 'Додати до улюбленого'}
            >
              <img src={Liked} alt="Like icon" />
            </button>
          </div>

          <div className="ContPlayBack">
            <div className="PlayeerCont">
              <button className={`ButtonRemix ${isShuffle ? 'active' : ''}`} onClick={toggleShuffle} title="Перемішати">
                <img src={Remix} className="LogoRemix" alt="Shuffle" />
              </button>
              <button className="LeftArrowButton" onClick={playPrevious} title="Попередній трек">
                <img src={LeftArrow} className="LeftArrow" alt="Previous" />
              </button>
              <button className="PauseButton" onClick={togglePlayPause} title={isPlaying ? 'Пауза' : 'Грати'}>
                <img src={isPlaying ? Pause : PLAY_ICON_DATA} className="PauseLogo" style={isPlaying ? undefined : { marginLeft: '2px' }} alt="Play/Pause" />
              </button>
              <button className="ButtonRightArrow" onClick={playNext} title="Наступний трек">
                <img src={RightArrow} className="RightArrowLogo" alt="Next" />
              </button>
              <button className={`RefButton ${isRepeat ? 'active' : ''}`} onClick={toggleRepeat} title={isRepeat ? 'Повтор увімкнено' : 'Увімкнути повтор'}>
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
              title={isMuted ? 'Увімкнути звук' : 'Вимкнути звук'}
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
            <button className="ButtonRight" onClick={toggleFullscreen} title="Режим на весь екран">
              <img src={Right} alt="Fullscreen" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}