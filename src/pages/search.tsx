import React from 'react'
import { useTranslation } from 'react-i18next'
import { usePlayer } from '../context/player-context'
import Cover from '../assets/Cover.svg'
import { FooterFromJson } from '../components/footer-from-json'
import { Pagination } from '../components/pagination'
import '../app.css'

export const SearchPage: React.FC = () => {
  const { t } = useTranslation()
  const {
    tracks,
    currentTrack,
    isLoadingTracks,
    searchQuery,
    selectTrack,
    handleSearchChange,
    currentPage,
    hasMoreTracks,
    fetchTracks
  } = usePlayer()

  const handleGenreClick = (genreName: string) => {
    handleSearchChange(genreName)
  }

  return (
    <div className="Main2 SearchTabContent">
      <div className="SearchHeader">
        <span className="SectionTitle">{t('search.title', 'Пошук музики')}</span>
      </div>

      {searchQuery.trim() === '' ? (
        <div className="GenreCategories" style={{ width: '100%' }}>
          <span className="SubSectionTitle">{t('search.popular_genres', 'Популярні жанри')}</span>
          <div className="GenreGrid" style={{ marginTop: '20px' }}>
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
                tabIndex={0}
                role="button"
                aria-label={`Genre ${genre.name}`}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleGenreClick(genre.name) }}
              >
                <span className="GenreCardName">{genre.name}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="SearchResults" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <span className="SubSectionTitle">
            {t('search.results', { query: searchQuery })}
          </span>

          <div className="MusicCardCont" style={{ marginTop: '20px' }}>
            {isLoadingTracks && tracks.length === 0 ? (
              <div style={{ color: '#A1A1AA', fontFamily: 'SUSE, sans-serif' }}>
                {t('search.loading', 'Завантаження результатів...')}
              </div>
            ) : tracks.length === 0 ? (
              <div style={{ color: '#A1A1AA', fontFamily: 'SUSE, sans-serif' }}>
                {t('search.not_found', 'Не знайдено жодного треку за запитом "{{query}}"', { query: searchQuery })}
              </div>
            ) : (
              tracks.map((track) => (
                <div
                  key={track.trackId}
                  className={`MusicCard ${currentTrack?.trackId === track.trackId ? 'active-track' : ''}`}
                  onClick={() => selectTrack(track)}
                  tabIndex={0}
                  role="button"
                  aria-label={t('library.play_track', { title: track.title, artist: track.artistName })}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') selectTrack(track) }}
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
        </div>
      )}
      <FooterFromJson />
    </div>
  )
}
