import { createListenerMiddleware } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from '../index'
import {
  setCurrentTrack,
  setIsPlaying,
  togglePlayPause,
  setVolume,
  setIsMuted,
  toggleMute,
  setCurrentTime,
  setDuration,
} from '../slices/playerSlice'

export const audioListenerMiddleware = createListenerMiddleware()

let globalAudio: HTMLAudioElement | null = null

export const getAudioElement = (): HTMLAudioElement => {
  if (!globalAudio) {
    globalAudio = new Audio()
  }
  return globalAudio
}

export const setupAudioEventListeners = (dispatch: AppDispatch, getState: () => RootState) => {
  const audio = getAudioElement()

  audio.ontimeupdate = () => {
    dispatch(setCurrentTime(audio.currentTime))
  }

  audio.ondurationchange = () => {
    dispatch(setDuration(audio.duration || 0))
  }

  audio.onended = () => {
    const state = getState()
    const { queue, currentTrack, isRepeat, isShuffle } = state.player

    if (isRepeat) {
      audio.currentTime = 0
      audio.play().catch(console.error)
      return
    }

    if (queue.length === 0 || !currentTrack) {
      dispatch(setIsPlaying(false))
      return
    }

    const currentIndex = queue.findIndex((t) => t.trackId === currentTrack.trackId)
    let nextIndex = -1

    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length)
    } else if (currentIndex >= 0 && currentIndex < queue.length - 1) {
      nextIndex = currentIndex + 1
    }

    if (nextIndex >= 0 && nextIndex < queue.length) {
      dispatch(setCurrentTrack(queue[nextIndex]))
      dispatch(setIsPlaying(true))
    } else {
      dispatch(setIsPlaying(false))
    }
  }
}

// 1. Listen to setCurrentTrack
audioListenerMiddleware.startListening({
  actionCreator: setCurrentTrack,
  effect: async (action, api) => {
    const audio = getAudioElement()
    const track = action.payload

    if (!track || !track.audioUrl) {
      audio.pause()
      audio.src = ''
      api.dispatch(setIsPlaying(false))
      return
    }

    audio.src = track.audioUrl
    const state = api.getState() as RootState
    audio.volume = state.player.isMuted ? 0 : state.player.volume

    if (state.player.isPlaying) {
      audio.play().catch((err) => {
        console.error('Audio play error:', err)
        api.dispatch(setIsPlaying(false))
      })
    }
  },
})

// 2. Listen to setIsPlaying & togglePlayPause
audioListenerMiddleware.startListening({
  predicate: (action) => setIsPlaying.match(action) || togglePlayPause.match(action),
  effect: async (_action, api) => {
    const audio = getAudioElement()
    const state = api.getState() as RootState
    if (state.player.isPlaying && state.player.currentTrack) {
      if (!audio.src || audio.src !== state.player.currentTrack.audioUrl) {
        audio.src = state.player.currentTrack.audioUrl
      }
      audio.play().catch((err) => {
        console.error('Audio play error:', err)
        api.dispatch(setIsPlaying(false))
      })
    } else {
      audio.pause()
    }
  },
})

// 3. Listen to Volume / Mute
audioListenerMiddleware.startListening({
  predicate: (action) => setVolume.match(action) || setIsMuted.match(action) || toggleMute.match(action),
  effect: async (_action, api) => {
    const audio = getAudioElement()
    const state = api.getState() as RootState
    audio.volume = state.player.isMuted ? 0 : state.player.volume
  },
})
