import React from "react"
import { useTranslation } from 'react-i18next'
import "./style.css"

export const SectionRealTime = (): React.JSX.Element => {
  const { t } = useTranslation()

  return (
    <div className="section-real-time">
      <div className="heading-real-time">
        <h2 className="text-wrapper">{t('aimix.real_time_created')}</h2>
      </div>

      <div className="paragraph">
        <p className="data-updates-in-real">
          {t('aimix.real_time_desc')}
        </p>
      </div>

      <div className="div-live-grid">
        <div className="div-live-card">
          <div className="div-stat-value-large">
            <span className="text-wrapper-2">1,245 </span>
            <span className="text-wrapper-3">bpm</span>
          </div>
        </div>

        <div className="div-live-card">
          <div className="div-stat-value-large">
            <span className="text-wrapper-2">87 </span>
            <span className="text-wrapper-3">gen/m</span>
          </div>
        </div>

        <div className="div-live-card">
          <div className="div-stat-value-large">
            <span className="text-wrapper-4">4.2 </span>
            <span className="text-wrapper-3">tb/h</span>
          </div>
        </div>
      </div>
    </div>
  )
}
