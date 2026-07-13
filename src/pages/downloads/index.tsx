import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { usePlayer } from '../../context/player-context'
import type { Track } from '../../context/player-context'
import searchIcon from './icon.svg'
import { Download02 } from './Download02'
import { FooterFromJson } from '../../components/footer-from-json'
import './downloads.css'

const DECORATIVE_GRADIENTS = [
  'linear-gradient(135deg, #72DEEF 0%, #1A1C1C 100%)',
  'linear-gradient(135deg, #A98FDB 0%, #0d0d12 100%)',
  'linear-gradient(135deg, #71deef 0%, #A98FDB 100%)',
  'linear-gradient(135deg, #1A1C1C 0%, #72DEEF 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
  'linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)',
  'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  'linear-gradient(135deg, #fda085 0%, #f6d365 100%)',
  'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
  'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
  'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)'
]

interface Recommendation {
  id: string
  title: string
  artistName: string
  durationSeconds: number
  fileSizeBytes: number
  genre?: string
}

export const DownloadsPage = (): React.JSX.Element => {
  const { t, i18n } = useTranslation()
  const {
    tracks,
    currentTrack,
    isPlaying,
    selectTrack,
    togglePlayPause,
    formatTime
  } = usePlayer()

  const [activeCategory, setActiveCategory] = useState<'songs' | 'playlists' | 'albums' | null>(null)

  const [downloadStatus, setDownloadStatus] = useState<Record<string, 'idle' | 'loading' | 'success'>>(() => {
    try {
      const saved = localStorage.getItem('downloads_recommendation_status')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  const [downloadedRecommendations, setDownloadedRecommendations] = useState<Track[]>(() => {
    try {
      const saved = localStorage.getItem('downloads_recommendation_tracks')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [deletedContextTrackIds, setDeletedContextTrackIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('downloads_deleted_context_track_ids')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('downloads_recommendation_status', JSON.stringify(downloadStatus))
  }, [downloadStatus])

  useEffect(() => {
    localStorage.setItem('downloads_recommendation_tracks', JSON.stringify(downloadedRecommendations))
  }, [downloadedRecommendations])

  useEffect(() => {
    localStorage.setItem('downloads_deleted_context_track_ids', JSON.stringify(deletedContextTrackIds))
  }, [deletedContextTrackIds])

  const recommendations: Recommendation[] = [
    { id: 'rec-1', title: 'Beetlbum', artistName: 'Blur', durationSeconds: 302, fileSizeBytes: 7240000, genre: 'Alternative' },
    { id: 'rec-2', title: 'Alison', artistName: 'Slowdive', durationSeconds: 231, fileSizeBytes: 5540000, genre: 'Shoegaze' },
    { id: 'rec-3', title: 'Gemetry Gates', artistName: 'The smiths', durationSeconds: 215, fileSizeBytes: 5160000, genre: 'Indie' },
    { id: 'rec-4', title: '100', artistName: 'Dean Blunt', durationSeconds: 153, fileSizeBytes: 3670000, genre: 'Experimental' },
    { id: 'rec-5', title: 'Louise', artistName: 'Tv Girl', durationSeconds: 194, fileSizeBytes: 4650000, genre: 'Indie Pop' },
    { id: 'rec-6', title: 'In the garage', artistName: 'Weezer', durationSeconds: 235, fileSizeBytes: 5640000, genre: 'Alternative' }
  ]

  const allDownloadedSongs = [...downloadedRecommendations, ...tracks].filter(
    track => !deletedContextTrackIds.includes(track.trackId)
  )

  const getUpdatedDaysAgo = (count: number) => {
    const updatedWord = i18n.language === 'en' ? 'updated' : 'оновлено'
    return `${updatedWord} ${t('daysAgo', { count })}`
  }

  const getUpdatedWeeksAgo = (count: number) => {
    const updatedWord = i18n.language === 'en' ? 'updated' : 'оновлено'
    return `${updatedWord} ${t('weeksAgo', { count })}`
  }

  const mockPlaylists = [
    { id: 'p1', title: 'Вечірній вайб', tracksCount: 8, updateText: getUpdatedDaysAgo(2), color: 'linear-gradient(135deg, #1e1b4b, #311042)', tracks: tracks.slice(0, 3) },
    { id: 'p2', title: 'Енергійний мікс', tracksCount: 12, updateText: getUpdatedDaysAgo(5), color: 'linear-gradient(135deg, #1c1917, #451a03)', tracks: tracks.slice(1, 4) },
    { id: 'p3', title: 'Релакс', tracksCount: 6, updateText: getUpdatedWeeksAgo(1), color: 'linear-gradient(135deg, #064e3b, #022c22)', tracks: tracks.slice(2, 5) }
  ]

  const mockAlbums = [
    { id: 'a1', title: 'Aura Vibes', artist: 'Groovra AI', tracksCount: 10, updateText: getUpdatedWeeksAgo(1), tracks: tracks.slice(0, 4) },
    { id: 'a2', title: 'Neon Shadows', artist: 'Lofi Maker', tracksCount: 14, updateText: getUpdatedWeeksAgo(2), tracks: tracks.slice(1, 5) }
  ]

  const renderCollage = (itemTracks: Track[], offset = 0) => {
    return (
      <>
        {[0, 1, 2, 3].map(index => {
          const track = itemTracks[index]
          const gradientIndex = (offset + index) % DECORATIVE_GRADIENTS.length
          
          if (track && track.coverImageUrl) {
            return (
              <img
                key={index}
                className="downloads-collage-img"
                src={track.coverImageUrl}
                alt={track.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                  const sibling = (e.target as HTMLImageElement).nextElementSibling as HTMLElement
                  if (sibling) sibling.style.display = 'flex'
                }}
              />
            )
          }

          return (
            <div
              key={index}
              className="downloads-gradient-placeholder"
              style={{ background: DECORATIVE_GRADIENTS[gradientIndex] }}
            />
          )
        })}
      </>
    )
  }

  const handleRowClick = (track: Track) => {
    if (currentTrack?.trackId === track.trackId) {
      togglePlayPause()
    } else {
      selectTrack(track)
    }
  }

  const handleDownload = (rec: Recommendation) => {
    if (downloadStatus[rec.id] === 'success' || downloadStatus[rec.id] === 'loading') return

    setDownloadStatus(prev => ({ ...prev, [rec.id]: 'loading' }))

    setTimeout(() => {
      setDownloadStatus(prev => ({ ...prev, [rec.id]: 'success' }))

      const newTrack: Track = {
        trackId: rec.id,
        title: rec.title,
        artistName: rec.artistName,
        durationSeconds: rec.durationSeconds,
        fileSizeBytes: rec.fileSizeBytes,
        genre: rec.genre || 'Indie',
        contentType: 'audio/mpeg',
        audioUrl: '', 
        uploadedAt: new Date().toISOString(),
        playCount: 0
      }

      setDownloadedRecommendations(prev => [newTrack, ...prev])
    }, 1500)
  }

  const handleDeleteSong = (e: React.MouseEvent, track: Track) => {
    e.stopPropagation() 
    
    if (track.trackId.startsWith('rec-')) {
      setDownloadedRecommendations(prev => prev.filter(t => t.trackId !== track.trackId))
      setDownloadStatus(prev => {
        const next = { ...prev }
        delete next[track.trackId]
        return next
      })
    } else {
      setDeletedContextTrackIds(prev => [...prev, track.trackId])
    }
  }

  return (
    <div className="downloads-page">
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />
      <div className="bg-glow bg-glow-3" />

      <div className="downloads-layout">
        <div className="downloads-wrapper">
          <div className="downloads-top-divider" />

          {activeCategory === null && (
            <div className="downloads-header-row">
              <h1 className="downloads-title">{t('downloads.title')}</h1>
              <div className="search">
                <img className="icon" alt="Search" src={searchIcon} />
              </div>
            </div>
          )}

          {activeCategory === null && (
            <div className="downloads-categories-list">
              <div
                className="downloads-category-card"
                onClick={() => setActiveCategory('songs')}
                tabIndex={0}
                aria-label={t('downloads.categories_songs')}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveCategory('songs') }}
              >
                <div className="downloads-collage-frame">
                  {renderCollage(allDownloadedSongs, 0)}
                </div>
                <div className="downloads-category-info">
                  <h2 className="downloads-category-name">{t('downloads.categories_songs')}</h2>
                  <p className="downloads-category-update">{t('downloads.updated_today')}</p>
                </div>
              </div>

              <div
                className="downloads-category-card"
                onClick={() => setActiveCategory('playlists')}
                tabIndex={0}
                aria-label={t('downloads.categories_playlists')}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveCategory('playlists') }}
              >
                <div className="downloads-collage-frame">
                  {renderCollage(tracks, 4)}
                </div>
                <div className="downloads-category-info">
                  <h2 className="downloads-category-name">{t('downloads.categories_playlists')}</h2>
                  <p className="downloads-category-update">{getUpdatedDaysAgo(2)}</p>
                </div>
              </div>

              <div
                className="downloads-category-card"
                onClick={() => setActiveCategory('albums')}
                tabIndex={0}
                aria-label={t('downloads.categories_albums')}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveCategory('albums') }}
              >
                <div className="downloads-collage-frame">
                  {renderCollage(tracks, 8)}
                </div>
                <div className="downloads-category-info">
                  <h2 className="downloads-category-name">{t('downloads.categories_albums')}</h2>
                  <p className="downloads-category-update">{getUpdatedWeeksAgo(1)}</p>
                </div>
              </div>
            </div>
          )}

          {activeCategory === 'songs' && (
            <div className="downloads-detail-container">
              <button className="downloads-back-btn" onClick={() => setActiveCategory(null)}>
                <svg className="downloads-back-arrow" viewBox="0 0 24 24">
                  <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t('downloads.back_btn')}
              </button>

              <div className="downloads-detail-header">
                <div className="downloads-collage-frame" style={{ width: 100, height: 100 }}>
                  {renderCollage(allDownloadedSongs, 0)}
                </div>
                <div className="downloads-detail-title-group">
                  <h2 className="downloads-detail-title">{t('downloads.categories_songs')}</h2>
                  <span className="downloads-detail-count">{t('tracks_count', { count: allDownloadedSongs.length })}</span>
                </div>
              </div>

              {allDownloadedSongs.length === 0 ? (
                <div className="downloads-empty-state">{t('downloads.empty_state')}</div>
              ) : (
                <div className="downloads-items-list">
                  {allDownloadedSongs.map((track, index) => {
                    const isCurrent = currentTrack?.trackId === track.trackId
                    const isPlayingTrack = isCurrent && isPlaying
                    const fileSizeMB = (track.fileSizeBytes / (1024 * 1024)).toFixed(1)

                    return (
                      <div
                        key={track.trackId}
                        className={`downloads-item-row ${isCurrent ? 'active' : ''}`}
                        onClick={() => handleRowClick(track)}
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleRowClick(track) }}
                      >
                        <span className="downloads-row-index">{index + 1}</span>
                        <img
                          className="downloads-row-cover"
                          src={track.coverImageUrl || '/src/assets/Cover.svg'}
                          alt="Cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/src/assets/Cover.svg' }}
                        />
                        <div className="downloads-row-info">
                          <span className="downloads-row-title">{track.title}</span>
                          <span className="downloads-row-artist">{track.artistName}</span>
                        </div>
                        <div className="downloads-row-meta">
                          <span className="downloads-row-size">{fileSizeMB} MB</span>
                          <span className="downloads-row-duration">{formatTime(track.durationSeconds)}</span>
                          <button
                            className="downloads-row-play-btn"
                            aria-label={isPlayingTrack ? t('player.pause') : t('player.play')}
                          >
                            {isPlayingTrack ? (
                              <svg className="downloads-row-play-icon" viewBox="0 0 24 24">
                                <rect x="4" y="4" width="4" height="16" />
                                <rect x="14" y="4" width="4" height="16" />
                              </svg>
                            ) : (
                              <svg className="downloads-row-play-icon" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            )}
                          </button>

                          <button
                            className="downloads-row-delete-btn"
                            onClick={(e) => handleDeleteSong(e, track)}
                            aria-label={t('downloads.delete')}
                            title={t('downloads.delete')}
                          >
                            <svg className="downloads-row-delete-icon" viewBox="0 0 24 24">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {activeCategory === 'playlists' && (
            <div className="downloads-detail-container">
              <button className="downloads-back-btn" onClick={() => setActiveCategory(null)}>
                <svg className="downloads-back-arrow" viewBox="0 0 24 24">
                  <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t('downloads.back_btn')}
              </button>

              <div className="downloads-detail-header">
                <div className="downloads-collage-frame" style={{ width: 100, height: 100 }}>
                  {renderCollage(tracks, 4)}
                </div>
                <div className="downloads-detail-title-group">
                  <h2 className="downloads-detail-title">{t('downloads.categories_playlists')}</h2>
                  <span className="downloads-detail-count">{t('playlists_count', { count: mockPlaylists.length })}</span>
                </div>
              </div>

              {mockPlaylists.length === 0 ? (
                <div className="downloads-empty-state">{t('downloads.empty_state')}</div>
              ) : (
                <div className="downloads-items-list">
                  {mockPlaylists.map((playlist, index) => (
                    <div
                      key={playlist.id}
                      className="downloads-item-row"
                      onClick={() => {
                        if (playlist.tracks.length > 0) {
                          selectTrack(playlist.tracks[0])
                        }
                      }}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          if (playlist.tracks.length > 0) selectTrack(playlist.tracks[0])
                        }
                      }}
                    >
                      <span className="downloads-row-index">{index + 1}</span>
                      <div
                        className="downloads-row-cover"
                        style={{ background: playlist.color }}
                      />
                      <div className="downloads-row-info">
                        <span className="downloads-row-title">{playlist.title}</span>
                        <span className="downloads-row-artist">{playlist.updateText}</span>
                      </div>
                      <div className="downloads-row-meta">
                        <span className="downloads-row-duration" style={{ width: 100 }}>{t('tracks_count', { count: playlist.tracksCount })}</span>
                        <button className="downloads-row-play-btn" aria-label={t('downloads.play_playlist')}>
                          <svg className="downloads-row-play-icon" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeCategory === 'albums' && (
            <div className="downloads-detail-container">
              <button className="downloads-back-btn" onClick={() => setActiveCategory(null)}>
                <svg className="downloads-back-arrow" viewBox="0 0 24 24">
                  <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t('downloads.back_btn')}
              </button>

              <div className="downloads-detail-header">
                <div className="downloads-collage-frame" style={{ width: 100, height: 100 }}>
                  {renderCollage(tracks, 8)}
                </div>
                <div className="downloads-detail-title-group">
                  <h2 className="downloads-detail-title">{t('downloads.categories_albums')}</h2>
                  <span className="downloads-detail-count">{t('playlists_count', { count: mockAlbums.length })}</span>
                </div>
              </div>

              {mockAlbums.length === 0 ? (
                <div className="downloads-empty-state">{t('downloads.empty_state')}</div>
              ) : (
                <div className="downloads-items-list">
                  {mockAlbums.map((album, index) => (
                    <div
                      key={album.id}
                      className="downloads-item-row"
                      onClick={() => {
                        if (album.tracks.length > 0) {
                          selectTrack(album.tracks[0])
                        }
                      }}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          if (album.tracks.length > 0) selectTrack(album.tracks[0])
                        }
                      }}
                    >
                      <span className="downloads-row-index">{index + 1}</span>
                      <div
                        className="downloads-row-cover"
                        style={{ background: DECORATIVE_GRADIENTS[(index + 3) % DECORATIVE_GRADIENTS.length] }}
                      />
                      <div className="downloads-row-info">
                        <span className="downloads-row-title">{album.title}</span>
                        <span className="downloads-row-artist">{album.artist} • {album.updateText}</span>
                      </div>
                      <div className="downloads-row-meta">
                        <span className="downloads-row-duration" style={{ width: 100 }}>{t('tracks_count', { count: album.tracksCount })}</span>
                        <button className="downloads-row-play-btn" aria-label={t('downloads.play_album')}>
                          <svg className="downloads-row-play-icon" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="downloads-divider-line" />

        <aside className="downloads-right-panel">
          <h2 className="recommendations-title">{t('downloads.smart_title')}</h2>
          <p className="recommendations-desc">
            {t('downloads.smart_desc')}
          </p>

          <div className="recommendations-list">
            {recommendations.map((rec, index) => {
              const status = downloadStatus[rec.id] || 'idle'

              return (
                <div key={rec.id} className="recommendation-item">
                  <div
                    className="recommendation-cover"
                    style={{ background: DECORATIVE_GRADIENTS[(index + 1) % DECORATIVE_GRADIENTS.length] }}
                  />
                  
                  <div className="recommendation-info">
                    <h3 className="recommendation-name">{rec.title}</h3>
                    <span className="recommendation-artist">{rec.artistName}</span>
                  </div>

                  <button
                    className="recommendation-download-btn"
                    onClick={() => handleDownload(rec)}
                    disabled={status !== 'idle'}
                    aria-label={`Download ${rec.title}`}
                    title={status === 'success' ? t('downloads.downloaded') : t('downloads.download')}
                  >
                    {status === 'idle' && (
                      <Download02 className="recommendation-download-icon" color="#A98FDB" />
                    )}
                    {status === 'loading' && (
                      <div className="recommendation-loading-spinner" />
                    )}
                    {status === 'success' && (
                      <svg className="recommendation-success-icon" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </aside>
      </div>
      <FooterFromJson />
    </div>
  )
}

export const Box = DownloadsPage
