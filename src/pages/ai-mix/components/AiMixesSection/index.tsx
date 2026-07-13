import React from "react"
import "./style.css"











const ASSETS = "/src/pages/ai-mix/components/AiMixesSection"

interface MixData {
  id: string
  title: string
  subtitle: string
  coverImage: string
}

const MIXES: MixData[] = [
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
]

interface MixCardProps {
  mix: MixData
}

const MixCard = ({ mix }: MixCardProps): React.JSX.Element => (
  <div className="ams-mix-card" role="button" tabIndex={0} aria-label={`Відтворити ${mix.title}`}>
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
        >
          <span className="ams-link-label">ВСІ МІКСИ</span>
          <div className="ams-link-icon">
            <img className="ams-arrow" alt="" src={`${ASSETS}/image.svg`} aria-hidden="true" />
          </div>
        </a>
      </div>

      {/* Mix cards row */}
      <div className="ams-cards">
        {MIXES.map((mix) => (
          <MixCard key={mix.id} mix={mix} />
        ))}
      </div>
    </div>
  )
}
