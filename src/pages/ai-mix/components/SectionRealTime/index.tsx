import React from "react"
import "./style.css"

// SVG assets — розмісти у цій папці:
//   icon.svg → іконка ШІ (ліва кругла кнопка)

const ASSETS = "/src/pages/ai-mix/components/SectionRealTime"

interface StatBadgeProps {
  value: string
  label: string
}

const StatBadge = ({ value, label }: StatBadgeProps): React.JSX.Element => (
  <div className="srt-badge">
    <div className="srt-badge-value">{value}</div>
    <div className="srt-badge-label">{label}</div>
  </div>
)

export const SectionRealTime = (): React.JSX.Element => {
  const stats: StatBadgeProps[] = [
    { value: "+142", label: "нові пісні" },
    { value: "+23",  label: "нові альбоми" },
    { value: "+57",  label: "нові мікси" },
  ]

  return (
    <div className="section-real-time">
      {/* Gradient background */}
      <div className="srt-gradient" />

      {/* Left: icon + title + subtitle */}
      <div className="srt-left">
        {/* Circular icon */}
        <div className="srt-icon-circle" aria-hidden="true">
          <img
            className="srt-icon"
            alt="AI real-time icon"
            src={`${ASSETS}/icon.svg`}
          />
          <div className="srt-icon-border" />
        </div>

        {/* Text block */}
        <div className="srt-text-block">
          <div className="srt-heading">Створено ШІ сьогодні</div>
          <p className="srt-subheading">Дані оновлюються в реальному часі</p>
        </div>
      </div>

      {/* Right: stat badges */}
      <div className="srt-badges">
        {stats.map((s) => (
          <StatBadge key={s.label} {...s} />
        ))}
      </div>
    </div>
  )
}
