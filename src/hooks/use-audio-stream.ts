import { GATEWAY_URL } from '../api/api-client'

// Використовуємо абсолютний GATEWAY_URL замість відносного шляху '/music/...':
// відносний шлях покладався на dev-проксі Vite ('/music' -> backend), який
// відсутній у production-збірці, тому стрім треків ламався поза дев-сервером.
export const useAudioStream = (trackId: string | null) => {
  const audioUrl = trackId ? `${GATEWAY_URL}/music/tracks/${trackId}/stream` : null
  return { audioUrl, isLoading: false, error: null }
}
