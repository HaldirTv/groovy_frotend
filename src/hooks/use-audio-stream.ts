

export const useAudioStream = (trackId: string | null) => {
  const audioUrl = trackId ? `/music/tracks/${trackId}/stream` : null
  return { audioUrl, isLoading: false, error: null }
}
