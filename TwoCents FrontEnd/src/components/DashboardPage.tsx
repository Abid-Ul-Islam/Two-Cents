import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './DashboardPage.css'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div className="db-page">
      <div className="db-body">

        {/* Left: Identity Panel */}
        <aside className="db-panel">
          <Link to="/" className="db-panel__home">&larr; Home</Link>

          <div className="db-panel__top">
            <div className="db-panel__ornament">
              <span className="db-panel__ornament-line" />
              <span className="db-panel__ornament-diamond">&#9670;</span>
              <span className="db-panel__ornament-line" />
            </div>
            <Link to="/" className="db-panel__logo">Two Cents</Link>
            <p className="db-panel__tagline">Good writing finds its people here.</p>
          </div>

          <div className="db-panel__identity">
            <p className="db-panel__kicker">Your Workspace</p>
            <h1 className="db-panel__name">{user?.name}</h1>
            <dl className="db-panel__fields">
              <div className="db-panel__field">
                <dt>Email</dt>
                <dd>{user?.email}</dd>
              </div>
            </dl>
          </div>

          <button onClick={logout} className="db-panel__logout">Sign Out</button>
        </aside>

        {/* Right: Search & Actions */}
        <main className="db-main">

          <section className="db-search">
            <div className="db-search__heading">
              <span className="db-search__label">Find Writers</span>
            </div>
            <form className="db-search__form" onSubmit={handleSearch}>
              <input
                className="db-search__input"
                type="text"
                placeholder="Search by name..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <button className="db-search__btn" type="submit">Search</button>
            </form>
          </section>

          <section className="db-actions">
            <div className="db-actions__heading">
              <span className="db-actions__label">Quick Actions</span>
            </div>

            <Link to="/write" className="db-action">
              <span className="db-action__num">01</span>
              <div className="db-action__content">
                <span className="db-action__kicker">&#9670; New Essay</span>
                <h2 className="db-action__title">Write a Blog</h2>
                <p className="db-action__body">
                  Share your perspective with readers who want to think.
                </p>
                <span className="db-action__cta">Start Writing &rarr;</span>
              </div>
            </Link>

            <Link to="/profile" className="db-action">
              <span className="db-action__num">02</span>
              <div className="db-action__content">
                <span className="db-action__kicker">&#9670; Account</span>
                <h2 className="db-action__title">My Profile</h2>
                <p className="db-action__body">
                  Review your account details and published essays.
                </p>
                <span className="db-action__cta">View Profile &rarr;</span>
              </div>
            </Link>
          </section>

        </main>
      </div>
    </div>
  )
}
