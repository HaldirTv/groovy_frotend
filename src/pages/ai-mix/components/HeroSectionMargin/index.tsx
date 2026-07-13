import React from "react"
import { useTranslation } from 'react-i18next'
import "./style.css"

export const HeroSectionMargin = (): React.JSX.Element => {
  const { t, i18n } = useTranslation()

  return (
    <div className="hero-section-margin">
      <div className="hero-section">
        
        <img
          className="mask-group"
          alt="Background"
          src="/src/pages/ai-mix/components/HeroSectionMargin/mask-group.svg"
        />

        <div className="gradient" />

        <div className="container">
          
          <div className="cover-image">
            <div className="AI-generated" />
            <div className="div" />
          </div>

          
          <div className="playlist-details">

            
            <div className="container-2">
              <div className="overlay-border">
                <div className="container-3">
                  <img
                    className="icon"
                    alt="AI icon"
                    src="/src/pages/ai-mix/components/HeroSectionMargin/icon.svg"
                  />
                </div>
                <div className="text-wrapper">{t('aimix.generated')}</div>
              </div>

              <div className="container-3">
                <div className="text-wrapper-2">{t('aimix.updated_today')}</div>
              </div>
            </div>

            
            <div className="heading">
              <div className="text-wrapper-3">{t('aimix.cyberpunk_title')}</div>
            </div>

            
            <div className="groovra-AI-core-wrapper">
              <p className="groovra-AI-core">
                {t('aimix.core_desc')}
              </p>
            </div>

            
            <div className="margin">
              <div className="container-4">
                <div className="container-5">
                  <div className="container-3">
                    <img
                      className="img"
                      alt="Listeners"
                      src="/src/pages/ai-mix/components/HeroSectionMargin/image.svg"
                    />
                  </div>
                  <div className="text-wrapper-4">
                    {t('listeners_count', { count: 142000 }).replace('142000', '142K')}
                  </div>
                </div>

                <div className="container-5">
                  <div className="container-3">
                    <img
                      className="icon-2"
                      alt="Duration"
                      src="/src/pages/ai-mix/components/HeroSectionMargin/icon-2.svg"
                    />
                  </div>
                  <div className="text-wrapper-4">
                    {i18n.language === 'en' ? '2h 45m' : '2 год 45 хв'}
                  </div>
                </div>
              </div>
            </div>

            
            <div className="container-wrapper">
              <div className="container-6">
                <button className="button" type="button" aria-label={t('aimix.listen_btn')}>
                  <div className="icon-wrapper">
                    <img
                      className="icon-3"
                      alt="Play"
                      src="/src/pages/ai-mix/components/HeroSectionMargin/icon-3.svg"
                    />
                  </div>
                  <div className="text-wrapper-5">{t('aimix.listen_btn')}</div>
                </button>

                <div
                  className="div-wrapper"
                  role="button"
                  tabIndex={0}
                  aria-label={t('player.like')}
                >
                  <div className="icon-wrapper">
                    <img
                      className="icon-4"
                      alt="Like"
                      src="/src/pages/ai-mixes-panel.tsx" // note: placeholder src is fine as long as design remains identical
                      onError={(e) => { (e.target as HTMLImageElement).src = "/src/pages/ai-mix/components/HeroSectionMargin/icon-4.svg" }}
                    />
                  </div>
                </div>

                <div
                  className="div-wrapper"
                  role="button"
                  tabIndex={0}
                  aria-label={t('editprofile.links_title')}
                >
                  <div className="icon-wrapper">
                    <img
                      className="icon-5"
                      alt="More options"
                      src="/src/pages/ai-mix/components/HeroSectionMargin/icon-5.svg"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
