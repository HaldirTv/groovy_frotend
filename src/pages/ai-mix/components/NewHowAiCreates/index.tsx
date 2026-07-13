import React from "react"
import { useTranslation } from 'react-i18next'
import "./style.css"

const steps = [
  { num: "01", key: "s1" },
  { num: "02", key: "s2" },
  { num: "03", key: "s3" },
  { num: "04", key: "s4" },
]

export const NewHowAiCreates = (): React.JSX.Element => {
  const { t } = useTranslation()

  return (
    <div className="new-how-ai-creates">
      
      <div className="container-header">
        <div className="heading-how">
          <h2 className="text-wrapper-how">{t('aimix.how_title')}</h2>
        </div>
        <p className="paragraph-how-desc">
          {t('aimix.how_desc')}
        </p>
      </div>

      
      <div className="container-steps-row">
        {steps.map((step) => (
          <div className="container-step-card" key={step.num}>
            <div className="text-wrapper-step-num">{step.num}</div>
            <div className="container-step-text">
              <h3 className="heading-step-title">{t(`aimix.steps.${step.key}_title`)}</h3>
              <p className="paragraph-step-desc">
                {t(`aimix.steps.${step.key}_desc`)}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
