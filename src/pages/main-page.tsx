import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { usePlayer } from '../context/player-context'
import { logoutUser } from '../api/auth'
import { AiMixesPanel } from '../components/ai-mixes-panel'
import BackLogo from '../assets/Frame 4.svg'
import AI from '../assets/IconAI.svg'
import Arrow from '../assets/IconArrow.svg'
import Cover from '../assets/Cover.svg'
import '../app.css'

const PLAY_ICON_DATA = "data:image/svg+xml,%3csvg%20width='15'%20height='18'%20viewBox='0%200%2015%2018'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M0%2018V0L15%209L0%2018Z'%20fill='%230D0D12'/%3e%3c/svg%3e"

export const Main: React.FC = () => {
  const location = useLocation()

  const {
    tracks,
    currentTrack,
    isLoadingTracks,
    searchQuery,
    likedTrackIds,
    activeTab,
    setActiveTab,
    selectTrack,
    handleSearchChange,
    formatTime,
    setTracks,
  } = usePlayer()

  const [profileName, setProfileName] = useState(() => {
    return localStorage.getItem('profileName') || 'Profile'
  })
  const [showAllTracks, setShowAllTracks] = useState(false)

  // Sync activeTab if passed from navigation state
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

  const handleGenreClick = (genreName: string) => {
    handleSearchChange(genreName)
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
          <img src={BackLogo} className="BackLogo"/>

          <div className="ContMainHello">
            <span className="MainHeaderText">Добрий вечір, </span>
            <div className="NameText">
              <span className="ProfileText">{profileName}</span>
            </div>
          </div>

          <div className="OpCont">
            <span className="OpText">Час набирати ауру, оберіть плейлист</span>
          </div>

          <div className="MainLine"></div>

          <div className="TrendingNow">
            <div className="ContTextTrendingNow">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span className="LisNowTrending">Слухають зараз</span>
                <span className="TrendNowText">У тренді зараз</span>
              </div>
              {tracks.length > 0 && !searchQuery.trim() && (
                <button className="ButtonViewAll" onClick={() => setShowAllTracks(!showAllTracks)}>
                  <span className="TextViewAll">{showAllTracks ? 'ЗГОРНУТИ' : 'ДИВИТИСЬ ВСІ'}</span>
                  <img src={Arrow} className="ArrowViewAll" style={{ transform: showAllTracks ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} alt="Toggle" />
                </button>
              )}
            </div>
            

            <div className="MusicCardCont">
              {isLoadingTracks ? (
                <div style={{ color: '#A1A1AA', fontFamily: 'SUSE, sans-serif' }}>Завантаження треків...</div>
              ) : tracks.length === 0 ? (
                <div style={{ color: '#A1A1AA', fontFamily: 'SUSE, sans-serif' }}>Не знайдено жодного треку</div>
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
                <div style={{ color: '#A1A1AA', fontFamily: 'SUSE, sans-serif' }}>Завантаження треків...</div>
              ) : tracks.length === 0 ? (
                <div style={{ color: '#A1A1AA', fontFamily: 'SUSE, sans-serif' }}>Не знайдено жодного треку</div>
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

      {activeTab === 'Search' && (
        <div className="SearchTabContent">
          <div className="SearchHeader">
            <span className="SectionTitle">Пошук музики</span>
          </div>
          {searchQuery.trim() === '' ? (
            <div className="GenreCategories">
              <span className="SubSectionTitle">Популярні жанри</span>
              <div className="GenreGrid">
                {[
                  { name: 'Pop', color: 'linear-gradient(135deg, #a855f7, #ec4899)' },
                  { name: 'Rock', color: 'linear-gradient(135deg, #ef4444, #f97316)' },
                  { name: 'Hip-Hop', color: 'linear-gradient(135deg, #3b82f6, #06b6d4)' },
                  { name: 'Jazz', color: 'linear-gradient(135deg, #eab308, #ca8a04)' },
                  { name: 'Electronic', color: 'linear-gradient(135deg, #10b981, #14b8a6)' },
                  { name: 'Ambient', color: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
                  { name: 'Classical', color: 'linear-gradient(135deg, #64748b, #475569)' },
                  { name: 'Lo-Fi', color: 'linear-gradient(135deg, #f43f5e, #fb7185)' }
                ].map(genre => (
                  <div
                    key={genre.name}
                    className="GenreCard"
                    style={{ background: genre.color }}
                    onClick={() => handleGenreClick(genre.name)}
                  >
                    <span className="GenreCardName">{genre.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="SearchResults">
              <span className="SubSectionTitle">Результати пошуку за запитом "{searchQuery}"</span>

              <div className="MusicCardCont">
                {isLoadingTracks ? (
                  <div style={{ color: '#A1A1AA', fontFamily: 'SUSE, sans-serif' }}>Завантаження результатів...</div>
                ) : tracks.length === 0 ? (
                  <div style={{ color: '#A1A1AA', fontFamily: 'SUSE, sans-serif' }}>Не знайдено жодного треку за запитом "{searchQuery}"</div>
                ) : (
                  tracks.map((track) => (
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
          )}
        </div>
      )}

      {activeTab === 'Library' && (
        <div className="LibraryTabContent">
          <span className="SectionTitle">Ваша медіатека</span>
          <div className="LibraryTrackList">
            <div className="LibraryTableHeader">
              <span className="ColHash">#</span>
              <span className="ColTitle">Назва</span>
              <span className="ColGenre">Жанр</span>
              <span className="ColDuration">Тривалість</span>
            </div>
            <div className="LibraryTableBody">
              {tracks.map((track, index) => (
                <div
                  key={track.trackId}
                  className={`LibraryRow ${currentTrack?.trackId === track.trackId ? 'active-row' : ''}`}
                  onClick={() => selectTrack(track)}
                >
                  <span className="ColHash">{index + 1}</span>
                  <div className="ColTitleDetail">
                    <img src={track.coverImageUrl || Cover} className="LibraryRowCover" alt="Cover" />
                    <div className="LibraryRowInfo">
                      <span className="RowTitle">{track.title}</span>
                      <span className="RowArtist">{track.artistName}</span>
                    </div>
                  </div>
                  <span className="ColGenre">{track.genre || 'POP'}</span>
                  <span className="ColDuration">{formatTime(track.durationSeconds)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Playlist' && (
        <div className="PlaylistTabContent">
          <span className="SectionTitle">Плейлисти</span>
          <div className="PlaylistGrid">
            {[
              { title: 'Вечірній вайб', desc: 'Затишна музика для вечірнього відпочинку', color: 'linear-gradient(135deg, #1e1b4b, #311042)', tracksCount: 8 },
              { title: 'Енергійний мікс', desc: 'Треки, які допоможуть тримати темп', color: 'linear-gradient(135deg, #1c1917, #451a03)', tracksCount: 12 },
              { title: 'Релакс', desc: 'Максимальне розслаблення та спокій', color: 'linear-gradient(135deg, #064e3b, #022c22)', tracksCount: 6 },
              { title: 'AI Рекомендації', desc: 'Згенеровано персонально для вас', color: 'linear-gradient(135deg, #172554, #1e1b4b)', tracksCount: 15 }
            ].map(playlist => (
              <div
                key={playlist.title}
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
                  <span className="PlaylistCardCount">{playlist.tracksCount} треків</span>
                </div>
                <div className="PlaylistPlayButton">
                  <img src={PLAY_ICON_DATA} alt="Play" style={{ width: '12px', height: '14px', marginLeft: '2px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Liked' && (
        <div className="LikedTabContent">
          <span className="SectionTitle">Улюблені треки</span>
          {tracks.filter(t => likedTrackIds.includes(t.trackId)).length === 0 ? (
            <div className="EmptyStateText">У вас поки немає улюблених треків. Натисніть серце у плеєрі, щоб додати трек сюди!</div>
          ) : (
            <div className="LibraryTrackList">
              <div className="LibraryTableHeader">
                <span className="ColHash">#</span>
                <span className="ColTitle">Назва</span>
                <span className="ColGenre">Жанр</span>
                <span className="ColDuration">Тривалість</span>
              </div>
              <div className="LibraryTableBody">
                {tracks.filter(t => likedTrackIds.includes(t.trackId)).map((track, index) => (
                  <div
                    key={track.trackId}
                    className={`LibraryRow ${currentTrack?.trackId === track.trackId ? 'active-row' : ''}`}
                    onClick={() => selectTrack(track)}
                  >
                    <span className="ColHash">{index + 1}</span>
                    <div className="ColTitleDetail">
                      <img src={track.coverImageUrl || Cover} className="LibraryRowCover" alt="Cover" />
                      <div className="LibraryRowInfo">
                        <span className="RowTitle">{track.title}</span>
                        <span className="RowArtist">{track.artistName}</span>
                      </div>
                    </div>
                    <span className="ColGenre">{track.genre || 'POP'}</span>
                    <span className="ColDuration">{formatTime(track.durationSeconds)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'AI' && (
        <div className="AiTabContent">
          <span className="SectionTitle">AI мікс</span>
          <div className="AiGeneratorCard">
            <div className="AiPulseCircle">
              <img src={AI} className="AiPulseIcon" alt="AI logo" />
            </div>
            <span className="AiTitle">Створити розумний мікс</span>
            <span className="AiDesc">Наш AI проаналізує ваші вподобання та згенерує персональний потік музики на основі вашого поточного настрою.</span>
            <button
              className="AiGenerateBtn"
              onClick={handleAiMixLaunch}
            >
              Запустити AI мікс
            </button>
          </div>
        </div>
      )}

      {activeTab === 'Downloads' && (
        <div className="DownloadsTabContent">
          <span className="SectionTitle">Завантаження</span>
          <div className="DownloadsContainer">
            <div className="DownloadsStatus">
              <span className="StatusTitle">Офлайн режим готовий</span>
              <span className="StatusDesc">Ви можете завантажити будь-який трек для прослуховування без інтернету.</span>
            </div>
            {tracks.slice(0, 3).map((track, index) => (
              <div key={track.trackId} className="DownloadRow">
                <span className="DownloadRowHash">{index + 1}</span>
                <div className="DownloadRowInfo">
                  <span className="DownloadRowTitle">{track.title}</span>
                  <span className="DownloadRowArtist">{track.artistName}</span>
                </div>
                <span className="DownloadRowStatus">Завантажено ({(track.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Settings' && (
        <div className="SettingsTabContent">
          <span className="SectionTitle">Налаштування</span>
          <div className="SettingsForm">
            <div className="SettingsGroup">
              <label className="SettingsLabel" htmlFor="settings-profile-name">Ім'я профілю</label>
              <input
                id="settings-profile-name"
                type="text"
                className="SettingsInput"
                placeholder="Введіть нове ім'я..."
                defaultValue={profileName}
                onBlur={(e) => {
                  if (e.target.value.trim() !== '') {
                    handleProfileNameChange(e.target.value.trim())
                  }
                }}
              />
            </div>
            <div className="SettingsGroup">
              <label className="SettingsLabel" htmlFor="settings-audio-quality">Якість аудіо</label>
              <select id="settings-audio-quality" className="SettingsSelect" defaultValue="Висока (320 kbps)">
                <option value="Стандартна (128 kbps)">Стандартна (128 kbps)</option>
                <option value="Висока (320 kbps)">Висока (320 kbps)</option>
                <option value="Ультра (FLAC / Lossless)">Ультра (FLAC / Lossless)</option>
              </select>
            </div>
            <button className="SettingsLogoutBtn" onClick={handleLogout}>Вийти з акаунту</button>
          </div>
        </div>
      )}
    </main>
  )
}