import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './DashboardPage.css'

export default function DashboardPage() {
  const { logout } = useAuth()

  return (
    <div className="db-page">

      {/* Nav */}
      <header className="db-nav">
        <div className="db-nav__spacer" />
        <Link to="/" className="db-nav__logo">Two Cents</Link>
        <button onClick={logout} className="db-nav__logout">Logout</button>
      </header>

      {/* Body */}
      <main className="db-main">
        <div className="db-section-label">Your Dashboard</div>

        <div className="db-cards">
          <Link to="/write" className="db-card">
            <span className="db-card__kicker">◆ New Essay</span>
            <h2 className="db-card__title">Write a Blog</h2>
            <p className="db-card__body">
              Share your perspective with readers who want to think.
            </p>
            <span className="db-card__cta">Start Writing →</span>
          </Link>
        </div>
      </main>

    </div>
  )
}
