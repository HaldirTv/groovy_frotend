import React from 'react'
import '../app.css'
import AiIcon from '../assets/AI.svg'

interface AiMixesPanelProps {
  children?: React.ReactNode
}

export const AiMixesPanel: React.FC<AiMixesPanelProps> = ({ children }) => {
  return (
    <div className='AiMixesBlock'>
      
      <div className='AiHeaderTop'>
        <img src={AiIcon} className='AiCardIcon' alt="AI-Icon" />
        
        <div className='AiHeaderTexts'>
          <span className='LisNowTrending'>Персональнізований алгоритм</span>
          <span className='TrendNowText'>Музика за стилем та настроєм</span>
        </div>
      </div>

      
      <div className='AiCardContentPlaceholder'>
        {children || (
          <span style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'SUSE, sans-serif' }}>
            Тут буде ваш контент: треки, візуалізатор тощо.
          </span>
        )}
      </div>
    </div>
  )
}
