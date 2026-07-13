import React, { useState } from 'react'
import '../app.css'

interface NotificationItem {
  id: string
  title: string
  description: string
  gradient: string
  initials: string
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'Перегляньте нові релізи цієї п’ятниці',
    description: 'Понад 20 артистів зробили нові релізи',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
    initials: '🔥'
  },
  {
    id: '2',
    title: '“Weezer” випустили новий альбом',
    description: 'Станьте одним із перших слухачів',
    gradient: 'linear-gradient(135deg, #A98FDB 0%, #72DEEF 100%)',
    initials: '🎸'
  },
  {
    id: '3',
    title: 'Музика України',
    description: 'Ми зробили підбірку найпопулярніших треків серед українців',
    gradient: 'linear-gradient(135deg, #FFD93D 0%, #FF8400 100%)',
    initials: '🇺🇦'
  },
  {
    id: '4',
    title: 'Музика світу',
    description: 'Ми зробили підбірку найпопулярніших треків в усьому світі',
    gradient: 'linear-gradient(135deg, #4E65FF 0%, #92EFFD 100%)',
    initials: '🌎'
  },
  {
    id: '5',
    title: 'Новинки рок музики',
    description: 'Перегляньте релізи серед жанру рок',
    gradient: 'linear-gradient(135deg, #ED213A 0%, #93291E 100%)',
    initials: '⚡'
  }
]

interface NotificationDropdownProps {
  isOpen: boolean
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('notifications')
    if (saved !== null) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Error parsing notifications from localStorage', e)
      }
    }
    
    localStorage.setItem('notifications', JSON.stringify(INITIAL_NOTIFICATIONS))
    return INITIAL_NOTIFICATIONS
  })

  if (!isOpen) return null

  const handleClearAll = () => {
    setNotifications([])
    localStorage.setItem('notifications', JSON.stringify([]))
  }

  const handleRemoveItem = (id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(item => item.id !== id)
      localStorage.setItem('notifications', JSON.stringify(updated))
      return updated
    })
  }

  if (notifications.length === 0) {
    return (
      <div className="div-wrapper empty-state" onClick={(e) => e.stopPropagation()}>
        <div className="text-wrapper">Немає повідомлень</div>
        <p className="div">
          На разі тут пусто, але ми одразу <br /> вас повідомимо, якщо щось з’явиться
        </p>
      </div>
    )
  }

  return (
    <div className="div-wrapper" onClick={(e) => e.stopPropagation()}>
      <div className="notification-header">
        <span className="notification-title">Сповіщення</span>
        <button className="notification-clear-btn" onClick={handleClearAll}>
          Очистити все
        </button>
      </div>
      
      <div className="notification-list">
        {notifications.map((item) => (
          <div key={item.id} className="notification-item">
            <div 
              className="notification-avatar"
              style={{ background: item.gradient }}
            >
              {item.initials}
            </div>
            <div className="notification-content">
              <span className="notification-item-title">{item.title}</span>
              <span className="notification-item-desc">{item.description}</span>
            </div>
            <button 
              className="notification-delete-btn" 
              onClick={() => handleRemoveItem(item.id)}
              title="Видалити"
              aria-label="Видалити сповіщення"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
