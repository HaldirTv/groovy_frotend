import React from "react"
import "./style.css"

// SVG / PNG assets — розмісти у цій папці:
//
// Для треків:
//   icon.svg         → play-іконка (11.67×9.17)
//   icon-2.svg       → more-іконка (16.67×15.29)
//   image.svg        → like-іконка (16.67×15.29)
//   track-cover-1.png → обкладинка "Synthetic Dawn"
//   track-cover-2.png → обкладинка "Ghost in the Shell (Remix)"
//
// Для AI-моделей:
//   model-icon-1.svg  → іконка Groovra AI Core (18×18)
//   model-icon-2.svg  → іконка Quantum Sound Engine (19.01×20)
//   model-icon-3.svg  → іконка DeepAudio V5 (20×16)
//   mask-group.svg    → фон картки Groovra AI Core
//   mask-group-2.svg  → фон картки Quantum Sound Engine
//   mask-group-3.svg  → фон картки DeepAudio V5

const ASSETS = "/src/pages/ai-mix/components/ContentGridAi"

// ── Track types ──────────────────────────────────────────────
interface TrackData {
  id: string
  title: string
  artist: string
  genre: string
  duration: string
  cover: string
  isPlaying?: boolean
}

const TRACKS: TrackData[] = [
  {
    id: "synthetic-dawn",
    title: "Synthetic Dawn",
    artist: "Neural Composer",
    genre: "Cyber Pop",
    duration: "3:42",
    cover: `${ASSETS}/track-cover-1.png`,
    isPlaying: false,
  },
  {
    id: "ghost-remix",
    title: "Ghost in the Shell (Remix)",
    artist: "Groovra AI Core",
    genre: "Synthwave",
    duration: "4:15",
    cover: `${ASSETS}/track-cover-2.png`,
    isPlaying: true,
  },
]

// ── Genre types ──────────────────────────────────────────────
interface GenreData {
  id: string
  label: string
  active?: boolean
}

const GENRES: GenreData[] = [
  { id: "synthwave", label: "Synthwave" },
  { id: "cyber-pop", label: "Cyber Pop" },
  { id: "electronic", label: "Electronic", active: true },
  { id: "ambient", label: "Ambient" },
]

// ── AI Model types ───────────────────────────────────────────
interface AiModelData {
  id: string
  name: string
  description: string
  accuracy: string
  badge: string
  badgeBg: string
  iconSrc: string
  iconW: number
  iconH: number
  maskSrc: string
}

const AI_MODELS: AiModelData[] = [
  {
    id: "groovra-ai-core",
    name: "Groovra AI Core",
    description: "Ритмічні патерни та базові мелодії.",
    accuracy: "Успішність: 98.4%",
    badge: "Rhythm Expert",
    badgeBg: "#d7f8ff1a",
    iconSrc: `${ASSETS}/model-icon-1.svg`,
    iconW: 18,
    iconH: 18,
    maskSrc: `${ASSETS}/mask-group.svg`,
  },
  {
    id: "quantum-sound",
    name: "Quantum Sound Engine",
    description: "Надскладні текстури та атмосферні ефекти.",
    accuracy: "Успішність: 96.7%",
    badge: "Ambient King",
    badgeBg: "#d0bcff1a",
    iconSrc: `${ASSETS}/model-icon-2.svg`,
    iconW: 19.01,
    iconH: 20,
    maskSrc: `${ASSETS}/mask-group-2.svg`,
  },
  {
    id: "deep-audio",
    name: "DeepAudio V5",
    description: "Професійне зведення та вокальний синтез.",
    accuracy: "Успішність: 99.1%",
    badge: "Vocal Synthesis",
    badgeBg: "#f0f1fb1a",
    iconSrc: `${ASSETS}/model-icon-3.svg`,
    iconW: 20,
    iconH: 16,
    maskSrc: `${ASSETS}/mask-group-3.svg`,
  },
]

// ── Sub-components ───────────────────────────────────────────
const TrackRow = ({ track }: { track: TrackData }): React.JSX.Element => (
  <div className={`cga-track-row${track.isPlaying ? " cga-track-row--playing" : ""}`}>
    {/* Cover thumbnail */}
    <div className="cga-track-bg">
      <div
        className="cga-track-cover"
        style={{ backgroundImage: `url(${track.cover})` }}
        aria-hidden="true"
      />
      <div className={`cga-track-overlay${track.isPlaying ? " cga-track-overlay--visible" : ""}`}>
        <div className="cga-track-play-icon">
          <img
            className="cga-play-icon"
            alt="Play"
            src={`${ASSETS}/icon.svg`}
          />
        </div>
      </div>
    </div>

    {/* Track info */}
    <div className="cga-track-info">
      <div className="cga-track-title">{track.title}</div>
      <div className="cga-track-artist">{track.artist}</div>
    </div>

    {/* Genre */}
    <div className="cga-track-genre">{track.genre}</div>

    {/* Duration */}
    <div className="cga-track-duration">{track.duration}</div>

    {/* Action button */}
    <button
      className="cga-track-btn"
      type="button"
      aria-label={track.isPlaying ? "Зупинити" : "Додати до плейлиста"}
    >
      <img
        className="cga-track-btn-icon"
        alt=""
        src={track.isPlaying ? `${ASSETS}/icon-2.svg` : `${ASSETS}/image.svg`}
        aria-hidden="true"
      />
    </button>
  </div>
)

const AiModelCard = ({ model }: { model: AiModelData }): React.JSX.Element => (
  <div className="cga-model-card">
    <img className="cga-model-mask" alt="" src={model.maskSrc} aria-hidden="true" />

    {/* Header row: icon + name + description */}
    <div className="cga-model-header">
      <div className="cga-model-icon-box">
        <img
          className="cga-model-icon"
          alt={model.name}
          src={model.iconSrc}
          style={{ width: model.iconW, height: model.iconH }}
        />
      </div>
      <div className="cga-model-text">
        <div className="cga-model-name">{model.name}</div>
        <p className="cga-model-desc">{model.description}</p>
      </div>
    </div>

    {/* Footer row: accuracy + badge */}
    <div className="cga-model-footer">
      <div className="cga-model-accuracy">{model.accuracy}</div>
      <div
        className="cga-model-badge"
        style={{ backgroundColor: model.badgeBg }}
      >
        {model.badge}
      </div>
    </div>
  </div>
)

// ── Main component ───────────────────────────────────────────
export const ContentGridAi = (): React.JSX.Element => {
  return (
    <div className="content-grid-ai">

      {/* LEFT column: Popular Tracks */}
      <div className="cga-left">
        <div className="cga-section-heading">Популярні ШІ Треки</div>
        <div className="cga-tracks-card">
          {TRACKS.map((track) => (
            <TrackRow key={track.id} track={track} />
          ))}
        </div>

        {/* Trending Genres */}
        <div className="cga-genres-section">
          <div className="cga-section-heading">Трендові Жанри</div>
          <div className="cga-genres">
            {GENRES.map((genre) => (
              <button
                key={genre.id}
                type="button"
                className={`cga-genre-btn${genre.active ? " cga-genre-btn--active" : ""}`}
                aria-pressed={genre.active}
              >
                {genre.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT column: AI Models */}
      <div className="cga-right">

        {/* AI Models */}
        <div className="cga-models-section">
          <div className="cga-section-heading">Наші ШІ Моделі</div>
          <div className="cga-models">
            {AI_MODELS.map((model) => (
              <AiModelCard key={model.id} model={model} />
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}
