import React from "react"
import "./style.css"

// SVG / PNG assets — розмісти у цій папці:
//   icon.svg              → іконка заголовка "Трендові ШІ Альбоми"
//   image.svg             → стрілка-іконка посилання "БІЛЬШЕ АЛЬБОМІВ"
//   mask-group.svg        → фон картки 1 (Neural Odyssey)
//   mask-group-2.svg      → фон картки 2 (Silicon Soul — image.svg у Figma)
//   mask-group-3.svg      → фон картки 3 (Echoes of Void)
//   mask-group-4.svg      → фон картки 4 (Cyber Synthesis)
//   AI-album-cover.png    → обкладинка картки 1
//   AI-album-cover-2.png  → обкладинка картки 3
//   AI-album-cover-3.png  → обкладинка картки 4
//   image.png             → обкладинка картки 2 (Silicon Soul)

const ASSETS = "/src/pages/ai-mix/components/NewAiAlbums"

interface AlbumData {
  id: string
  title: string
  artist: string
  tracks: string
  genre: string
  coverImage: string
  maskGroup: string
}

const ALBUMS: AlbumData[] = [
  {
    id: "neural-odyssey",
    title: "Neural Odyssey",
    artist: "DeepAudio V5",
    tracks: "12 Треків • 2024",
    genre: "Electronic",
    coverImage: `${ASSETS}/AI-album-cover.png`,
    maskGroup: `${ASSETS}/mask-group.svg`,
  },
  {
    id: "silicon-soul",
    title: "Silicon Soul",
    artist: "Quantum Sound Engine",
    tracks: "8 Треків • 2024",
    genre: "Lo-Fi",
    coverImage: `${ASSETS}/image.png`,
    maskGroup: `${ASSETS}/mask-group-2.svg`,
  },
  {
    id: "echoes-of-void",
    title: "Echoes of Void",
    artist: "Ambient AI",
    tracks: "15 Треків • 2023",
    genre: "Ambient",
    coverImage: `${ASSETS}/AI-album-cover-2.png`,
    maskGroup: `${ASSETS}/mask-group-3.svg`,
  },
  {
    id: "cyber-synthesis",
    title: "Cyber Synthesis",
    artist: "Neural Composer",
    tracks: "10 Треків • 2024",
    genre: "Synthwave",
    coverImage: `${ASSETS}/AI-album-cover-3.png`,
    maskGroup: `${ASSETS}/mask-group-4.svg`,
  },
]

interface AlbumCardProps {
  album: AlbumData
}

const AlbumCard = ({ album }: AlbumCardProps): React.JSX.Element => (
  <div className="naa-album-card">
    {/* Cover image */}
    <div className="naa-cover-wrapper">
      <div
        className="naa-cover"
        style={{ backgroundImage: `url(${album.coverImage})` }}
        aria-label={`Обкладинка ${album.title}`}
      />
    </div>

    {/* Info */}
    <div className="naa-info">
      <div className="naa-info-row">
        <div className="naa-title">{album.title}</div>
      </div>
      <div className="naa-info-row">
        <div className="naa-artist">{album.artist}</div>
      </div>
      <div className="naa-meta">
        <div className="naa-meta-row">
          <div className="naa-tracks">{album.tracks}</div>
          <div className="naa-genre-tag">{album.genre}</div>
        </div>
      </div>
    </div>

    {/* Card background */}
    <img className="naa-mask-group" alt="" src={album.maskGroup} aria-hidden="true" />
  </div>
)

export const NewAiAlbums = (): React.JSX.Element => {
  return (
    <div className="new-ai-albums">
      {/* Section header */}
      <div className="naa-header">
        <div className="naa-heading">
          <div className="naa-heading-icon">
            <img className="naa-icon" alt="AI Albums icon" src={`${ASSETS}/icon.svg`} />
          </div>
          <div className="naa-heading-text">Трендові ШІ Альбоми</div>
        </div>

        <a
          className="naa-link"
          href="#"
          aria-label="Показати більше альбомів"
          tabIndex={0}
        >
          <span className="naa-link-label">БІЛЬШЕ АЛЬБОМІВ</span>
          <div className="naa-link-icon">
            <img className="naa-arrow" alt="Arrow" src={`${ASSETS}/image.svg`} />
          </div>
        </a>
      </div>

      {/* Album cards grid */}
      <div className="naa-grid">
        {ALBUMS.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </div>
    </div>
  )
}
