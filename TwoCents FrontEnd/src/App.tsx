import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import HomePage from './components/HomePage'
import LoginPage from './components/LoginPage.tsx'
import SignupPage from './components/SignupPage.tsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element ={<SignupPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App