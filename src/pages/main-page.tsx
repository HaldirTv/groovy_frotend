import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { usePlayer } from '../context/player-context'
import { logoutUser } from '../api/auth'
import { AiMixesPanel } from '../components/ai-mixes-panel'
import { FooterFromJson } from '../components/footer-from-json'
import BackLogo from '../assets/Frame 4.svg'
import AI from '../assets/IconAI.svg'
import Arrow from '../assets/IconArrow.svg'
import Cover from '../assets/Cover.svg'
import '../app.css'

const PLAY_ICON_DATA = "data:image/svg+xml,%3csvg%20width='15'%20height='18'%20viewBox='0%200%2015%2018'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M0%2018V0L15%209L0%2018Z'%20fill='%230D0D12'/%3e%3c/svg%3e"

const getGreetingKey = (): string => {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return 'greetings.morning'
  if (h >= 12 && h < 17) return 'greetings.afternoon'
  if (h >= 17 && h < 22) return 'greetings.evening'
  return 'greetings.night'
}

export const Main: React.FC = () => {
  const { t } = useTranslation()
  const location = useLocation()

  const {
    tracks,
    currentTrack,
    isLoadingTracks,
    searchQuery,
    activeTab,
    setActiveTab,
    selectTrack,
    setTracks,
  } = usePlayer()

  const [profileName, setProfileName] = useState(() => {
    return localStorage.getItem('profileName') || 'Profile'
  })
  const [showAllTracks, setShowAllTracks] = useState(false)

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab)
    }
  }, [location.state, setActiveTab])

  const handleProfileNameChange = (name: string) => {
    setProfileName(name)
    localStorage.setItem('profileName', name)
  }

  const handleLogout = async () => {
    await logoutUser()
  }

  const handleAiMixLaunch = () => {
    if (tracks.length > 0) {
      const shuffled = [...tracks].sort(() => 0.5 - Math.random())
      setTracks(shuffled)
      selectTrack(shuffled[0])
      setActiveTab('Home')
    }
  }

  const visibleTracks = (showAllTracks || searchQuery.trim() !== '') ? tracks : tracks.slice(0, 6)

  return (
    <main className="Main2">
      {activeTab === 'Home' && (
        <>
          <img src={BackLogo} className="BackLogo" alt="" />

          <div className="ContMainHello">
            <span className="MainHeaderText">{t(getGreetingKey())}</span>
            <div className="NameText">
              <span className="ProfileText">{profileName}</span>
            </div>
          </div>

          <div className="OpCont">
            <span className="OpText">{t('main.hello_sub')}</span>
          </div>

          <div className="MainLine"></div>

          <div className="TrendingNow">
            <div className="ContTextTrendingNow">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span className="LisNowTrending">{t('main.trending_listening')}</span>
                <span className="TrendNowText">{t('main.trending_now')}</span>
              </div>
              {tracks.length > 0 && !searchQuery.trim() && (
                <button className="ButtonViewAll" onClick={() => setShowAllTracks(!showAllTracks)}>
                  <span className="TextViewAll">{showAllTracks ? t('main.collapse') : t('main.view_all')}</span>
                  <img src={Arrow} className="ArrowViewAll" style={{ transform: showAllTracks ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} alt="Toggle" />
                </button>
              )}
            </div>

            <div className="MusicCardCont">
              {isLoadingTracks ? (
                <div style={{ color: '#A1A1AA', fontFamily: 'SUSE, sans-serif' }}>{t('main.loading_tracks')}</div>
              ) : tracks.length === 0 ? (
                <div style={{ color: '#A1A1AA', fontFamily: 'SUSE, sans-serif' }}>{t('main.not_found_tracks')}</div>
              ) : (
                visibleTracks.map((track) => (
                  <div
                    key={track.trackId}
                    className={`MusicCard ${currentTrack?.trackId === track.trackId ? 'active-track' : ''}`}
                    onClick={() => selectTrack(track)}
                  >
                    <div className="OverCover">
                      <img
                        src={track.coverImageUrl || Cover}
                        className="CoverImg"
                        alt={track.title}
                        onError={(e) => { (e.target as HTMLImageElement).src = Cover }}
                      />
                    </div>
                    <div className="ContMusicCardText">
                      <span className="HeadText">{track.title}</span>
                      <span className="AuthorText">{track.artistName}</span>
                      <span className="StyleTrack">{track.genre || 'POP'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <AiMixesPanel>
            <div className="MusicCardCont" style={{ border: 'none', padding: 0, background: 'transparent', margin: 0 }}>
              {isLoadingTracks ? (
                <div style={{ color: '#A1A1AA', fontFamily: 'SUSE, sans-serif' }}>{t('main.loading_tracks')}</div>
              ) : tracks.length === 0 ? (
                <div style={{ color: '#A1A1AA', fontFamily: 'SUSE, sans-serif' }}>{t('main.not_found_tracks')}</div>
              ) : (
                visibleTracks.map((track) => (
                  <div
                    key={track.trackId}
                    className={`MusicCard ${currentTrack?.trackId === track.trackId ? 'active-track' : ''}`}
                    onClick={() => selectTrack(track)}
                  >
                    <div className="OverCover">
                      <img
                        src={track.coverImageUrl || Cover}
                        className="CoverImg"
                        alt={track.title}
                        onError={(e) => { (e.target as HTMLImageElement).src = Cover }}
                      />
                    </div>
                    <div className="ContMusicCardText">
                      <span className="HeadText">{track.title}</span>
                      <span className="AuthorText">{track.artistName}</span>
                      <span className="StyleTrack">{track.genre || 'POP'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </AiMixesPanel>
        </>
      )}

      {activeTab === 'Playlist' && (
        <div className="PlaylistTabContent">
          <span className="SectionTitle">{t('main.playlists_title')}</span>
          <div className="PlaylistGrid">
            {[
              { key: 'evening_vibe', title: t('main.pl_evening_vibe'), desc: t('main.pl_evening_vibe_desc'), color: 'linear-gradient(135deg, #1e1b4b, #311042)', tracksCount: 8 },
              { key: 'energy_mix', title: t('main.pl_energy_mix'), desc: t('main.pl_energy_mix_desc'), color: 'linear-gradient(135deg, #1c1917, #451a03)', tracksCount: 12 },
              { key: 'relax', title: t('main.pl_relax'), desc: t('main.pl_relax_desc'), color: 'linear-gradient(135deg, #064e3b, #022c22)', tracksCount: 6 },
              { key: 'ai_rec', title: t('main.pl_ai_rec'), desc: t('main.pl_ai_rec_desc'), color: 'linear-gradient(135deg, #172554, #1e1b4b)', tracksCount: 15 }
            ].map(playlist => (
              <div
                key={playlist.key}
                className="PlaylistCard"
                style={{ background: playlist.color }}
                onClick={() => {
                  if (tracks.length > 0) {
                    const shuffled = [...tracks].sort(() => 0.5 - Math.random())
                    selectTrack(shuffled[0])
                  }
                }}
              >
                <div className="PlaylistCardContent">
                  <span className="PlaylistCardTitle">{playlist.title}</span>
                  <span className="PlaylistCardDesc">{playlist.desc}</span>
                  <span className="PlaylistCardCount">{t('tracks_count', { count: playlist.tracksCount })}</span>
                </div>
                <div className="PlaylistPlayButton">
                  <img src={PLAY_ICON_DATA} alt="Play" style={{ width: '12px', height: '14px', marginLeft: '2px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'AI' && (
        <div className="AiTabContent">
          <span className="SectionTitle">{t('main.ai_tab_title')}</span>
          <div className="AiGeneratorCard">
            <div className="AiPulseCircle">
              <img src={AI} className="AiPulseIcon" alt="AI logo" />
            </div>
            <span className="AiTitle">{t('main.ai_tab_subtitle')}</span>
            <span className="AiDesc">{t('main.ai_tab_desc')}</span>
            <button
              className="AiGenerateBtn"
              onClick={handleAiMixLaunch}
            >
              {t('main.ai_tab_btn')}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'Settings' && (
        <div className="SettingsTabContent">
          <span className="SectionTitle">{t('main.settings_title')}</span>
          <div className="SettingsForm">
            <div className="SettingsGroup">
              <label className="SettingsLabel" htmlFor="settings-profile-name">{t('main.settings_profile_name')}</label>
              <input
                id="settings-profile-name"
                type="text"
                className="SettingsInput"
                placeholder={t('main.settings_profile_placeholder')}
                defaultValue={profileName}
                onBlur={(e) => {
                  if (e.target.value.trim() !== '') {
                    handleProfileNameChange(e.target.value.trim())
                  }
                }}
              />
            </div>
            <div className="SettingsGroup">
              <label className="SettingsLabel" htmlFor="settings-audio-quality">{t('main.settings_audio_quality')}</label>
              <select id="settings-audio-quality" className="SettingsSelect" defaultValue="High">
                <option value="Standard">Standard (128 kbps)</option>
                <option value="High">High (320 kbps)</option>
                <option value="Ultra">Ultra (FLAC / Lossless)</option>
              </select>
            </div>
            <button className="SettingsLogoutBtn" onClick={handleLogout}>{t('main.settings_logout')}</button>
          </div>
        </div>
      )}
      <FooterFromJson />
    </main>
  )
}