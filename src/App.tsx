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
import { AiMixPage } from './pages/ai-mix'
import { AuthCallback } from './pages/auth-callback'
import { ProtectedRoute } from './components/protected-route'
import { PublicRoute } from './components/public-route'
import { Layout } from './components/layout'
import { PlayerProvider } from './context/player-context'
import { DownloadsPage } from './pages/downloads'
import { ProfileProvider } from './context/profile context'
import './app.css'
import { ConfirmReg } from './pages/confirm-reg'

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
    <ProfileProvider>
      <PlayerProvider>
        <Router>
          <Routes>
            <Route path='/' element={<Navigate to='/main' replace />} />
            
            {/* Public Routes (only for unauthenticated users) */}
            <Route path='/reg' element={<PublicRoute><Reg /></PublicRoute>} />
            <Route path='/login' element={<PublicRoute><Log /></PublicRoute>} />
            <Route path='/create' element={<PublicRoute><Create /></PublicRoute>} />
            <Route path='/confirm-reg' element={<PublicRoute><ConfirmReg /></PublicRoute>} />
            <Route path='/forgotpassword' element={<PublicRoute><Forgot /></PublicRoute>} />
            <Route path='/emailcod' element={<PublicRoute><Cod /></PublicRoute>} />
            <Route path='/passwordrecovery' element={<PublicRoute><Recovery /></PublicRoute>} />
            <Route path='/auth/callback' element={<PublicRoute><AuthCallback /></PublicRoute>} />
            
            {/* Protected Routes inside persistent layout with global audio */}
            <Route element={<Layout />}>
              <Route path='/profile' element={<Profile />} />
              <Route path='/main' element={<Main />} />
              <Route path='/ai-mix' element={<AiMixPage />} />
              <Route path='/downloads' element={<DownloadsPage />} />
            </Route>
            
            {/* Wildcard/Fallback */}
            <Route path='*' element={<Navigate to='/main' replace />} />
          </Routes>
        </Router>
      </PlayerProvider>
    </ProfileProvider>
  )
}

export default App