import React from 'react'
import { Navigate } from 'react-router-dom'
import { getAccessToken } from '../api/api-client'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = getAccessToken()
  const hasEmail = !!localStorage.getItem('UserEmail')

  // Якщо немає токену та немає імейлу для рефрешу, то користувач точно не авторизований
  if (!token && !hasEmail) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
