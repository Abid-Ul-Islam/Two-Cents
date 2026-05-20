import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import HomePage from './components/HomePage'
import LoginPage from './components/LoginPage.tsx'
import SignupPage from './components/SignupPage.tsx'
import DashboardPage from './components/DashboardPage.tsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element ={<SignupPage/>} />
        <Route path="/dashboard" element ={<DashboardPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App