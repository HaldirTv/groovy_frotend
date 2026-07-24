import { apiFetch, GATEWAY_URL } from './api-client'
import { normalizeUrl, type Track } from '../context/player-context'

export interface MoodRecommendation {
  mood: string
  tracks: Track[]
}

// Реальные значения Genre из БД (то, что фактически кладёт импорт из Jamendo),
// а не захардкоженный список, который со временем расходится с бэком.
export const fetchGenres = async (): Promise<string[]> => {
  const res = await apiFetch(`${GATEWAY_URL}/music/tracks/genres`, { method: 'GET' })
  if (!res.ok) {
    throw new Error(`Не вдалося завантажити список жанрів: ${res.status}`)
  }
  const data = await res.json()
  return (Array.isArray(data) ? data : []) as string[]
}

// GET /music/tracks/recommendations — секція "Музика за стилем та настроєм" на головній:
// список категорій настрою/стилю з підібраними треками (див. Groovra.Music.Microservice
// MusicService.GetMoodRecommendationsAsync).
export const fetchMoodRecommendations = async (take = 8): Promise<MoodRecommendation[]> => {
  const res = await apiFetch(`${GATEWAY_URL}/music/tracks/recommendations?take=${take}`)
  if (!res.ok) {
    throw new Error(`Не вдалося завантажити рекомендації: ${res.status}`)
  }
  const data = await res.json()
  const list: { mood: string; tracks: Track[] }[] = Array.isArray(data) ? data : []
  return list.map((entry) => ({
    mood: entry.mood,
    tracks: entry.tracks.map((track) => ({
      ...track,
      coverImageUrl: normalizeUrl(track.coverImageUrl),
      audioUrl: `${GATEWAY_URL}/music/tracks/${track.trackId}/stream`,
    })),
  }))
}

// GET /music/tracks/{id} публічний на гейтвеї (не потребує токена) — використовується
// для дiплінка "поділитися треком" (/track?trackId=...), який мусить відкриватись
// і в юзера, що ще не мав цей трек у своєму плеєрі.
export const fetchTrackById = async (trackId: string): Promise<Track> => {
  const res = await apiFetch(`${GATEWAY_URL}/music/tracks/${trackId}`)
  if (!res.ok) {
    throw new Error(`Не вдалося завантажити трек: ${res.status}`)
  }
  const track = await res.json()
  return {
    ...track,
    coverImageUrl: normalizeUrl(track.coverImageUrl),
    audioUrl: `${GATEWAY_URL}/music/tracks/${track.trackId}/stream`,
  }
}

// ── Кошик (soft-deleted власні треки) ────────────────────────────────────

export const getDeletedTracks = async (): Promise<Track[]> => {
  const res = await apiFetch(`${GATEWAY_URL}/music/tracks/deleted`)
  if (!res.ok) {
    throw new Error(`Не вдалося завантажити кошик: ${res.status}`)
  }
  const tracks: Track[] = await res.json()
  return tracks.map((track) => ({
    ...track,
    coverImageUrl: normalizeUrl(track.coverImageUrl),
    audioUrl: `${GATEWAY_URL}/music/tracks/${track.trackId}/stream`,
  }))
}

export const restoreTrack = async (trackId: string): Promise<void> => {
  const res = await apiFetch(`${GATEWAY_URL}/music/tracks/${trackId}/restore`, { method: 'POST' })
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.Error || data?.error || `Не вдалося відновити трек: ${res.status}`)
  }
}

export const permanentlyDeleteTrack = async (trackId: string): Promise<void> => {
  const res = await apiFetch(`${GATEWAY_URL}/music/tracks/${trackId}/permanent`, { method: 'DELETE' })
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.Error || data?.error || `Не вдалося остаточно видалити трек: ${res.status}`)
  }
}
