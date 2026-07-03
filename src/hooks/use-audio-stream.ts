// Використовуємо відносний шлях — Vite proxy перенаправить /music/* → http://localhost:5274
// Це уникає mixed-content та проблем із самопідписаним сертифікатом https://localhost:7176
export const useAudioStream = (trackId: string | null) => {
  const audioUrl = trackId ? `/music/tracks/${trackId}/stream` : null
  return { audioUrl, isLoading: false, error: null }
}
