import React from 'react'
import { Navigate } from 'react-router-dom'
import { getAccessToken } from '../api/api-client'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = getAccessToken()
  const hasEmail = !!localStorage.getItem('UserEmail')

  
  if (!token && !hasEmail) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
