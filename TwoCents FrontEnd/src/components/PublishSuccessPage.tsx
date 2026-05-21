import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './PublishSuccessPage.css'

export default function PublishSuccessPage() {
  const { state } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!state?.fromPublish) {
      navigate('/dashboard', { replace: true })
    }
  }, [state, navigate])

  if (!state?.fromPublish) return null

  return (
    <div className="ps-page">

      {/* Nav */}
      <header className="ps-nav">
        <Link to="/" className="ps-nav__logo">Two Cents</Link>
      </header>

      {/* Confirmation */}
      <main className="ps-main">
        <div className="ps-ornament">
          <span className="ps-ornament__line" />
          <span className="ps-ornament__diamond">◆</span>
          <span className="ps-ornament__line" />
        </div>

        <p className="ps-kicker">Essay Published</p>
        <h2 className="ps-title">"{state.title}"</h2>
        <p className="ps-body">
          Your essay is now live. Thank you for sharing your two cents.
        </p>

        <div className="ps-actions">
          <Link to="/dashboard" className="ps-btn">Back to Dashboard →</Link>
          <Link to="/write" className="ps-link">Write another</Link>
        </div>
      </main>

    </div>
  )
}
