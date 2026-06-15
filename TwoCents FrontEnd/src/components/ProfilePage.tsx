import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchWithAuth } from '../utils/fetchWithAuth'
import { BASE_URL } from '../config'
import './ProfilePage.css'

interface Blog {
  id: string
  title: string
  body: string
  authorId: string
  authorName: string
  createdAt: string
  upvoteCount: number
  isUpvotedByCurrentUser: boolean
  tags: Array<{ id: number; name: string; slug: string }>
}

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [blogsLoading, setBlogsLoading] = useState(true)
  const [blogsError, setBlogsError] = useState('')

  useEffect(() => {
    if (!user) return
    let cancelled = false

    ;(async () => {
      try {
        const res = await fetchWithAuth(`${BASE_URL}/api/blog?authorId=${user.id}`)
        if (!res.ok) {
          if (!cancelled) setBlogsError('Could not load your essays.')
          return
        }
        const data: Blog[] = await res.json()
        if (!cancelled) setBlogs(data)
      } catch {
        if (!cancelled) setBlogsError('Could not reach the server.')
      } finally {
        if (!cancelled) setBlogsLoading(false)
      }
    })()

    return () => { cancelled = true }
  }, [user])

  if (!user) return null

  const totalUpvotes = blogs.reduce((sum, b) => sum + b.upvoteCount, 0)

  return (
    <div className="pf-page">

      {/* Nav */}
      <nav className="pf-nav">
        <Link to="/dashboard" className="pf-nav__back">← Dashboard</Link>
        <Link to="/" className="pf-nav__logo">Two Cents</Link>
        <button onClick={logout} className="pf-nav__action">Logout</button>
      </nav>

      {/* Profile header */}
      <header className="pf-header">
        <div className="pf-header__inner">
          <h1 className="pf-header__name">{user.name}</h1>

          <dl className="pf-header__details">
            <div className="pf-header__detail">
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
            {user.gender && (
              <div className="pf-header__detail">
                <dt>Gender</dt>
                <dd>{user.gender}</dd>
              </div>
            )}
          </dl>

          {!blogsLoading && !blogsError && (
            <div className="pf-stats">
              <div className="pf-stat">
                <span className="pf-stat__value">{blogs.length}</span>
                <span className="pf-stat__label">Essays</span>
              </div>
              <div className="pf-stat">
                <span className="pf-stat__value">0</span>
                <span className="pf-stat__label">Subscribers</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Essays */}
      <main className="pf-essays">
        <div className="pf-essays__inner">

          <div className="pf-essays__heading">
            <span className="pf-essays__heading-label">Your Essays</span>
            {!blogsLoading && !blogsError && (
              <span className="pf-essays__heading-count">
                {String(blogs.length).padStart(2, '0')}
              </span>
            )}
          </div>

          {blogsLoading && (
            <p className="pf-essays__state">Gathering your words…</p>
          )}

          {!blogsLoading && blogsError && (
            <p className="pf-essays__state pf-essays__state--error">{blogsError}</p>
          )}

          {!blogsLoading && !blogsError && blogs.length === 0 && (
            <p className="pf-essays__state">No essays yet. The page is waiting.</p>
          )}

          {!blogsLoading && !blogsError && blogs.length > 0 && (
            <ol className="pf-essay-list">
              {blogs.map(b => (
                <li key={b.id} className="pf-essay">
                  <Link to={`/blog/${b.id}`} className="pf-essay__link">
                    <div className="pf-essay__top">
                      <h3 className="pf-essay__title">{b.title}</h3>
                      <span className="pf-essay__upvotes">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="pf-essay__upvote-icon">
                          <path d="M12 2L3 13h5v9h8v-9h5L12 2z" />
                        </svg>
                        {b.upvoteCount}
                      </span>
                    </div>
                    <div className="pf-essay__byline">
                      {b.tags.length > 0 && (
                        <span className="pf-essay__tags">
                          {b.tags.map(t => t.name).join(' · ')}
                        </span>
                      )}
                      <span className="pf-essay__date">
                        {new Date(b.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="pf-essay__excerpt">{b.body}</p>
                    <span className="pf-essay__cta">Read essay →</span>
                  </Link>
                </li>
              ))}
            </ol>
          )}

        </div>
      </main>

    </div>
  )
}
