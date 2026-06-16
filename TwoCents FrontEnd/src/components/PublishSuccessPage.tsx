import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './PublishSuccessPage.css'

export default function PublishSuccessPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  useEffect(() => {
    if (!state?.fromPublish) {
      navigate('/', { replace: true })
    }
  }, [state, navigate])

  if (!state?.fromPublish) return null

  return (
    <div className="ps-page">

      {/* Nav */}
      <header className="ps-nav">
        <div className="ps-nav__spacer" />
        <Link to="/" className="ps-nav__logo">Two Cents</Link>
        <div className="ps-nav__right">
          <Link to="/profile" className="ps-nav__profile">Profile</Link>
          <button onClick={logout} className="ps-nav__logout">Logout</button>
        </div>
      </header>

      {/* Confirmation */}
      <main className="ps-main">
        <div className="ps-ornament">
          <span className="ps-ornament__line" />
          <span className="ps-ornament__diamond">◆</span>
          <span className="ps-ornament__line" />
        </div>

        <p className="ps-kicker">Blog Published</p>
        <h2 className="ps-title">"{state.title}"</h2>
        <p className="ps-body">
          Your blog is now live. Thank you for sharing your two cents.
        </p>

        <div className="ps-actions">
          <Link to="/" className="ps-btn">Back to Home →</Link>
          <Link to="/write" className="ps-link">Write another</Link>
        </div>
      </main>

    </div>
  )
}
