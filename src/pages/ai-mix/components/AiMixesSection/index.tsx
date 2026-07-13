import React from "react"
import { useTranslation } from 'react-i18next'
import "./style.css"

const ASSETS = "/src/pages/ai-mix/components/AiMixesSection"

const mixes = [
  { img: `${ASSETS}/image.png`,      name: "Cyberpunk Beats" },
  { img: `${ASSETS}/mask-group.png`,  name: "Synthesized Lofi" },
  { img: `${ASSETS}/mask-group-2.png`,name: "Neural Ambient"  },
  { img: `${ASSETS}/mask-group-3.png`,name: "Digital Chill"   },
]

export const AiMixesSection = (): React.JSX.Element => {
  const { t } = useTranslation()

  return (
    <div className="ai-mixes-section">
      
      <div className="container-header">
        <div className="heading-mixes">
          <h2 className="text-wrapper-mixes">{t('aimix.rec_title')}</h2>
        </div>
        <button className="button-all-mixes" type="button" aria-label={t('aimix.all_mixes')}>
          <span className="text-wrapper-all">{t('aimix.all_mixes')}</span>
          <img
            className="icon-arrow"
            alt="Arrow"
            src="/src/pages/ai-mix/components/AiMixesSection/icon.svg"
          />
        </button>
      </div>

      
      <div className="container-mixes-grid">
        {mixes.map((mix, index) => (
          <div className="container-mix-card" key={index}>
            <div className="image-mix-cover">
              <img className="img-mix" alt={mix.name} src={mix.img} />
            </div>
            <div className="container-mix-info">
              <div className="text-wrapper-mix-name">{mix.name}</div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
