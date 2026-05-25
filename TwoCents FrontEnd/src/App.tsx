import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

import HomePage from './components/HomePage'
import LoginPage from './components/LoginPage.tsx'
import SignupPage from './components/SignupPage.tsx'
import DashboardPage from './components/DashboardPage.tsx'
import WriteBlogPage from './components/WriteBlogPage.tsx'
import PublishSuccessPage from './components/PublishSuccessPage.tsx'
import ProfilePage from './components/ProfilePage.tsx'
import BlogDetailPage from './components/BlogDetailPage.tsx'
import SearchResultsPage from './components/SearchResultsPage.tsx'
import UserProfilePage from './components/UserProfilePage.tsx'
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
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/blog/:id" element={<ProtectedRoute><BlogDetailPage /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchResultsPage /></ProtectedRoute>} />
          <Route path="/user/:id" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App