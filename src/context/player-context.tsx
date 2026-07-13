import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react'
import { useAudioStream } from '../hooks/use-audio-stream'
import { apiFetch, GATEWAY_URL } from '../api/api-client'

export interface Track {
  trackId: string
  title: string
  artistName: string
  album?: string
  genre?: string
  durationSeconds: number
  fileSizeBytes: number
  contentType: string
  audioUrl: string
  coverImageUrl?: string
  uploadedAt: string
  playCount: number
}

interface PlayerContextType {
  tracks: Track[]
  currentTrack: Track | null
  isPlaying: boolean
  volume: number
  isMuted: boolean
  currentTime: number
  duration: number
  isShuffle: boolean
  isRepeat: boolean
  isLoadingTracks: boolean
  searchQuery: string
  likedTrackIds: string[]
  isLiked: boolean
  audioUrl: string | null
  audioRef: React.RefObject<HTMLAudioElement | null>
  activeTab: string
  setActiveTab: (tab: string) => void
  selectTrack: (track: Track) => void
  togglePlayPause: () => void
  playNext: () => void
  playPrevious: () => void
  toggleShuffle: () => void
  toggleRepeat: () => void
  toggleMute: () => void
  applyVolume: (newVolume: number) => void
  seekTo: (percent: number) => void
  handleSearchChange: (query: string) => void
  toggleLiked: () => void
  formatTime: (seconds: number) => string
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>
  setCurrentTrack: React.Dispatch<React.SetStateAction<Track | null>>
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

const normalizeUrl = (url?: string): string | undefined => {
  if (!url) return undefined
  return url.replace(/https?:\/\/localhost:7176/g, '')
}

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<Track[]>([])
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(70)
  const [isMuted, setIsMuted] = useState(false)
  const [prevVolume, setPrevVolume] = useState(70)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isShuffle, setIsShuffle] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isLoadingTracks, setIsLoadingTracks] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('Home')

  const [likedTrackIds, setLikedTrackIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('likedTrackIds')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { audioUrl } = useAudioStream(currentTrack ? currentTrack.trackId : null)

  const isLiked = currentTrack ? likedTrackIds.includes(currentTrack.trackId) : false

  useEffect(() => {
    localStorage.setItem('likedTrackIds', JSON.stringify(likedTrackIds))
  }, [likedTrackIds])

  const toggleLiked = () => {
    if (!currentTrack) return
    setLikedTrackIds(prev =>
      prev.includes(currentTrack.trackId)
        ? prev.filter(id => id !== currentTrack.trackId)
        : [...prev, currentTrack.trackId]
    )
  }

  const fetchTracks = useCallback(async (search = '') => {
    setIsLoadingTracks(true)
    try {
      const url = search
        ? `${GATEWAY_URL}/music/tracks?search=${encodeURIComponent(search)}`
        : `${GATEWAY_URL}/music/tracks`
      const response = await apiFetch(url)
      if (response.ok) {
        const data: Track[] = await response.json()
        const normalizedData = data.map(track => ({
          ...track,
          coverImageUrl: normalizeUrl(track.coverImageUrl),
          audioUrl: normalizeUrl(track.audioUrl) || track.audioUrl,
        }))
        setTracks(normalizedData)
        if (normalizedData.length > 0 && !currentTrack) {
          setCurrentTrack(normalizedData[0])
        }
      }
    } catch (err) {
      console.error("Error fetching tracks:", err)
    } finally {
      setIsLoadingTracks(false)
    }
  }, [currentTrack])

  useEffect(() => {
    fetchTracks()
  }, [])

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    fetchTracks(query)
  }

  const applyVolume = useCallback((newVolume: number) => {
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
  }, [])

  const toggleMute = () => {
    if (isMuted || volume === 0) {
      const restored = prevVolume > 0 ? prevVolume : 50
      applyVolume(restored)
      setIsMuted(false)
    } else {
      setPrevVolume(volume)
      applyVolume(0)
      setIsMuted(true)
    }
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100
    }
  }, [volume, isMuted])

  useEffect(() => {
    if (audioUrl && isPlaying && audioRef.current) {
      audioRef.current.play().catch(err => {
        console.error("Playback failed:", err)
        setIsPlaying(false)
      })
    }
  }, [audioUrl])

  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrack) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => console.error("Playback failed:", e))
    }
  }

  const selectTrack = (track: Track) => {
    setCurrentTrack(track)
    setIsPlaying(true)
  }

  const playNext = useCallback(() => {
    if (tracks.length === 0 || !currentTrack) return
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * tracks.length)
      selectTrack(tracks[randomIndex])
    } else {
      const currentIndex = tracks.findIndex(t => t.trackId === currentTrack.trackId)
      if (currentIndex === -1) return
      const nextIndex = (currentIndex + 1) % tracks.length
      selectTrack(tracks[nextIndex])
    }
  }, [tracks, currentTrack, isShuffle])

  const playPrevious = () => {
    if (tracks.length === 0 || !currentTrack) return
    const currentIndex = tracks.findIndex(t => t.trackId === currentTrack.trackId)
    if (currentIndex === -1) return
    let prevIndex = currentIndex - 1
    if (prevIndex < 0) {
      prevIndex = tracks.length - 1
    }
    selectTrack(tracks[prevIndex])
  }

  const toggleShuffle = () => setIsShuffle(!isShuffle)
  const toggleRepeat = () => setIsRepeat(!isRepeat)

  const seekTo = (percent: number) => {
    if (audioRef.current && duration > 0) {
      const newTime = percent * duration
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === Infinity) return '00:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <PlayerContext.Provider
      value={{
        tracks,
        currentTrack,
        isPlaying,
        volume,
        isMuted,
        currentTime,
        duration,
        isShuffle,
        isRepeat,
        isLoadingTracks,
        searchQuery,
        likedTrackIds,
        isLiked,
        audioUrl,
        audioRef,
        activeTab,
        setActiveTab,
        selectTrack,
        togglePlayPause,
        playNext,
        playPrevious,
        toggleShuffle,
        toggleRepeat,
        toggleMute,
        applyVolume,
        seekTo,
        handleSearchChange,
        toggleLiked,
        formatTime,
        setTracks,
        setCurrentTrack,
      }}
    >
      {children}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            if (isRepeat && audioRef.current) {
              audioRef.current.currentTime = 0
              audioRef.current.play().catch(err => console.error("Playback failed:", err))
            } else {
              playNext()
            }
          }}
          onTimeUpdate={() => {
            if (audioRef.current) {
              setCurrentTime(audioRef.current.currentTime)
            }
          }}
          onLoadedMetadata={() => {
            if (audioRef.current) {
              setDuration(audioRef.current.duration)
            }
          }}
        />
      )}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider')
  }
  return context
}
