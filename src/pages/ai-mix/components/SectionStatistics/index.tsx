import React from "react"
import "./style.css"











const ASSETS = "/src/pages/ai-mix/components/SectionStatistics"

interface StatCardProps {
  iconSrc: string
  iconClass: string
  iconAlt: string
  label: string
  value: string
  maskSrc: string
}

const StatCard = ({
  iconSrc,
  iconClass,
  iconAlt,
  label,
  value,
  maskSrc,
}: StatCardProps): React.JSX.Element => (
  <div className="ss-overlay-border">
    <div className="ss-margin">
      <img className={`ss-${iconClass}`} alt={iconAlt} src={iconSrc} />
    </div>
    <div className="ss-text-wrapper">{label}</div>
    <div className="ss-div">{value}</div>
    <img className="ss-mask-group" alt="Background" src={maskSrc} />
    <div className="ss-overlay-blur" />
  </div>
)

export const SectionStatistics = (): React.JSX.Element => {
  const stats: StatCardProps[] = [
    {
      iconSrc: `${ASSETS}/icon.svg`,
      iconClass: "icon",
      iconAlt: "AI Mixes icon",
      label: "ШІ МІКСИ",
      value: "12,450",
      maskSrc: `${ASSETS}/mask-group.svg`,
    },
    {
      iconSrc: `${ASSETS}/image.svg`,
      iconClass: "img",
      iconAlt: "Songs icon",
      label: "ПІСНІ",
      value: "87,320",
      maskSrc: `${ASSETS}/mask-group-2.svg`,
    },
    {
      iconSrc: `${ASSETS}/icon-2.svg`,
      iconClass: "icon",
      iconAlt: "Albums icon",
      label: "АЛЬБОМИ",
      value: "4,210",
      maskSrc: `${ASSETS}/mask-group-3.svg`,
    },
    {
      iconSrc: `${ASSETS}/icon-3.svg`,
      iconClass: "icon-2",
      iconAlt: "Hours icon",
      label: "ГОДИНИ",
      value: "2.8M",
      maskSrc: `${ASSETS}/mask-group-4.svg`,
    },
  ]

  return (
    <div className="section-statistics">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}
