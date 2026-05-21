import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

import HomePage from './components/HomePage'
import LoginPage from './components/LoginPage.tsx'
import SignupPage from './components/SignupPage.tsx'
import DashboardPage from './components/DashboardPage.tsx'
import WriteBlogPage from './components/WriteBlogPage.tsx'
import PublishSuccessPage from './components/PublishSuccessPage.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/write" element={<ProtectedRoute><WriteBlogPage /></ProtectedRoute>} />
          <Route path="/write/success" element={<ProtectedRoute><PublishSuccessPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App