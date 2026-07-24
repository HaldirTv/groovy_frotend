import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
import { apiFetch, GATEWAY_URL, notifyTrackPlayed } from '../api/api-client'
import { useAuthPrompt } from './auth-prompt-context'

// ──────────────────────────────────────────────────────────────────────────────
// 1. Типы
// ──────────────────────────────────────────────────────────────────────────────

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
  fetchTracks: (search?: string, page?: number, append?: boolean, searchBy?: 'all' | 'artist') => Promise<void>
  currentPage: number
  hasMoreTracks: boolean
  tracksTotalCount: number
  popularTracks: Track[]
  isLoadingPopular: boolean
  fetchPopularTracks: () => Promise<void>
  genreFilter: string
  setGenreFilter: (genre: string) => void
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

// ──────────────────────────────────────────────────────────────────────────────
// 2. Хелперы
// ──────────────────────────────────────────────────────────────────────────────

export const normalizeUrl = (url?: string): string | undefined => {
  if (!url) return undefined
  return url.replace(/^https?:\/\/localhost:\d+/, GATEWAY_URL)
}

/** Лимит хранимых идентификаторов треков, для которых уже отправлен play-запрос */
const MAX_REPORTED_TRACKS = 200

/** Должно совпадать с pageSize, который fetchTracks шлёт на бэкенд */
const TRACKS_PAGE_SIZE = 10

/** Сколько секунд нужно прослушать, чтобы трек засчитался как "played" — не зависит от длины трека. Отсекает случайные клики/скипы, но ощущается почти мгновенным */
const PLAY_REPORT_SECONDS = 4

/** Для треков короче PLAY_REPORT_SECONDS*2 — требуем прослушать половину, а не фиксированные секунды */
const PLAY_REPORT_FALLBACK_RATIO = 0.5

// ──────────────────────────────────────────────────────────────────────────────
// 3. Провайдер
// ──────────────────────────────────────────────────────────────────────────────

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { requireAuth } = useAuthPrompt()

  // ── Состояния ──────────────────────────────────────────────────────────────
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
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMoreTracks, setHasMoreTracks] = useState(true)
  const [tracksTotalCount, setTracksTotalCount] = useState(0)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [popularTracks, setPopularTracks] = useState<Track[]>([])
  const [isLoadingPopular, setIsLoadingPopular] = useState(false)
  const [genreFilter, setGenreFilter] = useState('')

  // ── Лайки ──────────────────────────────────────────────────────────────────
  const [likedTrackIds, setLikedTrackIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('likedTrackIds')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // ── Отслеживание отправленных play-запросов (Map с лимитом) ─────────────
  const [reportedTracks, setReportedTracks] = useState<Map<string, boolean>>(
    () => new Map()
  )

  // ── Refs ──────────────────────────────────────────────────────────────────
  const audioRef = useRef<HTMLAudioElement | null>(null)
  // Флаг для предотвращения параллельных вызовов при быстрых переключениях
  const isReportingRef = useRef(false)

  // ── Производные ──────────────────────────────────────────────────────────
  const isLiked = currentTrack ? likedTrackIds.includes(currentTrack.trackId) : false

  // ── Загрузка лайков ──────────────────────────────────────────────────────
  useEffect(() => {
    const loadLikedIds = async () => {
      try {
        const response = await apiFetch(`${GATEWAY_URL}/music/favorites`)
        if (response.ok) {
          const data = await response.json()
          const ids = data.map((t: Track) => t.trackId)
          setLikedTrackIds(ids)
          localStorage.setItem('likedTrackIds', JSON.stringify(ids))
        }
      } catch {
        // Если запрос не удался, оставляем то, что было в localStorage
      }
    }
    loadLikedIds()
  }, [])

  useEffect(() => {
    localStorage.setItem('likedTrackIds', JSON.stringify(likedTrackIds))
  }, [likedTrackIds])

  // ── Логика отправки play-запроса ────────────────────────────────────────
  useEffect(() => {
    // Валидация
    if (
      !currentTrack ||
      !isPlaying ||
      duration <= 0 ||
      !isFinite(duration) ||
      isReportingRef.current
    ) {
      return
    }

    const trackId = currentTrack.trackId

    // Уже отправляли для этого трека?
    if (reportedTracks.has(trackId)) return

    const requiredSeconds = Math.min(PLAY_REPORT_SECONDS, duration * PLAY_REPORT_FALLBACK_RATIO)
    if (currentTime < requiredSeconds) return

    // Блокируем параллельные вызовы
    isReportingRef.current = true

    notifyTrackPlayed(trackId)
      .catch((err) => {
        // Логируем ошибку, но не блокируем плеер
        console.error('[Player] Failed to report play for track', trackId, err)
      })
      .finally(() => {
        isReportingRef.current = false
      })

    // Запоминаем, что для этого трека отправили запрос (с ограничением размера)
    setReportedTracks((prev) => {
      const next = new Map(prev)
      next.set(trackId, true)

      // Если превышен лимит – удаляем самую старую запись (первый ключ)
      if (next.size > MAX_REPORTED_TRACKS) {
        const firstKey = next.keys().next().value
        if (firstKey !== undefined) {
          next.delete(firstKey)
        }
      }
      return next
    })
  }, [currentTime, duration, currentTrack, isPlaying, reportedTracks])

  // ── Toggle лайка ──────────────────────────────────────────────────────────
  const toggleLiked = useCallback(async () => {
    if (!currentTrack) return
    if (!requireAuth()) return
    const trackId = currentTrack.trackId
    const currentlyLiked = likedTrackIds.includes(trackId)

    // Оптимистичное обновление
    setLikedTrackIds((prev) =>
      currentlyLiked ? prev.filter((id) => id !== trackId) : [...prev, trackId]
    )

    try {
      if (currentlyLiked) {
        await apiFetch(`${GATEWAY_URL}/music/favorites/${trackId}`, {
          method: 'DELETE',
        })
      } else {
        await apiFetch(`${GATEWAY_URL}/music/favorites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trackId }),
        })
      }
    } catch (err) {
      console.error('[Player] Failed to sync like status:', err)
      // Откат оптимистичного обновления
      setLikedTrackIds((prev) =>
        currentlyLiked ? [...prev, trackId] : prev.filter((id) => id !== trackId)
      )
    }
  }, [currentTrack, likedTrackIds, requireAuth])

  // ── Загрузка треков ──────────────────────────────────────────────────────
  const fetchTracks = useCallback(
    async (search = '', page = 1, append = false, searchBy: 'all' | 'artist' = 'all') => {
      setIsLoadingTracks(true)
      try {
        const params = new URLSearchParams()
        if (search) {
          if (searchBy === 'artist') params.set('artist', search)
          else params.set('search', search)
        }
        if (genreFilter) params.set('genre', genreFilter)
        params.set('pageNumber', String(page))
        params.set('pageSize', String(TRACKS_PAGE_SIZE))
        const url = `${GATEWAY_URL}/music/tracks?${params.toString()}`

        const response = await apiFetch(url)
        if (!response.ok) {
          console.error(`[Player] Fetch tracks failed: ${response.status}`)
          return
        }

        const result = await response.json()
        // Нормализуем ответ (разные варианты структуры)
        const fetchedTracks: Track[] =
          result.items || result.data || result.Items || result.Tracks || []
        const totalCount = Number(
          result.totalCount ?? result.TotalCount ?? fetchedTracks.length
        )

        if (!fetchedTracks.length) {
          console.warn('[Player] No tracks received from server')
        }

        const normalizedData = fetchedTracks.map((track) => ({
          ...track,
          coverImageUrl: normalizeUrl(track.coverImageUrl),
          audioUrl: `${GATEWAY_URL}/music/tracks/${track.trackId}/stream`,
        }))

        // Обновляем лайки из полученных данных
        const incomingLikedIds = normalizedData
          .filter((t) => t.isLiked)
          .map((t) => t.trackId)
        if (incomingLikedIds.length) {
          setLikedTrackIds((prev) =>
            Array.from(new Set([...prev, ...incomingLikedIds]))
          )
        }

        setTracks((prev) => (append ? [...prev, ...normalizedData] : normalizedData))

        // Если треков ещё нет и мы загрузили первую страницу – выбираем первый
        if (!append && normalizedData.length > 0 && !currentTrack) {
          setCurrentTrack(normalizedData[0])
        }

        setTracksTotalCount(totalCount)
        setHasMoreTracks(page * TRACKS_PAGE_SIZE < totalCount)
        setCurrentPage(page)
      } catch (err) {
        console.error('[Player] Error fetching tracks:', err)
      } finally {
        setIsLoadingTracks(false)
      }
    },
    [currentTrack, genreFilter]
  )

  // ── Популярное (для секцій "Populate"/"Recommendations") ────────────────────
  const fetchPopularTracks = useCallback(async () => {
    setIsLoadingPopular(true)
    try {
      const response = await apiFetch(`${GATEWAY_URL}/music/tracks/popular?pageNumber=1&pageSize=10`)
      if (!response.ok) {
        console.error(`[Player] Fetch popular tracks failed: ${response.status}`)
        return
      }

      const result = await response.json()
      const fetchedTracks: Track[] = result.items || result.Items || []

      const normalizedData = fetchedTracks.map((track) => ({
        ...track,
        coverImageUrl: normalizeUrl(track.coverImageUrl),
        audioUrl: `${GATEWAY_URL}/music/tracks/${track.trackId}/stream`,
      }))

      setPopularTracks(normalizedData)
    } catch (err) {
      console.error('[Player] Error fetching popular tracks:', err)
    } finally {
      setIsLoadingPopular(false)
    }
  }, [])

  // Первичная загрузка
  useEffect(() => {
    fetchTracks()
    fetchPopularTracks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Поиск ──────────────────────────────────────────────────────────────────
  // Інпут (searchQuery) оновлюється миттєво — щоб не гальмувати друк, — а сам запит
  // до бекенду відкладається на паузу в наборі тексту. Без цього кожна натиснута
  // клавіша била в API окремим запитом (для "love" — 4 запити замість одного), що й
  // відчувалось як "гальмує" навіть коли кожен окремий запит сам по собі швидкий.
  const searchDebounceRef = useRef<number | null>(null)
  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query)
      if (searchDebounceRef.current !== null) window.clearTimeout(searchDebounceRef.current)
      searchDebounceRef.current = window.setTimeout(() => {
        fetchTracks(query)
      }, 350)
    },
    [fetchTracks]
  )

  // ── Громкость ─────────────────────────────────────────────────────────────
  const applyVolume = useCallback((newVolume: number) => {
    const clamped = Math.max(0, Math.min(100, newVolume))
    setVolume(clamped)
    setIsMuted(clamped === 0)
    if (audioRef.current) {
      audioRef.current.volume = clamped / 100
    }
  }, [])

  const toggleMute = useCallback(() => {
    if (isMuted || volume === 0) {
      const restored = prevVolume > 0 ? prevVolume : 50
      applyVolume(restored)
      setIsMuted(false)
    } else {
      setPrevVolume(volume)
      applyVolume(0)
      setIsMuted(true)
    }
  }, [isMuted, volume, prevVolume, applyVolume])

  // Синхронизация громкости с audio-элементом
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100
    }
  }, [volume, isMuted])

  // ── Загрузка аудио (Blob) ────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════
// ЗАГРУЗКА АУДИО (без лишней магии)
// ═══════════════════════════════════════════════════════════
useEffect(() => {
  let cancelled = false

  const loadAudio = async () => {
    if (!currentTrack) {
      setBlobUrl(null)
      return
    }

    try {
      const response = await apiFetch(currentTrack.audioUrl)
      if (!response.ok) {
        console.error(`[Player] Stream failed: ${response.status}`)
        return
      }

      const blob = await response.blob()
      
      // Проверяем, что blob не пустой
      if (blob.size === 0) {
        console.error('[Player] Received empty audio blob')
        return
      }

      if (cancelled) return

      // Освобождаем старый URL
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl)
      }

      const newBlobUrl = URL.createObjectURL(blob)
      setBlobUrl(newBlobUrl)
    } catch (err) {
      console.error('[Player] Failed to load audio:', err)
    }
  }

  loadAudio()

  return () => {
    cancelled = true
  }
}, [currentTrack?.trackId]) // 👈 важно: только при смене trackId

  // Когда Blob готов – подгружаем и запускаем, если нужно
  useEffect(() => {
    if (!audioRef.current || !blobUrl) return

    audioRef.current.load()
    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.error('[Player] Auto-play failed:', err)
        setIsPlaying(false)
      })
    }
  }, [blobUrl, isPlaying])

  // ── Управление воспроизведением ──────────────────────────────────────────
  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || !blobUrl) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().then(
        () => setIsPlaying(true),
        (err) => {
          console.error('[Player] Play failed:', err)
          setIsPlaying(false)
        }
      )
    }
  }, [isPlaying, blobUrl])

  const selectTrack = useCallback((track: Track) => {
    setCurrentTrack(track)
    setIsPlaying(true)
  }, [])

  const playNext = useCallback(() => {
    if (tracks.length === 0 || !currentTrack) return
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * tracks.length)
      selectTrack(tracks[randomIndex])
    } else {
      const currentIndex = tracks.findIndex(
        (t) => t.trackId === currentTrack.trackId
      )
      if (currentIndex === -1) return
      const nextIndex = (currentIndex + 1) % tracks.length
      selectTrack(tracks[nextIndex])
    }
  }, [tracks, currentTrack, isShuffle, selectTrack])

  const playPrevious = useCallback(() => {
    if (tracks.length === 0 || !currentTrack) return
    const currentIndex = tracks.findIndex(
      (t) => t.trackId === currentTrack.trackId
    )
    if (currentIndex === -1) return
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length
    selectTrack(tracks[prevIndex])
  }, [tracks, currentTrack, selectTrack])

  const toggleShuffle = useCallback(() => setIsShuffle((v) => !v), [])
  const toggleRepeat = useCallback(() => setIsRepeat((v) => !v), [])

  const seekTo = useCallback(
    (percent: number) => {
      if (audioRef.current && duration > 0 && isFinite(duration)) {
        const newTime = Math.max(0, Math.min(percent, 1)) * duration
        audioRef.current.currentTime = newTime
        setCurrentTime(newTime)
      }
    },
    [duration]
  )

  const formatTime = useCallback((seconds: number) => {
    if (!isFinite(seconds) || seconds < 0) return '00:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  // ── Мемоизированное значение контекста ──────────────────────────────────
  const value = useMemo<PlayerContextType>(
    () => ({
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
      tracksTotalCount,
      popularTracks,
      isLoadingPopular,
      fetchPopularTracks,
      genreFilter,
      setGenreFilter,
    }),
    [
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
      blobUrl,
      activeTab,
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
      fetchTracks,
      currentPage,
      hasMoreTracks,
      tracksTotalCount,
      popularTracks,
      isLoadingPopular,
      fetchPopularTracks,
      genreFilter,
    ]
  )

  // ────────────────────────────────────────────────────────────────────────────
  // 4. Рендер
  // ────────────────────────────────────────────────────────────────────────────

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
            audioRef.current.play().catch((err) =>
              console.error('[Player] Replay failed:', err)
            )
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
          if (audioRef.current && isFinite(audioRef.current.duration)) {
            setDuration(audioRef.current.duration)
          }
        }}
      />
    </PlayerContext.Provider>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// 5. Хук usePlayer
// ──────────────────────────────────────────────────────────────────────────────

export const usePlayer = () => {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider')
  }
  return context
}