import React, { useState } from 'react'
import type { Track } from '../context/player-context'
import CyberpunkAiCover from '../assets/cyberpunk_ai_cover.png'

interface AiMixDashboardProps {
  tracks: Track[]
  currentTrack: Track | null
  likedTrackIds: string[]
  selectTrack: (track: Track) => void
  handleAiMixLaunch: () => void
  formatTime: (seconds: number) => string
  toggleLiked: () => void
}

export const AiMixDashboard: React.FC<AiMixDashboardProps> = ({
  tracks,
  currentTrack,
  likedTrackIds,
  selectTrack,
  handleAiMixLaunch,
  formatTime,
  toggleLiked,
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [activeModelId, setActiveModelId] = useState<string>('3:2406') // Default Groovra AI Core

  // Filter tracks for popular list based on selected genre
  const popularTracks = tracks.filter(t => {
    if (!selectedGenre) return true
    return t.genre?.toLowerCase() === selectedGenre.toLowerCase()
  }).slice(0, 5) // Show top 5 tracks

  // Event handlers
  const handleGenreClick = (genre: string) => {
    if (selectedGenre === genre) {
      setSelectedGenre(null)
    } else {
      setSelectedGenre(genre)
    }
  }

  const handlePlayTrack = (track: Track) => {
    selectTrack(track)
  }

  const handlePlayAlbum = (genre: string) => {
    const genreTracks = tracks.filter(t => t.genre?.toLowerCase() === genre.toLowerCase())
    if (genreTracks.length > 0) {
      selectTrack(genreTracks[0])
    } else if (tracks.length > 0) {
      selectTrack(tracks[0])
    }
  }

  return (
    <div className="ai-dashboard-container">
      {/* Hero Section Container */}
      <div className="ai-hero-margin">
        <section className="ai-hero-section">
          {/* Mask Group background overlays */}
          <div className="ai-hero-mask-group">
            <div className="ai-hero-mask"></div>
            <div className="ai-hero-gradient-overlay"></div>
          </div>
          <div className="ai-hero-dark-overlay"></div>

          {/* Absolute content container */}
          <div className="ai-hero-container">
            <div className="ai-hero-cover-wrapper">
              <img src={CyberpunkAiCover} className="ai-hero-cover" alt="Cyberpunk AI Playlist Cover" />
              <div className="ai-hero-cover-gradient"></div>
            </div>

            <div className="ai-hero-details">
              <div className="ai-hero-meta-container">
                <span className="ai-badge-generated">
                  <div className="ai-badge-icon-wrapper">
                    <svg viewBox="0 0 24 24" className="ai-badge-icon" fill="currentColor">
                      <path d="M12 2A10 10 0 0 0 2 12a9.9 9.9 0 0 0 3.2 7.3l1.5-1.5A7.9 7.9 0 0 1 4 12a8 8 0 0 1 8-8 8 8 0 0 1 8 8c0 1.9-.7 3.7-1.8 5l1.5 1.5A9.9 9.9 0 0 0 22 12 10 10 0 0 0 12 2m0 4a6 6 0 0 0-6 6c0 1.4.5 2.8 1.4 3.8l1.4-1.4A3.9 3.9 0 0 1 8 12c0-2.2 1.8-4 4-4s4 1.8 4 4c0 .8-.2 1.6-.6 2.2l1.4 1.4A5.9 5.9 0 0 0 18 12a6 6 0 0 0-6-6m0 4a2 2 0 0 0-2 2c0 .5.2.9.5 1.2l1.2-1.2h.6c0-.6-.5-1-1-1" />
                    </svg>
                  </div>
                  <span className="ai-badge-text">ШІ Згенеровано</span>
                </span>
                <div className="ai-hero-updated-wrapper">
                  <span className="ai-hero-updated">Оновлено: Сьогодні</span>
                </div>
              </div>

              <div className="ai-hero-heading">
                <h2 className="ai-hero-title">Кіберпанк ШІ: Нейронні Біти</h2>
              </div>
              
              <div className="ai-hero-desc-container">
                <p className="ai-hero-desc">
                  Пориньте у синтетичні звукові ландшафти, згенеровані нашою найновішою моделлю 'Groovra AI Core'. Ідеально для кодування або нічних поїздок.
                </p>
              </div>

              <div className="ai-hero-stats-margin">
                <div className="ai-hero-stats-container">
                  <div className="ai-hero-listeners">
                    <div className="ai-hero-icon-listeners">
                      <svg viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z" />
                      </svg>
                    </div>
                    <span className="ai-hero-listeners-text">142K Слухачів</span>
                  </div>
                  <div className="ai-hero-duration">
                    <div className="ai-hero-icon-duration">
                      <svg viewBox="0 0 24 24">
                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm3.3 14.88L11 12.43V7h2v4.57l3.57 3.57z" />
                      </svg>
                    </div>
                    <span className="ai-hero-duration-text">2 год 45 хв</span>
                  </div>
                </div>
              </div>

              <div className="ai-hero-actions-margin">
                <div className="ai-hero-actions-container">
                  <button className="ai-btn-listen" onClick={handleAiMixLaunch}>
                    <div className="ai-btn-listen-icon">
                      <svg width="11" height="14" viewBox="0 0 11 14">
                        <path d="M0 14V0L11 7L0 14Z" />
                      </svg>
                    </div>
                    Слухати
                  </button>
                  <button 
                    className="ai-btn-action" 
                    onClick={handleAiMixLaunch}
                    title="Перемішати й запустити"
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46l2.04 2.04V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
                    </svg>
                  </button>
                  <button className="ai-btn-action ai-btn-action-options" title="Опції">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Statistics Dashboard Section */}
      <section className="ai-stats-grid">
        {[
          {
            label: 'ШІ мікси',
            value: '12,450',
            maskId: 'm1',
            iconPath: 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z'
          },
          {
            label: 'Пісні',
            value: '87,320',
            maskId: 'm2',
            iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.47 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15.92c-.02.03-.06.08-.09.08H11v-2h2v1.92zm2.03-5.42L14 13.59c-.58.58-.9 1.41-.9 2.41h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7.9c0-2.27 1.83-4.1 4.1-4.1s4.1 1.83 4.1 4.1c0 .88-.36 1.67-.97 2.22z'
          },
          {
            label: 'Альбоми',
            value: '4,210',
            maskId: 'm3',
            iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.47 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-6h2v6zm0-8h-2V7h2v4z'
          },
          {
            label: 'Години',
            value: '2.8M',
            maskId: 'm4',
            iconPath: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm3.3 14.88L11 12.43V7h2v4.57l3.57 3.57z'
          }
        ].map((card, idx) => (
          <div key={idx} className="ai-stat-card">
            <div className="ai-stat-glow-dot"></div>
            
            <div className="ai-stat-margin">
              <svg viewBox="0 0 24 24" className="ai-stat-icon" fill="none" stroke="#A98FDB" strokeWidth="2">
                <path d={card.iconPath} />
              </svg>
            </div>

            <span className="ai-stat-label">{card.label}</span>
            <span className="ai-stat-value">{card.value}</span>

            <div className="ai-stat-mask-group">
              <div className="ai-stat-mask"></div>
              <div className="ai-stat-gradient-overlay"></div>
            </div>
          </div>
        ))}
      </section>

      {/* Real-time Update Block */}
      <section className="ai-updates-banner">
        <div className="ai-updates-gradient-bg"></div>

        <div className="ai-updates-left">
          <div className="ai-pulse-dot-wrapper">
            <svg viewBox="0 0 24 24" className="ai-pulse-icon" fill="none" stroke="#72DEEF" strokeWidth="2">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.47 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <div className="ai-pulse-border"></div>
          </div>
          <div className="ai-updates-info">
            <span className="ai-updates-title">Створено ШІ сьогодні</span>
            <span className="ai-updates-sub">Дані оновлюються в реальному часі</span>
          </div>
        </div>
        
        <div className="ai-updates-badges">
          <div className="ai-update-badge">
            <span className="ai-badge-count">+142</span>
            <span className="ai-badge-text">нові пісні</span>
          </div>
          <div className="ai-update-badge">
            <span className="ai-badge-count">+23</span>
            <span className="ai-badge-text">нові альбоми</span>
          </div>
          <div className="ai-update-badge">
            <span className="ai-badge-count">+57</span>
            <span className="ai-badge-text">нові мікси</span>
          </div>
        </div>
      </section>

      {/* Trending AI Albums */}
      <section className="ai-albums-section">
        <div className="ai-section-header">
          <div className="ai-section-title-wrapper">
            <div className="ai-section-title-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#A98FDB" strokeWidth="2">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.47 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-6h2v6zm0-8h-2V7h2v4z" />
              </svg>
            </div>
            <h3 className="ai-section-title">Трендові ШІ Альбоми</h3>
          </div>
          <div className="ai-section-link" onClick={() => handlePlayAlbum('synthwave')}>
            <span className="ai-section-link-text">Більше альбомів</span>
            <div className="ai-section-link-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#72DEEF" strokeWidth="2">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="ai-albums-grid">
          {[
            {
              id: 'a1',
              title: 'Neural Odyssey',
              composer: 'DeepAudio V5',
              tracksCount: 12,
              year: 2024,
              genre: 'Electronic',
              color: 'linear-gradient(135deg, #1e1b4b, #311042)',
            },
            {
              id: 'a2',
              title: 'Silicon Soul',
              composer: 'Quantum Sound Engine',
              tracksCount: 8,
              year: 2024,
              genre: 'Lo-Fi',
              color: 'linear-gradient(135deg, #1c1917, #451a03)',
            },
            {
              id: 'a3',
              title: 'Echoes of Void',
              composer: 'Ambient AI',
              tracksCount: 15,
              year: 2023,
              genre: 'Ambient',
              color: 'linear-gradient(135deg, #064e3b, #022c22)',
            },
            {
              id: 'a4',
              title: 'Cyber Synthesis',
              composer: 'Neural Composer',
              tracksCount: 10,
              year: 2024,
              genre: 'Synthwave',
              color: 'linear-gradient(135deg, #172554, #1e1b4b)',
            },
          ].map(album => (
            <div 
              key={album.id} 
              className="ai-album-card"
              onClick={() => handlePlayAlbum(album.genre)}
            >
              <div className="ai-album-cover-wrapper" style={{ background: album.color }}>
                <img src={CyberpunkAiCover} className="ai-album-cover-img" style={{ opacity: 0.7 }} alt={album.title} />
              </div>
              
              <div className="ai-album-info">
                <span className="ai-album-title">{album.title}</span>
                <span className="ai-album-composer">{album.composer}</span>
              </div>
              
              <div className="ai-album-footer">
                <div className="ai-album-footer-container">
                  <span className="ai-album-stats">{album.tracksCount} Треків • {album.year}</span>
                  <div className="ai-album-tag">
                    <span className="ai-album-tag-text">{album.genre}</span>
                  </div>
                </div>
              </div>

              <div className="ai-album-mask-group">
                <div className="ai-album-mask"></div>
                <div className="ai-album-gradient-overlay"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How AI Creates Music Section */}
      <section className="ai-process-container">
        <div className="ai-process-header">
          <h3 className="ai-process-title">Як ШІ створює музику</h3>
          <p className="ai-process-subtitle">
            Наш процес поєднує нейронні мережі з теорією класичної музики для досягнення ідеального звучання.
          </p>
        </div>

        <div className="ai-steps-grid">
          {[
            {
              step: '1',
              title: 'Нейронний аналіз',
              desc: 'ШІ аналізує мільйони патернів для вибору емоційного тону.',
            },
            {
              step: '2',
              title: 'Мелодія та Гармонія',
              desc: 'Генерація унікальних музичних структур у реальному часі.',
            },
            {
              step: '3',
              title: 'Аранжування',
              desc: 'Накладення інструментів та синтетичних звукових шарів.',
            },
            {
              step: '4',
              title: 'Мастерінг',
              desc: 'Фінальна обробка звуку для кришталевої чіткості.',
            },
          ].map(step => (
            <div key={step.step} className="ai-step-card">
              <div className="ai-step-icon-wrapper">
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#72DEEF' }}>{step.step}</span>
              </div>
              <div className="ai-step-info">
                <span className="ai-step-title">{step.title}</span>
                <span className="ai-step-desc">{step.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended AI Mixes */}
      <section className="ai-albums-section">
        <div className="ai-section-header">
          <div className="ai-section-title-wrapper">
            <div className="ai-section-title-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#A98FDB" strokeWidth="2">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.47 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-6h2v6zm0-8h-2V7h2v4z" />
              </svg>
            </div>
            <h3 className="ai-section-title">Рекомендовані ШІ Мікси</h3>
          </div>
          <div className="ai-section-link" onClick={handleAiMixLaunch}>
            <span className="ai-section-link-text">Всі мікси</span>
            <div className="ai-section-link-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#72DEEF" strokeWidth="2">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="ai-mix-scroll-container">
          {[
            { id: 'm1', title: 'Neural Flow', sub: 'Groovra AI Core • Cyber Pop', color: '#a855f7' },
            { id: 'm2', title: 'Quantum Echo', sub: 'Neural Composer • Ambient', color: '#6366f1' },
            { id: 'm3', title: 'Digital Pulse', sub: 'Groovra AI Core • Synthwave', color: '#06b6d4' },
            { id: 'm4', title: 'Digital Echo', sub: 'Neural Composer • Ambient', color: '#10b981' },
            { id: 'm5', title: 'Sound Pulse', sub: 'Groovra AI Core • Synthwave', color: '#ec4899' },
          ].map(mix => (
            <div 
              key={mix.id} 
              className="ai-mix-card"
              onClick={handleAiMixLaunch}
            >
              <div className="ai-mix-image-wrapper" style={{ background: `linear-gradient(135deg, ${mix.color}33, #16161f)` }}>
                <img src={CyberpunkAiCover} className="ai-mix-image" style={{ opacity: 0.5 }} alt={mix.title} />
              </div>
              <div className="ai-mix-card-info">
                <span className="ai-mix-card-title">{mix.title}</span>
                <span className="ai-mix-card-sub">{mix.sub}</span>
              </div>
              <div className="ai-mix-mask-group">
                <div className="ai-mix-mask"></div>
                <div className="ai-mix-gradient-overlay"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Split Layout: Popular Tracks & AI Models */}
      <section className="ai-split-grid" style={{ width: '1104px' }}>
        {/* Left Side: Popular AI Tracks */}
        <div className="ai-popular-tracks">
          <h3 className="ai-genres-title">Популярні ШІ Треки</h3>
          
          <div className="ai-tracks-list-container">
            {popularTracks.length === 0 ? (
              <div style={{ padding: '24px', color: '#71717A', textAlign: 'center' }}>
                Не знайдено треків у цьому жанрі
              </div>
            ) : (
              popularTracks.map(track => (
                <div 
                  key={track.trackId} 
                  className={`ai-track-row ${currentTrack?.trackId === track.trackId ? 'active' : ''}`}
                  onClick={() => handlePlayTrack(track)}
                >
                  <div className="ai-track-row-left">
                    <div className="ai-track-image-wrapper">
                      <img src={track.coverImageUrl || CyberpunkAiCover} alt={track.title} />
                      <div className="ai-track-image-hover">
                        <svg viewBox="0 0 15 18">
                          <path d="M0 18V0L15 9L0 18Z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ai-track-meta">
                      <span className="ai-track-title">{track.title}</span>
                      <span className="ai-track-artist">{track.artistName}</span>
                    </div>
                  </div>

                  <div className="ai-track-row-right">
                    <span className="ai-track-genre">{track.genre || 'POP'}</span>
                    <span className="ai-track-duration">{formatTime(track.durationSeconds)}</span>
                    <button 
                      className="ai-track-heart"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (currentTrack?.trackId === track.trackId) {
                          toggleLiked()
                        } else {
                          selectTrack(track)
                          setTimeout(() => {
                            toggleLiked()
                          }, 50)
                        }
                      }}
                      style={{ color: likedTrackIds.includes(track.trackId) ? 'var(--color-accent-blue)' : 'rgba(255,255,255,0.4)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                      title={likedTrackIds.includes(track.trackId) ? 'Видалити з улюбленого' : 'Додати до улюбленого'}
                    >
                      <svg viewBox="0 0 24 24" fill={likedTrackIds.includes(track.trackId) ? 'var(--color-accent-blue)' : 'none'} style={{ width: '18px', height: '18px' }}>
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Trending Genres Tag Cloud */}
          <div className="ai-genres-section">
            <h4 className="ai-genres-title" style={{ fontSize: '18px' }}>Трендові Жанри</h4>
            <div className="ai-genres-cloud">
              {['Synthwave', 'Cyber Pop', 'Electronic', 'Ambient'].map(genre => (
                <button
                  key={genre}
                  className={`ai-genre-btn ${selectedGenre?.toLowerCase() === genre.toLowerCase() ? 'active' : ''}`}
                  onClick={() => handleGenreClick(genre)}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: AI Models selector */}
        <div className="ai-models-column">
          <h3 className="ai-genres-title">Наші ШІ Моделі</h3>
          
          <div className="ai-models-container">
            {[
              {
                id: '3:2406',
                title: 'Groovra AI Core',
                desc: 'Ритмічні патерни та базові мелодії.',
                accuracy: '98.4%',
                badge: 'Rhythm Expert',
              },
              {
                id: '3:2424',
                title: 'Quantum Sound Engine',
                desc: 'Надскладні текстури та атмосферні ефекти.',
                accuracy: '96.7%',
                badge: 'Ambient King',
              },
              {
                id: '3:2442',
                title: 'DeepAudio V5',
                desc: 'Професійне зведення та вокальний синтез.',
                accuracy: '99.1%',
                badge: 'Vocal Synthesis',
              },
            ].map(model => (
              <div 
                key={model.id}
                className="ai-model-card"
                style={{
                  border: activeModelId === model.id ? '1px solid var(--color-accent-blue)' : '1px solid rgba(255, 255, 255, 0.05)',
                  boxShadow: activeModelId === model.id ? '0 0 15px rgba(114, 222, 239, 0.15)' : 'none',
                }}
                onClick={() => setActiveModelId(model.id)}
              >
                <div className="ai-model-header">
                  <div className="ai-model-icon-wrapper">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 2c1.1 0 2 .9 2 2v1h1c1.1 0 2 .9 2 2v1h1c1.1 0 2 .9 2 2v1c1.1 0 2 .9 2 2s-.9 2-2 2v1c0 1.1-.9 2-2 2h-1v1c0 1.1-.9 2-2 2h-1v1c0 1.1-.9 2-2 2s-2-.9-2-2v-1H9c-1.1 0-2-.9-2-2v-1H6c-1.1 0-2-.9-2-2v-1c-1.1 0-2-.9-2-2s.9-2 2-2V9c0-1.1.9-2 2-2h1V6c0-1.1.9-2 2-2h1V3c0-1.1.9-2 2-2zm-3 8c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm6 0c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
                    </svg>
                  </div>
                  <div className="ai-model-header-texts">
                    <span className="ai-model-title">{model.title}</span>
                  </div>
                </div>
                <p className="ai-model-desc">{model.desc}</p>
                <div className="ai-model-footer">
                  <span className="ai-model-accuracy">Успішність: {model.accuracy}</span>
                  <span className="ai-model-badge">{model.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
