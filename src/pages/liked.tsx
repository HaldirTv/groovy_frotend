import React from 'react'
import { useTranslation } from 'react-i18next'
import { usePlayer } from '../context/player-context'
import Cover from '../assets/Cover.svg'
import { FooterFromJson } from '../components/footer-from-json'
import '../app.css'

export const LikedPage: React.FC = () => {
  const { t } = useTranslation()
  const {
    tracks,
    currentTrack,
    likedTrackIds,
    selectTrack,
    formatTime
  } = usePlayer()

  const likedTracks = tracks.filter(t => likedTrackIds.includes(t.trackId))

  return (
    <div className="LikedTabContent">
      <span className="SectionTitle">{t('liked.title')}</span>
      {likedTracks.length === 0 ? (
        <div className="EmptyStateText">{t('liked.empty')}</div>
      ) : (
        <div className="LibraryTrackList">
          <div className="LibraryTableHeader">
            <span className="ColHash">#</span>
            <span className="ColTitle">{t('library.song_title')}</span>
            <span className="ColGenre">{t('library.genre')}</span>
            <span className="ColDuration">{t('library.duration')}</span>
          </div>
          <div className="LibraryTableBody">
            {likedTracks.map((track, index) => (
              <div
                key={track.trackId}
                className={`LibraryRow ${currentTrack?.trackId === track.trackId ? 'active-row' : ''}`}
                onClick={() => selectTrack(track)}
                tabIndex={0}
                role="button"
                aria-label={t('library.play_track', { title: track.title, artist: track.artistName })}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') selectTrack(track) }}
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
      <FooterFromJson />
    </div>
  )
}
