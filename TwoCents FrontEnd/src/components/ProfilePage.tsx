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

  return (
    <div className="pf-page">
      <div className="pf-body">

        {/* ── Left: Identity Panel ── */}
        <aside className="pf-panel">
          <Link to="/dashboard" className="pf-panel__home">← Dashboard</Link>

          <div className="pf-panel__top">
            <div className="pf-panel__ornament">
              <span className="pf-panel__ornament-line" />
              <span className="pf-panel__ornament-diamond">◆</span>
              <span className="pf-panel__ornament-line" />
            </div>
            <Link to="/" className="pf-panel__logo">Two Cents</Link>
            <p className="pf-panel__tagline">Good writing finds its people here.</p>
          </div>

          <div className="pf-panel__identity">
            <p className="pf-panel__kicker">Your Profile</p>
            <h1 className="pf-panel__name">{user.name}</h1>

            <dl className="pf-panel__fields">
              <div className="pf-panel__field">
                <dt>Email</dt>
                <dd>{user.email}</dd>
              </div>
              {user.gender && (
                <div className="pf-panel__field">
                  <dt>Gender</dt>
                  <dd>{user.gender}</dd>
                </div>
              )}
            </dl>
          </div>

          <p className="pf-panel__byline">A writer at Two Cents.</p>
        </aside>

        {/* ── Right: Essays ── */}
        <section className="pf-essays-side">
          <button onClick={logout} className="pf-essays-side__logout">Logout</button>

          <div className="pf-essays-side__inner">
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
                {blogs.map((b, idx) => (
                  <li key={b.id} className="pf-essay">
                    <Link to={`/blog/${b.id}`} className="pf-essay__link">
                      <span className="pf-essay__num">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div className="pf-essay__content">
                        <div className="pf-essay__title-row">
                          <h3 className="pf-essay__title">{b.title}</h3>
                          <span className="pf-essay__upvotes">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="pf-essay__upvote-icon">
                              <path d="M12 2L3 13h5v9h8v-9h5L12 2z" />
                            </svg>
                            {b.upvoteCount}
                          </span>
                        </div>
                        <p className="pf-essay__excerpt">{b.body}</p>
                        <span className="pf-essay__cta">Read essay →</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>

      </div>
    </div>
  )
}
