import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react'
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
  isLiked?: boolean 
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
  fetchTracks: (search?: string, page?: number, append?: boolean) => Promise<void>
  currentPage: number
  hasMoreTracks: boolean
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

const normalizeUrl = (url?: string): string | undefined => {
  if (!url) return undefined
  return url.replace(/^https?:\/\/localhost:\d+/, GATEWAY_URL)
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

  const [blobUrl, setBlobUrl] = useState<string | null>(null)

  const [likedTrackIds, setLikedTrackIds] = useState<string[]>([])

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isLiked = currentTrack ? likedTrackIds.includes(currentTrack.trackId) : false

  const [currentPage, setCurrentPage] = useState(1)
  const [hasMoreTracks, setHasMoreTracks] = useState(true)

  useEffect(() => {
  const loadLikedIds = async () => {
    try {
      const response = await apiFetch(`${GATEWAY_URL}/music/favorites`)
      if (response.ok) {
        const tracks = await response.json()
        const ids = tracks.map((t: Track) => t.trackId)
        setLikedTrackIds(ids)
        localStorage.setItem('likedTrackIds', JSON.stringify(ids))
      }
    } catch (err) {
      try {
        const saved = localStorage.getItem('likedTrackIds')
        if (saved) setLikedTrackIds(JSON.parse(saved))
      } catch {}
    }
  }
  loadLikedIds()
}, [])

  useEffect(() => {
    localStorage.setItem('likedTrackIds', JSON.stringify(likedTrackIds))
  }, [likedTrackIds])

  const toggleLiked = async () => {
    if (!currentTrack) return
    const trackId = currentTrack.trackId
    const currentlyLiked = likedTrackIds.includes(trackId)

    setLikedTrackIds(prev =>
      currentlyLiked 
        ? prev.filter(id => id !== trackId) 
        : [...prev, trackId]
    )

    try {
      if (currentlyLiked) {
        await apiFetch(`${GATEWAY_URL}/music/favorites/${trackId}`, { 
          method: 'DELETE' 
        })
      } else {
        await apiFetch(`${GATEWAY_URL}/music/favorites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trackId }) 
        })
      }
    } catch (err) {
      console.error('Ошибка синхронизации лайка:', err)
      setLikedTrackIds(prev =>
        currentlyLiked 
          ? [...prev, trackId] 
          : prev.filter(id => id !== trackId)
      )
    }
}

  // ─── Загрузка треков ────────────────────────────────────────
  const fetchTracks = useCallback(async (search = '', page = 1, append = false) => {
    setIsLoadingTracks(true)
    try {
      const url = search
        ? `${GATEWAY_URL}/music/tracks?search=${encodeURIComponent(search)}&pageNumber=${page}&pageSize=10`
        : `${GATEWAY_URL}/music/tracks?pageNumber=${page}&pageSize=10`

      const response = await apiFetch(url)
      if (response.ok) {
        const result = await response.json()
        const fetchedTracks: Track[] = result.items || result.data || result.Items || result.Tracks || (Array.isArray(result) ? result : [])

        if (fetchedTracks.length === 0) {
          console.warn('GET /music/tracks вернул 200, но список треков пуст. Ответ:', result)
        }

        const normalizedData = fetchedTracks.map(track => ({
          ...track,
          coverImageUrl: normalizeUrl(track.coverImageUrl),
          audioUrl: `${GATEWAY_URL}/music/tracks/${track.trackId}/stream`,
        }))
        const incomingLikedIds = normalizedData.filter(t => t.isLiked).map(t => t.trackId)
        if (incomingLikedIds.length > 0) {
          setLikedTrackIds(prev => Array.from(new Set([...prev, ...incomingLikedIds])))
        }

        if (append) {
          setTracks(prev => [...prev, ...normalizedData])
        } else {
          setTracks(normalizedData)
          if (normalizedData.length > 0 && !currentTrack) {
            setCurrentTrack(normalizedData[0])
          }
        }

        setHasMoreTracks(fetchedTracks.length === 10)
        setCurrentPage(page)
      } else {
        const errorBody = await response.text().catch(() => '')
        console.error(`GET /music/tracks ошибка ${response.status}:`, errorBody)
      }
    } catch (err) {
      console.error('Error fetching tracks:', err)
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

  // ─── Громкость ──────────────────────────────────────────────
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

  // ═══════════════════════════════════════════════════════════
  // АВТОРИЗОВАННАЯ ЗАГРУЗКА АУДИО В BLOCK ПРИ СМЕНЕ ТРЕКА
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    let cancelled = false

    const loadAudio = async () => {
      if (!currentTrack) {
        setBlobUrl(null)
        return
      }

      try {
        // Загружаем аудио через apiFetch (с автоматическим токеном)
        const response = await apiFetch(currentTrack.audioUrl)
        if (!response.ok) {
          console.error(`Stream load failed with status ${response.status}`)
          return
        }

        const blob = await response.blob()
        if (cancelled) return

        // Освобождаем старый Blob URL, чтобы не утекала память
        if (blobUrl) {
          URL.revokeObjectURL(blobUrl)
        }

        const newBlobUrl = URL.createObjectURL(blob)
        setBlobUrl(newBlobUrl)
      } catch (err) {
        console.error('Failed to load audio via apiFetch:', err)
      }
    }

    loadAudio()

    return () => {
      cancelled = true
    }
  }, [currentTrack?.trackId]) 

  useEffect(() => {
    if (!audioRef.current || !blobUrl) return

    audioRef.current.load() 
    if (isPlaying) {
      audioRef.current.play().catch(err => {
        console.error('Auto-play blocked after blob ready:', err)
        setIsPlaying(false)
      })
    }
  }, [blobUrl])

  // ─── Управление воспроизведением ───────────────────────────
  const togglePlayPause = () => {
    if (!audioRef.current || !blobUrl) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => console.error('Playback failed:', e))
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
    if (prevIndex < 0) prevIndex = tracks.length - 1
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

  // ─── Значение контекста ────────────────────────────────────
  const value: PlayerContextType = {
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
    audioUrl: blobUrl,  
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
    fetchTracks,
    currentPage,
    hasMoreTracks,
  }

  return (
    <PlayerContext.Provider value={value}>
      {children}

      <audio
        ref={audioRef}
        src={blobUrl || ''}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          if (isRepeat && audioRef.current) {
            audioRef.current.currentTime = 0
            audioRef.current.play().catch(err => console.error('Replay failed:', err))
          } else {
            playNext()
          }
        }}
        onTimeUpdate={() => {
          if (audioRef.current) setCurrentTime(audioRef.current.currentTime)
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) setDuration(audioRef.current.duration)
        }}
      />
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