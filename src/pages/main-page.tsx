import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { usePlayer, type Track } from '../context/player-context'
import { logoutUser } from '../api/auth'
import { apiFetch, GATEWAY_URL } from '../api/api-client'
import { AiMixesPanel } from '../components/ai-mixes-panel'
import BackLogo from '../assets/Frame 4.svg'
import AI from '../assets/IconAI.svg'
import Arrow from '../assets/IconArrow.svg'
import Cover from '../assets/Cover.svg'
import '../app.css'
import { Pagination } from '../components/pagination'
import { useProfile } from '../context/profile context'

export interface PlaylistListItem {
  id: string;
  title: string;
  description?: string;
  isPrivate: boolean;
  slug: string;
  trackCount: number;
  totalDurationSeconds: number;
  coverImageUrl?: string;
  collageCovers: string[];
  updatedAt: string;
}

export interface PlaylistTrackDto {
  trackId: string;
  title: string;
  artistName: string;
  position: number;
  coverUrl?: string;
  durationSeconds: number;
}

export interface PlaylistDetail {
  id: string;
  userId: string;
  title: string;
  description?: string;
  slug: string;
  coverImageUrl?: string;
  trackCount: number;
  totalDurationSeconds: number;
  isPrivate: boolean;
  createdAt: string;
  tracks: PlaylistTrackDto[];
}

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
    currentPage,
    hasMoreTracks,
    fetchTracks,
  } = usePlayer()

  const { profileName, setProfileName: setProfileNameContext } = useProfile()
  const [showAllTracks, setShowAllTracks] = useState(false)

  const [playlists, setPlaylists] = useState<PlaylistListItem[]>([])
  const [activePlaylistDetail, setActivePlaylistDetail] = useState<PlaylistDetail | null>(null)
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false)
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false)
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('')
  const [showPlaylistModal, setShowPlaylistModal] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; visible: boolean } | null>(null)

  const [historyItems, setHistoryItems] = useState<Track[]>([])
  const [historyTotalCount, setHistoryTotalCount] = useState(0)
  const [historyPage, setHistoryPage] = useState(1)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [hasMoreHistory, setHasMoreHistory] = useState(true)
  const [showAllHistory, setShowAllHistory] = useState(false)
  const HISTORY_PAGE_SIZE = 10

  const fetchHistory = async (page: number = 1, append: boolean = false) => {
    if (isLoadingHistory) return
    setIsLoadingHistory(true)
    try {
      const url = `${GATEWAY_URL}/api/history?pageNumber=${page}&pageSize=${HISTORY_PAGE_SIZE}`
      const response = await apiFetch(url)
      if (response.ok) {
        const data = await response.json()
        const mappedTracks: Track[] = data.items.map((item: any) => ({
          trackId: item.trackId,
          title: item.title,
          artistName: item.artistName,
          durationSeconds: item.durationSeconds || 0,
          audioUrl: item.audioUrl || `${GATEWAY_URL}/music/tracks/${item.trackId}/stream`,
          coverImageUrl: item.coverImageUrl || Cover,
          fileSizeBytes: item.fileSizeBytes || 0,
          contentType: item.contentType || 'audio/mpeg',
          uploadedAt: item.uploadedAt || new Date().toISOString(),
          playCount: item.playCount || 0,
          genre: item.genre || 'POP',
        }))
        if (append) {
          setHistoryItems(prev => [...prev, ...mappedTracks])
        } else {
          setHistoryItems(mappedTracks)
        }
        setHistoryTotalCount(data.totalCount)
        setHasMoreHistory(page * HISTORY_PAGE_SIZE < data.totalCount)
        setHistoryPage(page)
      }
    } catch (error) {
      console.error('Помилка завантаження історії:', error)
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const loadMoreHistory = () => {
    if (!isLoadingHistory && hasMoreHistory) {
      fetchHistory(historyPage + 1, true)
    }
  }

  useEffect(() => {
    if (activeTab === 'Library') {
      fetchHistory(1, false)
    }
  }, [activeTab])

  useEffect(() => {
    if (currentTrack && activeTab === 'Library') {
      const timer = setTimeout(() => {
        fetchHistory(1, false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [currentTrack, activeTab])

  const showToast = (message: string) => {
    setToast({ message, visible: true })
    setTimeout(() => {
      setToast(prev => prev ? { ...prev, visible: false } : null)
      setTimeout(() => setToast(null), 400)
    }, 2500)
  }

  const [likedTracks, setLikedTracks] = useState<Track[]>([])
  const [isLoadingLiked, setIsLoadingLiked] = useState(false)

  const fetchLikedTracks = async () => {
    setIsLoadingLiked(true);
    try {
      const response = await apiFetch(`${GATEWAY_URL}/music/favorites`);
      if (response.ok) {
        const data = await response.json();

        const enrichedTracks: Track[] = data.map((track: any) => ({
          trackId: track.trackId,
          title: track.title,
          artistName: track.artistName,
          durationSeconds: track.durationSeconds || 0,
          audioUrl: `${GATEWAY_URL}/music/tracks/${track.trackId}/stream`,
          coverImageUrl: track.coverImageUrl || Cover,
          fileSizeBytes: track.fileSizeBytes || 0,
          contentType: track.contentType || 'audio/mpeg',
          uploadedAt: track.uploadedAt || new Date().toISOString(),
          playCount: track.playCount || 0,
          genre: track.genre || 'POP',
        }));

        setLikedTracks(enrichedTracks);
      }
    } catch (error) {
      console.error('Помилка завантаження улюблених:', error);
    } finally {
      setIsLoadingLiked(false);
    }
  };
  
  useEffect(() => {
    if (activeTab === 'Liked') {
      fetchLikedTracks()
    } else if (activeTab === 'Playlist') {
      fetchPlaylists()
      setActivePlaylistDetail(null)
    } else if (['Home', 'Search'].includes(activeTab)) {
      fetchTracks(activeTab === 'Search' ? searchQuery : '', 1, false)
    }
    
  }, [activeTab])

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab)
    }
  }, [location.state, setActiveTab])

  const fetchPlaylists = async () => {
    setIsLoadingPlaylists(true)
    try {
      const response = await apiFetch(`${GATEWAY_URL}/music/playlists`)
      if (response.ok) {
        const data = await response.json()
        setPlaylists(data)
      }
    } catch (error) {
      console.error('Помилка завантаження плейлистів:', error)
    } finally {
      setIsLoadingPlaylists(false)
    }
  }

  const fetchPlaylistById = async (id: string) => {
    setIsLoadingPlaylists(true)
    try {
      const response = await apiFetch(`${GATEWAY_URL}/music/playlists/${id}`)
      if (response.ok) {
        const data = await response.json()
        setActivePlaylistDetail(data)
      }
    } catch (error) {
      console.error('Помилка завантаження деталей плейлиста:', error)
    } finally {
      setIsLoadingPlaylists(false)
    }
  }

  const handleCreatePlaylist = async () => {
    if (!newPlaylistTitle.trim()) return
    try {
      const response = await apiFetch(`${GATEWAY_URL}/music/playlists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newPlaylistTitle, isPrivate: false })
      })
      if (response.ok) {
        setNewPlaylistTitle('')
        setIsCreatingPlaylist(false)
        fetchPlaylists()
        showToast('Плейлист створено!')
      }
    } catch (error) {
      console.error('Помилка створення плейлиста:', error)
    }
  }

  const handleDeletePlaylist = async (playlistId: string) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цей плейлист?')) return
    try {
      const response = await apiFetch(`${GATEWAY_URL}/music/playlists/${playlistId}`, { method: 'DELETE' })
      if (response.ok) {
        setActivePlaylistDetail(null)
        fetchPlaylists()
        showToast('Плейлист видалено')
      }
    } catch (error) {
      console.error('Помилка видалення плейлиста:', error)
    }
  }

  const handleTogglePrivacy = async (playlistId: string, currentPrivacy: boolean) => {
    try {
      const response = await apiFetch(`${GATEWAY_URL}/music/playlists/${playlistId}/privacy`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPrivate: !currentPrivacy })
      })
      if (response.ok) {
        fetchPlaylistById(playlistId)
        showToast(`Плейлист тепер ${!currentPrivacy ? 'приватний' : 'публічний'}`)
      }
    } catch (error) {
      console.error('Помилка зміни приватності:', error)
    }
  }

  const openAddTrackModal = async (trackId: string) => {
    await fetchPlaylists()
    setShowPlaylistModal(trackId)
  }

  const addToPlaylist = async (playlistId: string, trackId: string) => {
    try {
      const response = await apiFetch(`${GATEWAY_URL}/music/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackId })
      })
      if (response.ok) {
        const playlistName = playlists.find(p => p.id === playlistId)?.title || 'плейлист'
        setShowPlaylistModal(null)
        showToast(`✓ Додано до «${playlistName}»`)
      } else if (response.status === 409) {
        showToast('Цей трек вже є у плейлисті')
      }
    } catch (error) {
      console.error('Помилка додавання треку:', error)
    }
  }

  const handleRemoveTrackFromPlaylist = async (playlistId: string, trackId: string) => {
    if (!window.confirm('Видалити трек з плейлиста?')) return
    try {
      const response = await apiFetch(`${GATEWAY_URL}/music/playlists/${playlistId}/tracks/${trackId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchPlaylistById(playlistId)
        showToast('Трек видалено з плейлиста')
      }
    } catch (error) {
      console.error('Помилка видалення треку з плейлиста:', error)
    }
  }

  const handlePlayLikedTrack = (track: Track, index: number) => {
    setTracks(likedTracks)
    selectTrack(likedTracks[index])
  }

  const handlePlayPlaylistTrack = (trackDto: PlaylistTrackDto, index: number) => {
    if (!activePlaylistDetail) return
    const mappedTracks: Track[] = activePlaylistDetail.tracks.map(t => ({
      trackId: t.trackId,
      title: t.title,
      artistName: t.artistName,
      durationSeconds: t.durationSeconds,
      audioUrl: `${GATEWAY_URL}/music/tracks/${t.trackId}/stream`,
      coverImageUrl: t.coverUrl,
      fileSizeBytes: 0,
      contentType: 'audio/mpeg',
      uploadedAt: activePlaylistDetail.createdAt || new Date().toISOString(),
      playCount: 0
    }))
    setTracks(mappedTracks)
    selectTrack(mappedTracks[index])
  }

  const handleProfileNameChange = (name: string) => {
    setProfileNameContext(name)
  }

  const handleLogout = async () => await logoutUser()
  const handleGenreClick = (genreName: string) => handleSearchChange(genreName)

  const handleAiMixLaunch = () => {
    if (tracks.length > 0) {
      const shuffled = [...tracks].sort(() => 0.5 - Math.random())
      setTracks(shuffled)
      selectTrack(shuffled[0])
      setActiveTab('Home')
    }
  }

  const homeTracks = showAllTracks ? tracks : tracks.slice(0, 6)

  return (
    <main className="Main2">
      {activeTab === 'Home' && (
        <>
          <img src={BackLogo} className="BackLogo" alt="Background decoration" />

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
              <span className="LisNowTrending">Слухають зараз</span>
              <span className="TrendNowText">У тренді зараз</span>
            </div>
            {tracks.length > 6 && !searchQuery.trim() && (
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
              homeTracks.map((track) => (
                <div
                  key={track.trackId}
                  className={`MusicCard ${currentTrack?.trackId === track.trackId ? 'active-track' : ''}`}
                  onClick={() => selectTrack(track)}
                  style={{ position: 'relative' }}
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
                  <button
                    className="AddToPlaylistBtn"
                    onClick={(e) => { e.stopPropagation(); openAddTrackModal(track.trackId) }}
                    title="Додати до плейлиста"
                  >
                    +
                  </button>
                </div>
              ))
            )}
          </div>

          <AiMixesPanel>
            <div className="MusicCardCont" style={{ border: 'none', padding: 0, background: 'transparent', margin: 0 }}>
              {isLoadingTracks ? (
                <div style={{ color: '#A1A1AA', fontFamily: 'SUSE, sans-serif' }}>Завантаження треків...</div>
              ) : tracks.length === 0 ? (
                <div style={{ color: '#A1A1AA', fontFamily: 'SUSE, sans-serif' }}>Не знайдено жодного треку</div>
              ) : (
                tracks.slice(0, 3).map((track) => (
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
                  { name: 'Pop',        color: 'linear-gradient(135deg, #a855f7, #ec4899)' },
                  { name: 'Rock',       color: 'linear-gradient(135deg, #ef4444, #f97316)' },
                  { name: 'Hip-Hop',    color: 'linear-gradient(135deg, #3b82f6, #06b6d4)' },
                  { name: 'Jazz',       color: 'linear-gradient(135deg, #eab308, #ca8a04)' },
                  { name: 'Electronic', color: 'linear-gradient(135deg, #10b981, #14b8a6)' },
                  { name: 'Ambient',    color: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
                  { name: 'Classical',  color: 'linear-gradient(135deg, #64748b, #475569)' },
                  { name: 'Lo-Fi',      color: 'linear-gradient(135deg, #f43f5e, #fb7185)' },
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
            <div className="SearchResults" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <span className="SubSectionTitle">
                Результати пошуку за запитом "{searchQuery}"
              </span>

              <div className="MusicCardCont">
                {isLoadingTracks && tracks.length === 0 ? (
                  <div style={{ color: '#A1A1AA', fontFamily: 'SUSE, sans-serif' }}>
                    Завантаження результатів...
                  </div>
                ) : tracks.length === 0 ? (
                  <div style={{ color: '#A1A1AA', fontFamily: 'SUSE, sans-serif' }}>
                    Не знайдено жодного треку за запитом "{searchQuery}"
                  </div>
                ) : (
                  tracks.map((track) => (
                    <div
                      key={track.trackId}
                      className={`MusicCard ${currentTrack?.trackId === track.trackId ? 'active-track' : ''}`}
                      onClick={() => selectTrack(track)}
                      style={{ position: 'relative' }}
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
                      <button
                        className="AddToPlaylistBtn"
                        onClick={(e) => { e.stopPropagation(); openAddTrackModal(track.trackId) }}
                        title="Додати до плейлиста"
                      >
                        +
                      </button>
                    </div>
                  ))
                )}
              </div>

              {tracks.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={hasMoreTracks ? currentPage + 1 : currentPage}
                  onPageChange={(page) => fetchTracks(searchQuery, page, false)}
                  isLoading={isLoadingTracks}
                />
              )}

              {!hasMoreTracks && tracks.length > 0 && (
                <div style={{
                  textAlign: 'center',
                  color: '#3f3f46',
                  paddingBottom: '8px',
                  fontSize: '12px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  fontFamily: 'SUSE, sans-serif',
                }}>
                  Всі результати завантажено
                </div>
              )}
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
              <span className="ColGenre">Дії</span>
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
                  <span className="ColGenre">
                    <button
                      className="ActionBtn"
                      onClick={(e) => { e.stopPropagation(); openAddTrackModal(track.trackId) }}
                    >
                      + Плейлист
                    </button>
                  </span>
                  <span className="ColDuration">{formatTime(track.durationSeconds)}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '48px' }}>
            <div className="TrendingNow">
              <div className="ContTextTrendingNow">
                <span className="LisNowTrending">Історія прослуховування</span>
                <span className="TrendNowText">Ваші нещодавно прослухані треки</span>
              </div>
              {historyItems.length > 6 && (
                <button className="ButtonViewAll" onClick={() => setShowAllHistory(!showAllHistory)}>
                  <span className="TextViewAll">{showAllHistory ? 'ЗГОРНУТИ' : 'ДИВИТИСЬ ВСІ'}</span>
                  <img
                    src={Arrow}
                    className="ArrowViewAll"
                    style={{
                      transform: showAllHistory ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s',
                    }}
                    alt="Toggle"
                  />
                </button>
              )}
            </div>

            <div className="MusicCardCont">
              {isLoadingHistory && historyItems.length === 0 ? (
                <div style={{ color: '#A1A1AA', fontFamily: 'SUSE, sans-serif' }}>
                  Завантаження історії...
                </div>
              ) : historyItems.length === 0 ? (
                <div style={{ color: '#A1A1AA', fontFamily: 'SUSE, sans-serif' }}>
                  Історія порожня. Слухайте музику!
                </div>
              ) : (
                (showAllHistory ? historyItems : historyItems.slice(0, 6)).map((track) => (
                  <div
                    key={track.trackId}
                    className={`MusicCard ${currentTrack?.trackId === track.trackId ? 'active-track' : ''}`}
                    onClick={() => selectTrack(track)}
                    style={{ position: 'relative' }}
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
                    <button
                      className="AddToPlaylistBtn"
                      onClick={(e) => { e.stopPropagation(); openAddTrackModal(track.trackId) }}
                      title="Додати до плейлиста"
                    >
                      +
                    </button>
                  </div>
                ))
              )}
            </div>

            {showAllHistory && hasMoreHistory && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button
                  className="AiGenerateBtn"
                  style={{ width: 'auto', padding: '10px 24px' }}
                  onClick={loadMoreHistory}
                  disabled={isLoadingHistory}
                >
                  {isLoadingHistory ? 'Завантаження...' : 'Завантажити ще'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'Playlist' && (
  <div className="PlaylistTabContent">
    {!activePlaylistDetail ? (
      <>
        <div className="SearchHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="SectionTitle">Ваші Плейлисти</span>
          <button
            className="AiGenerateBtn"
            style={{ width: 'auto', padding: '10px 20px', marginTop: 0 }}
            onClick={() => setIsCreatingPlaylist(!isCreatingPlaylist)}
          >
            {isCreatingPlaylist ? 'Скасувати' : '+ Створити'}
          </button>
        </div>

        {isCreatingPlaylist && (
          <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
            <input
              type="text"
              className="SettingsInput"
              placeholder="Введіть назву плейлиста..."
              value={newPlaylistTitle}
              onChange={(e) => setNewPlaylistTitle(e.target.value)}
              style={{ maxWidth: '300px' }}
            />
            <button className="AiGenerateBtn" style={{ width: 'auto' }} onClick={handleCreatePlaylist}>
              Зберегти
            </button>
          </div>
        )}

        {isLoadingPlaylists ? (
          <div style={{ color: '#A1A1AA', fontFamily: 'SUSE, sans-serif' }}>Завантаження плейлистів...</div>
        ) : playlists.length === 0 ? (
          <div className="EmptyStateText">У вас ще немає плейлистів. Створіть свій перший!</div>
        ) : (
          <div className="PlaylistGrid">
            {playlists.map((playlist) => {
              const getCoverUrl = (url: string | null | undefined) => {
                if (!url) return Cover;
                if (url.startsWith('http://') || url.startsWith('https://')) return url;
                return `${GATEWAY_URL}/music/files/${url.replace(/\\/g, '/')}`;
              };

              const coverItems: (string | null)[] = [...playlist.collageCovers];
              while (coverItems.length < 4) coverItems.push(null);

              const hasAnyCover = coverItems.some(url => url !== null);

              return (
                <div
                  key={playlist.id}
                  className="PlaylistCard"
                  style={{ cursor: 'pointer', background: 'transparent', border: 'none' }}
                  onClick={() => fetchPlaylistById(playlist.id)}
                >
                  <div className="PlaylistCollage">
                    {coverItems.map((url, idx) => (
                      <div key={idx} className="PlaylistCollageItem">
                        {url ? (
                          <img
                            src={getCoverUrl(url)}
                            alt="cover"
                            onError={(e) => (e.currentTarget.src = Cover)}
                          />
                        ) : (
                          <div className="PlaylistCollagePlaceholder" />
                        )}
                      </div>
                    ))}
                    {!hasAnyCover && (
                      <div className="PlaylistCollageEmptyIcon">
                        <span className="PlaylistEmptyNote">♪</span>
                      </div>
                    )}
                  </div>
                  <div className="PlaylistCardContent" style={{ marginTop: '12px' }}>
                    <span className="PlaylistCardTitle">{playlist.title}</span>
                    <span className="PlaylistCardDesc">
                      {playlist.description || (playlist.isPrivate ? '🔒 Приватний' : '🌍 Публічний')}
                    </span>
                    <span className="PlaylistCardCount">{playlist.trackCount} треків</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </>
    ) : (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}
              onClick={() => setActivePlaylistDetail(null)}
            >
              <img src={BackLogo} alt="Back" style={{ width: '24px', transform: 'rotate(180deg)' }} />
            </button>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="SectionTitle" style={{ marginBottom: 0 }}>
                {activePlaylistDetail.title} {activePlaylistDetail.isPrivate ? '🔒' : '🌍'}
              </span>
              <span style={{ color: '#A1A1AA', fontSize: '14px', fontFamily: 'SUSE, sans-serif' }}>
                {activePlaylistDetail.trackCount} треків • {formatTime(activePlaylistDetail.totalDurationSeconds)}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="ActionBtn"
              onClick={() => handleTogglePrivacy(activePlaylistDetail.id, activePlaylistDetail.isPrivate)}
            >
              Зробити {activePlaylistDetail.isPrivate ? 'Публічним' : 'Приватним'}
            </button>
            <button
              className="ActionBtn"
              style={{ backgroundColor: '#ef4444', color: 'white' }}
              onClick={() => handleDeletePlaylist(activePlaylistDetail.id)}
            >
              Видалити
            </button>
          </div>
        </div>

        {activePlaylistDetail.tracks.length === 0 ? (
          <div className="EmptyStateText">У цьому плейлисті поки немає треків.</div>
        ) : (
          <div className="LibraryTrackList">
            <div className="LibraryTableHeader">
              <span className="ColHash">#</span>
              <span className="ColTitle">Назва</span>
              <span className="ColGenre">Дії</span>
              <span className="ColDuration">Тривалість</span>
            </div>
            <div className="LibraryTableBody">
              {activePlaylistDetail.tracks.map((track, index) => (
                <div
                  key={track.trackId}
                  className={`LibraryRow ${currentTrack?.trackId === track.trackId ? 'active-row' : ''}`}
                  onClick={() => handlePlayPlaylistTrack(track, index)}
                >
                  <span className="ColHash">{index + 1}</span>
                  <div className="ColTitleDetail">
                    <img src={track.coverUrl || Cover} className="LibraryRowCover" alt="Cover" />
                    <div className="LibraryRowInfo">
                      <span className="RowTitle">{track.title}</span>
                      <span className="RowArtist">{track.artistName}</span>
                    </div>
                  </div>
                  <span className="ColGenre">
                    <button
                      className="ActionBtn"
                      style={{ padding: '4px 8px', fontSize: '12px', background: '#3f3f46' }}
                      onClick={(e) => { e.stopPropagation(); handleRemoveTrackFromPlaylist(activePlaylistDetail.id, track.trackId) }}
                    >
                      Видалити
                    </button>
                  </span>
                  <span className="ColDuration">{formatTime(track.durationSeconds)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    )}
  </div>
)}

      {activeTab === 'Liked' && (
        <div className="LikedTabContent">
          <span className="SectionTitle">Улюблені треки</span>
          {isLoadingLiked ? (
            <div style={{ color: '#A1A1AA', fontFamily: 'SUSE, sans-serif' }}>Завантаження...</div>
          ) : likedTracks.length === 0 ? (
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
                {likedTracks.map((track, index) => (
                  <div
                    key={track.trackId}
                    className={`LibraryRow ${currentTrack?.trackId === track.trackId ? 'active-row' : ''}`}
                    onClick={() => handlePlayLikedTrack(track, index)}
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
            <button className="AiGenerateBtn" onClick={handleAiMixLaunch}>
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

      {showPlaylistModal && (
        <div className="ModalOverlay" onClick={() => setShowPlaylistModal(null)}>
          <div className="PlaylistModal" onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 15px 0', fontFamily: 'SUSE' }}>Оберіть плейлист</h3>
            {playlists.length === 0 ? (
              <p style={{ color: '#A1A1AA' }}>У вас ще немає плейлистів.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                {playlists.map(p => (
                  <button
                    key={p.id}
                    className="PlaylistOptionBtn"
                    onClick={() => addToPlaylist(p.id, showPlaylistModal)}
                  >
                    {p.title} {p.isPrivate ? '🔒' : ''}
                  </button>
                ))}
              </div>
            )}
            <button
              className="SettingsLogoutBtn"
              style={{ marginTop: '15px' }}
              onClick={() => setShowPlaylistModal(null)}
            >
              Скасувати
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div className={`ToastNotification ${toast.visible ? 'toast-show' : 'toast-hide'}`}>
          {toast.message}
        </div>
      )}
    </main>
  )
}