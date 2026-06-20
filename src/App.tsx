// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { refreshSession } from './api/api-client'
import { Reg } from './pages/register'
import { Log } from './pages/login'
import { Create } from './pages/create'
import { Profile } from './pages/profile'
import { Forgot } from './pages/forgot-password'
import { Cod } from './pages/email-code'
import { Recovery } from './pages/password-recovery'
import { Main } from './pages/main-page'
import { ConfirmReg } from './pages/confirm-reg'
import { ProtectedRoute } from './components/protected-route'
import { PublicRoute } from './components/public-route'
import { Layout } from './components/layout'
import { PlayerProvider } from './context/player-context'
import './app.css'
import { AuthCallback } from './pages/auth-callback'

export const App = () => {
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const initApp = async () => {
      const isAuthCallback = window.location.pathname === '/auth/callback'
      if (!isAuthCallback && localStorage.getItem('UserEmail')) {
        await refreshSession()
      }
      setIsInitializing(false)
    }
    initApp()
  }, [])

  if (isInitializing) {
    return (
      <div
        className="Loader"
        style={{ color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#131313' }}
        aria-live="polite"
        aria-busy="true"
      >
        Завантаження...
      </div>
    )
  }

  return (
    <PlayerProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Navigate to='/main' replace />} />
          
          // ⚠️ Меняем путь здесь
          <Route path='/auth/callback' element={<AuthCallback />} />
          
          {/* Public Routes */}
          <Route path='/reg' element={<PublicRoute><Reg /></PublicRoute>} />
          <Route path='/login' element={<PublicRoute><Log /></PublicRoute>} />
          <Route path='/create' element={<PublicRoute><Create /></PublicRoute>} />
          <Route path='/confirm-reg' element={<PublicRoute><ConfirmReg /></PublicRoute>} />
          <Route path='/forgotpassword' element={<PublicRoute><Forgot /></PublicRoute>} />
          <Route path='/emailcod' element={<PublicRoute><Cod /></PublicRoute>} />
          <Route path='/passwordrecovery' element={<PublicRoute><Recovery /></PublicRoute>} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path='/profile' element={<Profile />} />
            <Route path='/main' element={<Main />} />
          </Route>
          
          {/* Fallback */}
          <Route path='*' element={<Navigate to='/main' replace />} />
        </Routes>
      </Router>
    </PlayerProvider>
  )
}

export default App
