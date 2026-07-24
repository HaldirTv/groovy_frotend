import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetLikedTracksQuery } from '../store/api/tracksApi'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setCurrentTrack, setQueue, setIsPlaying } from '../store/slices/playerSlice'
import { TrackCover } from '../components/common/TrackCover'
import { FooterFromJson } from '../components/footer-from-json'
import { AddToPlaylistButton } from '../components/AddToPlaylistButton'
import { Pagination } from '../components/pagination'
import Loader from '../components/Loader'
import type { Track } from '../context/player-context'
import '../app.css'

const PAGE_SIZE = 10

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

export const LikedPage: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const currentTrack = useAppSelector((state) => state.player.currentTrack)
  const [currentPage, setCurrentPage] = useState(1)

  const { data: likedTracks = [], isLoading } = useGetLikedTracksQuery()

  const handleSelectTrack = (track: Track) => {
    dispatch(setQueue(likedTracks))
    dispatch(setCurrentTrack(track))
    dispatch(setIsPlaying(true))
  }

  const totalPages = Math.max(1, Math.ceil(likedTracks.length / PAGE_SIZE))
  const displayedTracks = likedTracks.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="LikedTabContent">
      <span className="SectionTitle">{t('liked.title')}</span>
      {likedTracks.length === 0 ? (
        <div className="EmptyStateText">{t('liked.empty')}</div>
      ) : (
        <>
          <div className="LibraryTrackList">
            <div className="LibraryTableHeader">
              <span className="ColHash">#</span>
              <span className="ColTitle">{t('library.song_title')}</span>
              <span className="ColGenre">{t('library.actions')}</span>
              <span className="ColDuration">{t('library.duration')}</span>
            </div>
            <div className="LibraryTableBody">
              {displayedTracks.map((track, index) => (
                <div
                  key={track.trackId}
                  className={`LibraryRow ${currentTrack?.trackId === track.trackId ? 'active-row' : ''}`}
                  onClick={() => handleSelectTrack(track)}
                  tabIndex={0}
                  role="button"
                  aria-label={t('library.play_track', { title: track.title, artist: track.artistName })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleSelectTrack(track)
                  }}
                >
                  <span className="ColHash">{(currentPage - 1) * PAGE_SIZE + index + 1}</span>
                  <div className="ColTitleDetail">
                    <TrackCover src={track.coverImageUrl} className="LibraryRowCover" alt={track.title} />
                    <div className="LibraryRowInfo">
                      <span className="RowTitle">{track.title}</span>
                      <span className="RowArtist">{track.artistName}</span>
                    </div>
                  </div>
                  <span className="ColGenre">
                    <AddToPlaylistButton trackId={track.trackId} className="ActionBtn" />
                  </span>
                  <span className="ColDuration">{formatTime(track.durationSeconds)}</span>
                </div>
              ))}
            </div>
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </>
      )}
      <FooterFromJson />
    </div>
  )
}
