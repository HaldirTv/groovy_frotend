import React from "react"
import "./style.css"

// SVG assets — розмісти у цій папці:
//   icon.svg   → іконка кроку 1 (Нейронний аналіз) — 30×30
//   image.svg  → іконка кроку 2 (Мелодія та Гармонія) — 30×30
//   icon-2.svg → іконка кроку 3 (Аранжування) — 30×31.75
//   icon-3.svg → іконка кроку 4 (Мастерінг) — 26.67×26.67

const ASSETS = "/src/pages/ai-mix/components/NewHowAiCreates"

interface StepData {
  id: string
  iconSrc: string
  iconW: number
  iconH: number
  title: string
  description: string
  glowColor: string
}

const STEPS: StepData[] = [
  {
    id: "neural-analysis",
    iconSrc: `${ASSETS}/icon.svg`,
    iconW: 30,
    iconH: 30,
    title: "Нейронний аналіз",
    description: "ШІ аналізує мільйони патернів для вибору емоційного тону.",
    glowColor: "#59e8ff1a",
  },
  {
    id: "melody-harmony",
    iconSrc: `${ASSETS}/image.svg`,
    iconW: 30,
    iconH: 30,
    title: "Мелодія та Гармонія",
    description: "Генерація унікальних музичних структур у реальному часі.",
    glowColor: "#d0bcff1a",
  },
  {
    id: "arrangement",
    iconSrc: `${ASSETS}/icon-2.svg`,
    iconW: 30,
    iconH: 31.75,
    title: "Аранжування",
    description: "Накладення інструментів та синтетичних звукових шарів.",
    glowColor: "#f0f1fb1a",
  },
  {
    id: "mastering",
    iconSrc: `${ASSETS}/icon-3.svg`,
    iconW: 26.67,
    iconH: 26.67,
    title: "Мастерінг",
    description: "Фінальна обробка звуку для кришталевої чіткості.",
    glowColor: "#d7f8ff1a",
  },
]

interface AiStepProps {
  step: StepData
}

const AiStep = ({ step }: AiStepProps): React.JSX.Element => (
  <div className="nhac-step">
    {/* Icon box */}
    <div
      className="nhac-icon-box"
      style={{ boxShadow: `0px 0px 20px ${step.glowColor}` }}
    >
      <div className="nhac-icon-wrapper">
        <img
          className="nhac-icon"
          alt={step.title}
          src={step.iconSrc}
          style={{ width: step.iconW, height: step.iconH }}
        />
      </div>
    </div>

    {/* Text */}
    <div className="nhac-text">
      <div className="nhac-text-row">
        <div className="nhac-step-title">{step.title}</div>
      </div>
      <div className="nhac-text-row">
        <p className="nhac-step-desc">{step.description}</p>
      </div>
    </div>
  </div>
)

export const NewHowAiCreates = (): React.JSX.Element => {
  return (
    <div className="new-how-ai-creates">
      {/* Horizontal gradient divider */}
      <div className="nhac-divider" aria-hidden="true" />

      {/* Header */}
      <div className="nhac-header">
        <div className="nhac-title">Як ШІ створює музику</div>
        <div className="nhac-desc-wrapper">
          <p className="nhac-desc">
            Наш процес поєднує нейронні мережі з теорією класичної музики для досягнення
            ідеального звучання.
          </p>
        </div>
      </div>

      {/* Steps row */}
      <div className="nhac-steps">
        {STEPS.map((step) => (
          <AiStep key={step.id} step={step} />
        ))}
      </div>
    </div>
  )
}
