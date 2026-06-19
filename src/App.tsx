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
import { AuthCallback } from './pages/auth-callback'
import { ProtectedRoute } from './components/protected-route'
import { PublicRoute } from './components/public-route'
import { Layout } from './components/layout'
import { PlayerProvider } from './context/player-context'
import './app.css'

export const App = () => {
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const initApp = async () => {
      if (localStorage.getItem('UserEmail')) {
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
          
          {/* Public Routes (only for unauthenticated users) */}
          <Route path='/reg' element={<PublicRoute><Reg /></PublicRoute>} />
          <Route path='/login' element={<PublicRoute><Log /></PublicRoute>} />
          <Route path='/create' element={<PublicRoute><Create /></PublicRoute>} />
          <Route path='/forgotpassword' element={<PublicRoute><Forgot /></PublicRoute>} />
          <Route path='/emailcod' element={<PublicRoute><Cod /></PublicRoute>} />
          <Route path='/passwordrecovery' element={<PublicRoute><Recovery /></PublicRoute>} />
          <Route path='/auth/callback' element={<PublicRoute><AuthCallback /></PublicRoute>} />
          
          {/* Protected Routes inside persistent layout with global audio */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path='/profile' element={<Profile />} />
            <Route path='/main' element={<Main />} />
          </Route>
          
          {/* Wildcard/Fallback */}
          <Route path='*' element={<Navigate to='/main' replace />} />
        </Routes>
      </Router>
    </PlayerProvider>
  )
}

export default App