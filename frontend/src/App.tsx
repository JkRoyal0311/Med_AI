import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { ThemeProvider } from './context/ThemeContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import ChatPage from './pages/ChatPage'
import ProfilePage from './pages/ProfilePage'
import ResultPage from './pages/ResultPage'
import SymptomsPage from './pages/SymptomsPage'
import MedicalInfoPage from './pages/MedicalInfoPage'
import DiseasesListPage from './pages/DiseasesListPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuthStore()
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-teal-200 border-t-teal-600 animate-spin"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }
  
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

export default function App() {
  const restore = useAuthStore((s: any) => s.restore)
  
  useEffect(() => {
    restore()
  }, [])
  
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/result" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
          <Route path="/symptoms" element={<ProtectedRoute><SymptomsPage /></ProtectedRoute>} />
          <Route path="/diseases" element={<ProtectedRoute><DiseasesListPage /></ProtectedRoute>} />
          <Route path="/medical-info/:disease" element={<ProtectedRoute><MedicalInfoPage /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
