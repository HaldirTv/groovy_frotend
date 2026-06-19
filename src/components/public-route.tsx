import React from 'react'
import { Navigate } from 'react-router-dom'
import { getAccessToken } from '../api/api-client'

interface PublicRouteProps {
  children: React.ReactNode
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const token = getAccessToken()

  // Якщо користувач вже авторизований, перенаправляємо його на головну сторінку
  if (token) {
    return <Navigate to="/main" replace />
  }

  return <>{children}</>
}
