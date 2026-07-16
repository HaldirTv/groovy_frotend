import React, { useState, useEffect } from "react"
import { usePlayer, type Track as PlayerTrack } from "../../../../context/player-context"
import { apiFetch, GATEWAY_URL } from "../../../../api/api-client"
import Cover from "../../../../assets/Cover.svg"
import "./style.css"

const ASSETS = "/src/pages/ai-mix/components/AiMixesSection"

interface MixData {
  id: string
  title: string
  subtitle: string
  coverImage: string
  isReal?: boolean
}

interface MixCardProps {
  mix: MixData
  onPlay: (mix: MixData) => void
}

const MixCard = ({ mix, onPlay }: MixCardProps): React.JSX.Element => (
  <div 
    className="ams-mix-card" 
    role="button" 
    tabIndex={0} 
    aria-label={`Відтворити ${mix.title}`}
    onClick={() => onPlay(mix)}
  >
    {/* Card background texture */}
    <img
      className="ams-mask-group"
      alt=""
      src={`${ASSETS}/mask-group.svg`}
      aria-hidden="true"
    />

    {/* Cover image with hover overlay */}
    <div className="ams-cover-wrapper">
      <div
        className="ams-cover"
        style={{ backgroundImage: `url(${mix.coverImage})` }}
        aria-label={`Обкладинка ${mix.title}`}
      />
      <div className="ams-overlay" aria-hidden="true" />
    </div>

    {/* Track info */}
    <div className="ams-info">
      <div className="ams-info-row">
        <div className="ams-title">{mix.title}</div>
      </div>
      <div className="ams-info-row">
        <p className="ams-subtitle">{mix.subtitle}</p>
      </div>
    </div>
  </div>
)

export const AiMixesSection = (): React.JSX.Element => {
  const { selectTrack, setTracks } = usePlayer()
  const [mixes, setMixes] = useState<MixData[]>([])

  useEffect(() => {
    let active = true
    const loadMixes = async () => {
      try {
        const response = await apiFetch(`${GATEWAY_URL}/music/playlists/ai-mixes`)
        if (response.ok && active) {
          const playlists = await response.json()
          if (playlists.length > 0) {
            const mapped = playlists.map((p: any) => ({
              id: p.id,
              title: p.title,
              subtitle: `Groovra AI • ${p.trackCount} треків`,
              coverImage: p.collageCovers?.[0] || p.coverImageUrl || Cover,
              isReal: true,
            }))
            setMixes(mapped)
            return
          }
        }
      } catch (err) {
        console.error("Failed to load recommended AI mixes:", err)
      }

      if (active) {
        setMixes([
          {
            id: "digital-pulse",
            title: "Digital Pulse",
            subtitle: "Groovra AI Core • Synthwave",
            coverImage: `${ASSETS}/mix-cover-1.png`,
          },
          {
            id: "neural-flow",
            title: "Neural Flow",
            subtitle: "Groovra AI Core • Cyber Pop",
            coverImage: `${ASSETS}/mix-cover-2.png`,
          },
          {
            id: "quantum-echo",
            title: "Quantum Echo",
            subtitle: "Neural Composer • Ambient",
            coverImage: `${ASSETS}/mix-cover-3.png`,
          },
          {
            id: "digital-echo",
            title: "Digital Echo",
            subtitle: "Neural Composer • Ambient",
            coverImage: `${ASSETS}/mix-cover-4.png`,
          },
          {
            id: "sound-pulse",
            title: "Sound Pulse",
            subtitle: "Groovra AI Core • Synthwave",
            coverImage: `${ASSETS}/mix-cover-5.png`,
          },
        ])
      }
    }

    loadMixes()
    return () => {
      active = false
    }
  }, [])

  const handlePlayMix = async (mix: MixData) => {
    if (mix.isReal) {
      try {
        const response = await apiFetch(`${GATEWAY_URL}/music/playlists/${mix.id}`)
        if (response.ok) {
          const playlist = await response.json()
          if (playlist.tracks && playlist.tracks.length > 0) {
            const playerTracks: PlayerTrack[] = playlist.tracks.map((pt: any) => ({
              trackId: pt.trackId,
              title: pt.title,
              artistName: pt.artistName,
              durationSeconds: pt.durationSeconds,
              coverImageUrl: pt.coverUrl || undefined,
              audioUrl: `${GATEWAY_URL}/music/tracks/${pt.trackId}/stream`,
              fileSizeBytes: 0,
              contentType: "audio/mpeg",
              uploadedAt: new Date().toISOString(),
              playCount: 0,
            }))
            setTracks(playerTracks)
            selectTrack(playerTracks[0])
          }
        }
      } catch (err) {
        console.error("Failed to load playlist details for playback:", err)
      }
    } else {
      // Fake play logic for mock recommended playlists
      alert(`Playing mock playlist: ${mix.title}`)
    }
  }

  return (
    <div className="ai-mixes-section">
      {/* Section header */}
      <div className="ams-header">
        <div className="ams-heading">
          <div className="ams-heading-icon">
            <img className="ams-icon" alt="AI Mixes icon" src={`${ASSETS}/icon.svg`} />
          </div>
          <div className="ams-heading-text">Рекомендовані ШІ Мікси</div>
        </div>

        <a
          className="ams-link"
          href="#"
          aria-label="Показати всі мікси"
          tabIndex={0}
          onClick={(e) => e.preventDefault()}
        >
          <span className="ams-link-label">ВСІ МІКСИ</span>
          <div className="ams-link-icon">
            <img className="ams-arrow" alt="" src={`${ASSETS}/image.svg`} aria-hidden="true" />
          </div>
        </a>
      </div>

      {/* Mix cards row */}
      <div className="ams-cards">
        {mixes.map((mix) => (
          <MixCard key={mix.id} mix={mix} onPlay={handlePlayMix} />
        ))}
      </div>
    </div>
  )
}
