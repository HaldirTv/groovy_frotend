import React, { useRef, useState } from 'react'

// Висоти барів статичної хвилі — точно за макетом Figma (node-id=218-17609),
// циклічно повторюються, щоб заповнити хвилю потрібної довжини.
const WAVE_PATTERN = [8, 16, 24, 12, 20, 8, 16, 8]
const WAVE_BAR_COUNT = 24

const formatDuration = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const PlayIcon: React.FC = () => (
  <svg width="11" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
)
const PauseIcon: React.FC = () => (
  <svg width="11" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="3" width="6" height="18" /><rect x="14" y="3" width="6" height="18" /></svg>
)

interface VoiceMessagePlayerProps {
  mediaUrl: string
}

export const VoiceMessagePlayer: React.FC<VoiceMessagePlayerProps> = ({ mediaUrl }) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const waveformRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isScrubbing, setIsScrubbing] = useState(false)

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) void audio.play()
    else audio.pause()
  }

  // Дозволяє перемотати запис кліком/перетягуванням по хвилі — без цього єдиний спосіб
  // дістатись до довільного моменту довгого голосового це прослухати все з початку.
  const seekToPointer = (clientX: number) => {
    const audio = audioRef.current
    const waveform = waveformRef.current
    if (!audio || !waveform || duration <= 0) return
    const rect = waveform.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    audio.currentTime = ratio * duration
    setCurrentTime(audio.currentTime)
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (duration <= 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    setIsScrubbing(true)
    seekToPointer(e.clientX)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isScrubbing) return
    seekToPointer(e.clientX)
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isScrubbing) return
    setIsScrubbing(false)
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const audio = e.currentTarget
    if (Number.isFinite(audio.duration)) {
      setDuration(audio.duration)
      return
    }
    // Chromium віддає Infinity/NaN для webm-блобів з MediaRecorder — контейнер не
    // фіналізований мультиплексором, який знає загальну тривалість наперед. Форсуємо
    // seek у "кінець" (браузер клампить його до реальної довжини потоку), що змушує
    // Chrome порахувати справжню тривалість; далі повертаємо позицію на початок.
    audio.currentTime = Number.MAX_SAFE_INTEGER
    const onSeeked = () => {
      audio.removeEventListener('timeupdate', onSeeked)
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
      audio.currentTime = 0
    }
    audio.addEventListener('timeupdate', onSeeked)
  }

  const progress = duration > 0 ? currentTime / duration : 0
  const playedBars = Math.round(progress * WAVE_BAR_COUNT)

  return (
    <div className="ChatVoicePlayer">
      <audio
        ref={audioRef}
        src={mediaUrl}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => { setIsPlaying(false); setCurrentTime(0) }}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={handleLoadedMetadata}
      />
      <button
        type="button"
        className="ChatVoicePlayBtn"
        aria-label={isPlaying ? 'Пауза' : 'Відтворити'}
        onClick={togglePlayPause}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
      <div
        ref={waveformRef}
        className="ChatVoiceWaveform"
        role="slider"
        aria-label="Перемотати голосове повідомлення"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(currentTime)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {Array.from({ length: WAVE_BAR_COUNT }, (_, i) => (
          <span
            key={i}
            className={`ChatVoiceBar ${i < playedBars ? 'played' : ''}`}
            style={{ height: `${WAVE_PATTERN[i % WAVE_PATTERN.length]}px` }}
          />
        ))}
      </div>
      <span className="ChatVoiceDuration">{formatDuration(isPlaying || isScrubbing ? currentTime : duration)}</span>
    </div>
  )
}
