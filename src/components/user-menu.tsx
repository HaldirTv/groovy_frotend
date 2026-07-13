import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../api/auth'
import { usePlayer } from '../context/player-context'
import Avatar from '../assets/IconAvatar.svg'
import '../app.css'

interface UserMenuProps {
  profileName: string
  avatarUrl?: string | null
}

export const UserMenu: React.FC<UserMenuProps> = ({ profileName, avatarUrl }) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { setActiveTab } = usePlayer()

  const handleLogout = async () => {
    await logoutUser()
  }

  // Закриття по клику вне меню
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="profileCont" ref={menuRef} onClick={() => setIsOpen(!isOpen)}>
      <img src={avatarUrl || Avatar} className="AvatarIcon" alt="Avatar" />
      
      <button className="ButtonProfile" type="button">
        {profileName}
      </button>

      {/* Стрелочка */}
      <svg className={`ArrowDown ${isOpen ? 'open' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
      </svg>

      {/* Выпадающее меню */}
      {isOpen && (
        <div className="ProfileDropdown" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => { setIsOpen(false); navigate('/profile') }} className="ProfileDropdownItem">
            Акаунт
          </button>
          <button onClick={() => { setIsOpen(false); setActiveTab('Settings'); navigate('/main') }} className="ProfileDropdownItem">
            Налаштування
          </button>
          
          <div className="ProfileDropdownDivider"></div>
          
          <button onClick={handleLogout} className="ProfileDropdownItem">
            Вийти
          </button>
        </div>
      )}
    </div>
  )
}
