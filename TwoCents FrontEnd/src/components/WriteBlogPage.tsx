import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BASE_URL } from '../config'
import { useAuth } from '../context/AuthContext'
import { fetchWithAuth } from '../utils/fetchWithAuth'
import './WriteBlogPage.css'

export default function WriteBlogPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const [formData, setFormData] = useState({ title: '', body: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.title.trim() || !formData.body.trim()) {
      setError('Both a title and body are required')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetchWithAuth(`${BASE_URL}/api/blog`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Title: formData.title, Body: formData.body }),
      })

      if (res.ok) {
        navigate('/write/success', { state: { title: formData.title, fromPublish: true } })
      } else {
        const data = await res.json()
        setError(data.message ?? 'Something went wrong')
      }
    } catch {
      setError('Could not reach the server. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="wb-page">

      {/* Nav */}
      <header className="wb-nav">
        <Link to="/dashboard" className="wb-nav__back">← Dashboard</Link>
        <Link to="/" className="wb-nav__logo">Two Cents</Link>
        <button onClick={logout} className="wb-nav__logout">Logout</button>
      </header>

      {/* Editor */}
      <main className="wb-main">
        <div className="wb-section-label">◆ New Essay</div>

        {error && <p className="wb-error">{error}</p>}

        <form onSubmit={handleSubmit} className="wb-form">
          <input
            name="title"
            type="text"
            placeholder="Your title here…"
            value={formData.title}
            onChange={handleChange}
            className="wb-title-input"
            maxLength={200}
          />

          <div className="wb-divider" />

          <textarea
            name="body"
            placeholder="Write your essay…"
            value={formData.body}
            onChange={handleChange}
            className="wb-body-input"
          />

          <div className="wb-actions">
            <button type="submit" className="wb-submit" disabled={isLoading}>
              {isLoading ? 'Publishing…' : 'Publish Essay'}
            </button>
            <Link to="/dashboard" className="wb-cancel">Discard</Link>
          </div>
        </form>
      </main>

    </div>
  )
}
