import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { usePlayer, type Track } from '../context/player-context'
import { apiFetch, GATEWAY_URL } from '../api/api-client'
import BackLogo from '../assets/Frame 4.svg'
import Cover from '../assets/Cover.svg'
import { FooterFromJson } from '../components/footer-from-json'
import '../app.css'

export interface PlaylistListItem {
  id: string
  title: string
  description?: string
  isPrivate: boolean
  slug: string
  trackCount: number
  totalDurationSeconds: number
  coverImageUrl?: string
  collageCovers: string[]
  updatedAt: string
}

export interface PlaylistTrackDto {
  trackId: string
  title: string
  artistName: string
  position: number
  coverUrl?: string
  durationSeconds: number
}

export interface PlaylistDetail {
  id: string
  userId: string
  title: string
  description?: string
  slug: string
  coverImageUrl?: string
  trackCount: number
  totalDurationSeconds: number
  isPrivate: boolean
  createdAt: string
  tracks: PlaylistTrackDto[]
}

export function PlaylistsPage(): React.JSX.Element {
  const { t, i18n } = useTranslation()
  const {
    currentTrack,
    selectTrack,
    setTracks,
    formatTime
  } = usePlayer()

  const [playlists, setPlaylists] = useState<PlaylistListItem[]>([])
  const [activePlaylistDetail, setActivePlaylistDetail] = useState<PlaylistDetail | null>(null)
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false)
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false)
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('')
  const [toast, setToast] = useState<{ message: string; visible: boolean } | null>(null)

  const showToast = (message: string) => {
    setToast({ message, visible: true })
    setTimeout(() => {
      setToast(prev => prev ? { ...prev, visible: false } : null)
      setTimeout(() => setToast(null), 400)
    }, 2500)
  }

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
        showToast(i18n.language === 'en' ? 'Playlist created!' : 'Плейлист створено!')
      }
    } catch (error) {
      console.error('Помилка створення плейлиста:', error)
    }
  }

  const handleDeletePlaylist = async (playlistId: string) => {
    const confirmMsg = i18n.language === 'en' 
      ? 'Are you sure you want to delete this playlist?' 
      : 'Ви впевнені, що хочете видалити цей плейлист?'
    if (!window.confirm(confirmMsg)) return
    try {
      const response = await apiFetch(`${GATEWAY_URL}/music/playlists/${playlistId}`, { method: 'DELETE' })
      if (response.ok) {
        setActivePlaylistDetail(null)
        fetchPlaylists()
        showToast(i18n.language === 'en' ? 'Playlist deleted' : 'Плейлист видалено')
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
        const toastMsg = i18n.language === 'en'
          ? `Playlist is now ${!currentPrivacy ? 'private' : 'public'}`
          : `Плейлист тепер ${!currentPrivacy ? 'приватний' : 'публічний'}`
        showToast(toastMsg)
      }
    } catch (error) {
      console.error('Помилка зміни приватності:', error)
    }
  }

  const handleRemoveTrackFromPlaylist = async (playlistId: string, trackId: string) => {
    const confirmMsg = i18n.language === 'en' ? 'Remove track from playlist?' : 'Видалити трек з плейлиста?'
    if (!window.confirm(confirmMsg)) return
    try {
      const response = await apiFetch(`${GATEWAY_URL}/music/playlists/${playlistId}/tracks/${trackId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchPlaylistById(playlistId)
        showToast(i18n.language === 'en' ? 'Track removed' : 'Трек видалено з плейлиста')
      }
    } catch (error) {
      console.error('Помилка видалення треку з плейлиста:', error)
    }
  }

  const handlePlayPlaylistTrack = (_trackDto: PlaylistTrackDto, index: number) => {
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

  useEffect(() => {
    fetchPlaylists()
  }, [])

  return (
    <div className="PlaylistTabContent">
      {!activePlaylistDetail ? (
        <>
          <div className="SearchHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '24px' }}>
            <span className="SectionTitle" style={{ marginBottom: 0 }}>{t('main.playlists_title')}</span>
            <button
              className="AiGenerateBtn"
              style={{ width: 'auto', padding: '10px 20px', marginTop: 0 }}
              onClick={() => setIsCreatingPlaylist(!isCreatingPlaylist)}
            >
              {isCreatingPlaylist 
                ? (i18n.language === 'en' ? 'Cancel' : 'Скасувати') 
                : (i18n.language === 'en' ? '+ Create' : '+ Створити')}
            </button>
          </div>

          {isCreatingPlaylist && (
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
              <input
                type="text"
                className="SettingsInput"
                placeholder={i18n.language === 'en' ? 'Enter playlist name...' : 'Введіть назву плейлиста...'}
                value={newPlaylistTitle}
                onChange={(e) => setNewPlaylistTitle(e.target.value)}
                style={{ maxWidth: '300px' }}
              />
              <button className="AiGenerateBtn" style={{ width: 'auto' }} onClick={handleCreatePlaylist}>
                {i18n.language === 'en' ? 'Save' : 'Зберегти'}
              </button>
            </div>
          )}

          {isLoadingPlaylists ? (
            <div style={{ color: '#A1A1AA', fontFamily: 'SUSE, sans-serif' }}>
              {i18n.language === 'en' ? 'Loading playlists...' : 'Завантаження плейлистів...'}
            </div>
          ) : playlists.length === 0 ? (
            <div className="EmptyStateText">
              {i18n.language === 'en' ? 'You don\'t have playlists yet. Create your first one!' : 'У вас ще немає плейлистів. Створіть свій перший!'}
            </div>
          ) : (
            <div className="PlaylistGrid">
              {playlists.map((playlist) => {
                const getCoverUrl = (url: string | null | undefined) => {
                  if (!url) return Cover
                  if (url.startsWith('http://') || url.startsWith('https://')) return url
                  return `${GATEWAY_URL}/music/files/${url.replace(/\\/g, '/')}`
                }

                const coverItems: (string | null)[] = [...playlist.collageCovers]
                while (coverItems.length < 4) coverItems.push(null)

                const hasAnyCover = coverItems.some(url => url !== null)

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
                        {playlist.description || (playlist.isPrivate 
                          ? (i18n.language === 'en' ? '🔒 Private' : '🔒 Приватний') 
                          : (i18n.language === 'en' ? '🌍 Public' : '🌍 Публічний'))}
                      </span>
                      <span className="PlaylistCardCount">
                        {t('tracks_count', { count: playlist.trackCount })}
                      </span>
                    </div>
                  </div>
                )
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
                  {t('tracks_count', { count: activePlaylistDetail.trackCount })} • {formatTime(activePlaylistDetail.totalDurationSeconds)}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="ActionBtn"
                onClick={() => handleTogglePrivacy(activePlaylistDetail.id, activePlaylistDetail.isPrivate)}
              >
                {activePlaylistDetail.isPrivate 
                  ? (i18n.language === 'en' ? 'Make Public' : 'Зробити Публічним') 
                  : (i18n.language === 'en' ? 'Make Private' : 'Зробити Приватним')}
              </button>
              <button
                className="ActionBtn"
                style={{ backgroundColor: '#ef4444', color: 'white' }}
                onClick={() => handleDeletePlaylist(activePlaylistDetail.id)}
              >
                {i18n.language === 'en' ? 'Delete' : 'Видалити'}
              </button>
            </div>
          </div>

          {activePlaylistDetail.tracks.length === 0 ? (
            <div className="EmptyStateText">
              {i18n.language === 'en' ? 'There are no tracks in this playlist yet.' : 'У цьому плейлисті поки немає треків.'}
            </div>
          ) : (
            <div className="LibraryTrackList">
              <div className="LibraryTableHeader">
                <span className="ColHash">#</span>
                <span className="ColTitle">{t('library.song_title')}</span>
                <span className="ColGenre">{i18n.language === 'en' ? 'Actions' : 'Дії'}</span>
                <span className="ColDuration">{t('library.duration')}</span>
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
                        {i18n.language === 'en' ? 'Delete' : 'Видалити'}
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

      {toast && (
        <div className={`ToastNotification ${toast.visible ? 'toast-show' : 'toast-hide'}`}>
          {toast.message}
        </div>
      )}

      <FooterFromJson />
    </div>
  )
}
