import React from "react"
import { useTranslation } from 'react-i18next'
import "./style.css"

const ASSETS = "/src/pages/ai-mix/components/ContentGridAi"

const popularTracks = [
  { img: `${ASSETS}/image.png`,      title: "Neon Horizon",   plays: "1.2M відтворень", playsEn: "1.2M plays" },
  { img: `${ASSETS}/mask-group.png`,  title: "Synthetic Love",  plays: "950K відтворень", playsEn: "950K plays" },
  { img: `${ASSETS}/mask-group-2.png`,title: "Digital Soul",    plays: "820K відтворень", playsEn: "820K plays" },
  { img: `${ASSETS}/mask-group-3.png`,title: "Cyber City",      plays: "750K відтворень", playsEn: "750K plays" },
]

const genres = [
  { name: "Cyberpunk",      percentage: "42%" },
  { name: "Synthwave",      percentage: "28%" },
  { name: "Neuro Lofi",     percentage: "18%" },
  { name: "AI Ambient",     percentage: "12%" },
]

const models = [
  { key: "m1" },
  { key: "m2" },
  { key: "m3" },
]

export const ContentGridAi = (): React.JSX.Element => {
  const { t, i18n } = useTranslation()
  const isEn = i18n.language === 'en'

  return (
    <div className="content-grid-ai">
      
      {/* 1. Popular AI Tracks */}
      <div className="container-popular">
        <div className="heading-popular">
          <h2 className="text-wrapper-popular">{t('aimix.popular_title')}</h2>
        </div>
        <div className="container-tracks-list">
          {popularTracks.map((track, index) => (
            <div className="container-track-row" key={index}>
              <span className="text-wrapper-index">{(index + 1).toString().padStart(2, '0')}</span>
              <img className="image-track-cover" alt={track.title} src={track.img} />
              <div className="container-track-meta">
                <div className="text-wrapper-track-title">{track.title}</div>
                <div className="text-wrapper-plays-count">
                  {isEn ? track.playsEn : track.plays}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Trending Genres */}
      <div className="container-genres">
        <div className="heading-genres">
          <h2 className="text-wrapper-genres">{t('aimix.trending_genres')}</h2>
        </div>
        <div className="container-genres-list">
          {genres.map((genre) => (
            <div className="container-genre-row" key={genre.name}>
              <div className="text-wrapper-genre-name">{genre.name}</div>
              <div className="container-progress-bar">
                <div className="background" />
                <div className="fill" style={{ width: genre.percentage }} />
              </div>
              <div className="text-wrapper-percentage">{genre.percentage}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. AI Models */}
      <div className="container-models">
        <div className="heading-models">
          <h2 className="text-wrapper-models">{t('aimix.our_models')}</h2>
        </div>
        <div className="container-models-list">
          {models.map((model) => (
            <div className="container-model-card" key={model.key}>
              <div className="heading-model-title">{t(`aimix.models.${model.key}_title`)}</div>
              <p className="paragraph-model-desc">
                {t(`aimix.models.${model.key}_desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
