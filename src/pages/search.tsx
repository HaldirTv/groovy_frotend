import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { usePlayer } from '../context/player-context'
import Cover from '../assets/Cover.svg'
import { FooterFromJson } from '../components/footer-from-json'
import '../app.css'

// Import Figma-exported search category background images
import artistsImg from '../assets/search-artists.png'
import musicImg from '../assets/search-music.png'
import podcastsImg from '../assets/search-podcasts.png'
import playlistsImg from '../assets/search-playlists.png'
import albumsImg from '../assets/search-albums.png'
import popularImg from '../assets/search-popular.png'
import noResultsSvg from '../assets/no-results.svg'

export const SearchPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const {
    tracks,
    currentTrack,
    isLoadingTracks,
    searchQuery,
    selectTrack
  } = usePlayer()

  const handleGenreClick = () => {
    navigate('/track')
  }

  return (
    <div className="SearchTabContent">
      <div className="SearchSeparator" />
      {searchQuery.trim() === '' ? (
        <div className="GenreCategories" style={{ width: '100%' }}>
          <h1 className="CategoryLabel">{t('search.category_title')}</h1>
          <div className="CategoryGrid">
            {[
              { name: t('search.categories.artists'), image: artistsImg },
              { name: t('search.categories.music'), image: musicImg },
              { name: t('search.categories.podcasts'), image: podcastsImg },
              { name: t('search.categories.playlists'), image: playlistsImg },
              { name: t('search.categories.albums'), image: albumsImg },
              { name: t('search.categories.popular'), image: popularImg }
            ].map(genre => (
              <div
                key={genre.name}
                className="CategoryCard"
                onClick={() => handleGenreClick()}
                tabIndex={0}
                role="button"
                aria-label={`Category ${genre.name}`}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleGenreClick() }}
              >
                <div className="image">
                  <img className="rectangle" alt="Rectangle" src={genre.image} />
                </div>
                <span className="CategoryCardName">{genre.name}</span>
                <div className="CategoryCardHighlight" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="SearchResults">
          <span className="SubSectionTitle">{t('search.results', { query: searchQuery })}</span>

          <div className="MusicCardCont">
            {isLoadingTracks ? (
              <div style={{ color: '#A1A1AA', fontFamily: 'SUSE, sans-serif' }}>{t('search.loading')}</div>
            ) : tracks.length === 0 ? (
              <div className="NoResultsLayout">
                <div className="NoResultsTextSide">
                  <h1 className="NoResultsTitle">Нажаль за вашим запитом нічого не знайдено</h1>
                  <div className="NoResultsSubTexts">
                    <p className="NoResultsSubText">Перевірте ваш запит на наявність помилок</p>
                    <p className="NoResultsSubText">Спробуйте ввести інші ключові слова</p>
                    <p className="NoResultsSubText">Можливо ваш запит містить теми заборонені законом</p>
                  </div>
                </div>
                <div className="NoResultsImageSide">
                  <img className="NoResultsCloud" alt="No results cloud illustration" src={noResultsSvg} />
                </div>
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
      <FooterFromJson />
    </div>
  )
}
