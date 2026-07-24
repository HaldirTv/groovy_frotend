import React, { createContext, useContext, useState, useCallback } from 'react'
import { getAccessToken } from '../api/api-client'

interface AuthPromptContextType {
  isOpen: boolean
  message: string
  /** Повертає true, якщо юзер авторизований (дію можна виконувати одразу).
   *  Якщо ні — показує модалку з пропозицією увійти і повертає false. */
  requireAuth: (message?: string) => boolean
  closePrompt: () => void
}

const AuthPromptContext = createContext<AuthPromptContextType | undefined>(undefined)

export const AuthPromptProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')

  const requireAuth = useCallback((msg?: string): boolean => {
    const isAuthenticated = !!getAccessToken() || !!localStorage.getItem('UserEmail')
    if (isAuthenticated) return true

    setMessage(msg ?? '')
    setIsOpen(true)
    return false
  }, [])

  const closePrompt = useCallback(() => setIsOpen(false), [])

  return (
    <AuthPromptContext.Provider value={{ isOpen, message, requireAuth, closePrompt }}>
      {children}
    </AuthPromptContext.Provider>
  )
}

export const useAuthPrompt = () => {
  const context = useContext(AuthPromptContext)
  if (!context) throw new Error('useAuthPrompt must be used within AuthPromptProvider')
  return context
}
