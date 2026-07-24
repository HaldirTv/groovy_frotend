import React, { useEffect, useState } from 'react'
import { usePlayer, type Track } from '../context/player-context'
import { fetchMoodRecommendations, type MoodRecommendation } from '../api/tracks'
import { TrackCard } from './TrackCard'

// Канонічний, фіксований порядок категорій — таби рендеряться завжди, навіть коли бекенд
// (холодний кеш) ще не повернув даних. Значення збігаються з MoodCatalog на бекенді.
const MOOD_TABS = ['Chill', 'Workout', 'Focus', 'Party', 'Sad', 'Happy'] as const

// Холодний старт: бекенд на порожньому кеші віддає [] і ставить фоновий прогрев (Hangfire).
// Тому кілька разів перезапитуємо, доки Redis не наповниться, — без блокуючого очікування.
const COLD_RETRY_MS = 4000
const MAX_COLD_RETRIES = 3

export const MoodRecommendations: React.FC = () => {
  const { currentTrack, selectTrack, setTracks } = usePlayer()
  const [moods, setMoods] = useState<MoodRecommendation[]>([])
  const [activeMood, setActiveMood] = useState<string>(MOOD_TABS[0])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    let retryTimer: number | undefined
    let attempts = 0

    const load = async () => {
      try {
        const result = await fetchMoodRecommendations()
        if (cancelled) return
        setMoods(result)
        setIsLoading(false)

        // Порожньо => кеш ще прогрівається у фоні. Плануємо повторний запит.
        const hasTracks = result.some((m) => m.tracks.length > 0)
        if (!hasTracks && attempts < MAX_COLD_RETRIES) {
          attempts += 1
          retryTimer = window.setTimeout(load, COLD_RETRY_MS)
        }
      } catch (err) {
        if (cancelled) return
        console.error('[MoodRecommendations] Failed to load recommendations:', err)
        setIsLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
      if (retryTimer !== undefined) window.clearTimeout(retryTimer)
    }
  }, [])

  // Треки активної категорії: матчимо лейбл таба з mood з бекенда (без урахування регістру).
  const activeTracks =
    moods.find((m) => m.mood.toLowerCase() === activeMood.toLowerCase())?.tracks ?? []

  const handleSelect = (track: Track) => {
    setTracks(activeTracks)
    selectTrack(track)
  }

  return (
    <section className="MoodSection">
      <div className="TrendingNow">
        <div className="ContTextTrendingNow">
          <span className="LisNowTrending">Персональнізований алгоритм</span>
          <span className="TrendNowText">Музика за стилем та настроєм</span>
        </div>
      </div>

      <div className="MoodChipsRow">
        {MOOD_TABS.map((mood) => (
          <button
            type="button"
            key={mood}
            className={`MoodChip ${mood === activeMood ? 'active' : ''}`}
            onClick={() => setActiveMood(mood)}
          >
            {mood}
          </button>
        ))}
      </div>

      <div className="MusicCardCont">
        {isLoading ? (
          <div style={{ color: '#A1A1AA', fontFamily: 'SUSE, sans-serif' }}>Завантаження...</div>
        ) : activeTracks.length === 0 ? (
          <div style={{ color: '#A1A1AA', fontFamily: 'SUSE, sans-serif' }}>
            Тут скоро з'являться треки для цієї категорії
          </div>
        ) : (
          activeTracks.map((track) => (
            <TrackCard
              key={track.trackId}
              track={track}
              isActive={currentTrack?.trackId === track.trackId}
              onSelect={handleSelect}
            />
          ))
        )}
      </div>
    </section>
  )
}
