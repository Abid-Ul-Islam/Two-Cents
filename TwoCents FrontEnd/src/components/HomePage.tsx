import { useState, useEffect } from 'react'
import './HomePage.css'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchWithAuth } from '../utils/fetchWithAuth'
import { capitalize, capitalizeName } from '../utils/text'
import { BASE_URL } from '../config'
import ComposerModal from './ComposerModal'

interface Blog {
  id: string
  title: string
  body: string
  authorId: string
  authorName: string
  createdAt: string
  upvoteCount: number
  commentCount: number
  isUpvotedByCurrentUser: boolean
  tags: Array<{ id: number; name: string; slug: string }>
}

export default function HomePage() {
  const { isLoggedIn, loading, logout, user } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [hadSession] = useState(() => localStorage.getItem('hadSession') === '1')

  const [feed, setFeed] = useState<Blog[]>([])
  const [feedLoading, setFeedLoading] = useState(true)
  const [feedError, setFeedError] = useState('')

  const [showComposer, setShowComposer] = useState(false)

  function loadFeed() {
    setFeedLoading(true)
    setFeedError('')
    return fetchWithAuth(`${BASE_URL}/api/feed`)
      .then(res => {
        if (!res.ok) {
          setFeedError('Could not load the feed.')
          return []
        }
        return res.json()
      })
      .then((data: Blog[]) => setFeed(data))
      .catch(() => setFeedError('Could not reach the server.'))
      .finally(() => setFeedLoading(false))
  }

  useEffect(() => {
    if (!isLoggedIn) return
    loadFeed()
  }, [isLoggedIn])

  async function toggleUpvote(blogId: string) {
    const target = feed.find(b => b.id === blogId)
    if (!target) return
    const wasUpvoted = target.isUpvotedByCurrentUser

    setFeed(prev => prev.map(b => b.id === blogId
      ? { ...b, isUpvotedByCurrentUser: !wasUpvoted, upvoteCount: wasUpvoted ? b.upvoteCount - 1 : b.upvoteCount + 1 }
      : b
    ))

    try {
      const res = await fetchWithAuth(`${BASE_URL}/api/blog/${blogId}/vote`, {
        method: wasUpvoted ? 'DELETE' : 'POST',
      })
      if (!res.ok) throw new Error()
    } catch {
      setFeed(prev => prev.map(b => b.id === blogId
        ? { ...b, isUpvotedByCurrentUser: wasUpvoted, upvoteCount: wasUpvoted ? b.upvoteCount + 1 : b.upvoteCount - 1 }
        : b
      ))
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  const showFeed = isLoggedIn || (loading && hadSession)

  return (
    <div className="page">

      {showFeed ? (
        /* ── Light nav (logged in) ── */
        <header className="home-nav">
          <Link to="/" className="home-nav__logo">Two Cents</Link>

          <form className="home-nav__search" onSubmit={handleSearch}>
            <input
              className="home-nav__search-input"
              type="text"
              placeholder="Search writers..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button className="home-nav__search-btn" type="submit" aria-label="Search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="home-nav__search-icon">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>

          <div className="home-nav__links">
            <button onClick={logout} className="home-nav__link home-nav__link--btn">Logout</button>
          </div>
        </header>
      ) : (
        /* ── Hero (logged out) ── */
        <section className="hero">

          {/* Slim auth strip */}
          <div className="hero__strip">
            <div className="hero__strip-links">
              <Link to="/login" className="strip-link">Login</Link>
              <Link to="/signup" className="strip-btn">Sign Up</Link>
            </div>
          </div>

          {/* Masthead */}
          <div className="hero__masthead">
            <div className="hero__masthead-rules">
              <span className="hero__masthead-rule--thick" />
              <span className="hero__masthead-rule--thin" />
            </div>
            <a href="#" className="hero__logo">Two Cents</a>
            <div className="hero__masthead-rules">
              <span className="hero__masthead-rule--thin" />
              <span className="hero__masthead-rule--thick" />
            </div>
          </div>

          <div className="hero__masthead-fade" />

          <div className="hero__content">
            <div className="hero__ornament">
              <span className="hero__ornament-line" />
              <span className="hero__ornament-diamond">◆</span>
              <span className="hero__ornament-line" />
            </div>

            <p className="hero__kicker">Read more. Think more. Say more.</p>

            <h1 className="hero__headline">
              Good writing finds its people here.
            </h1>

            <p className="hero__subtext">
              A place for the kind of thinking that doesn't fit in a caption.
            </p>

            <a href="#" className="cta-secondary">Browse Blogs →</a>
          </div>

        </section>
      )}

      {showFeed ? (
        /* ── Layout: sidebar + feed ── */
        <div className="home-layout">
          <aside className="home-sidebar">
            <nav className="home-sidebar__nav">
              <Link to="/" className="home-sidebar__item home-sidebar__item--active">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="home-sidebar__icon">
                  <path d="M3 11.5L12 4l9 7.5" />
                  <path d="M5 10v9h14v-9" />
                </svg>
                <span>Home</span>
              </Link>
              <Link to="/profile" className="home-sidebar__item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="home-sidebar__icon">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                </svg>
                <span>Profile</span>
              </Link>
              <span className="home-sidebar__item home-sidebar__item--disabled">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="home-sidebar__icon">
                  <path d="M6 3h12v18l-6-4-6 4V3z" />
                </svg>
                <span>Saved</span>
              </span>
              <span className="home-sidebar__item home-sidebar__item--disabled">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="home-sidebar__icon">
                  <path d="M12 2a6 6 0 0 0-6 6v3.5L4 16h16l-2-4.5V8a6 6 0 0 0-6-6z" />
                  <path d="M9 19a3 3 0 0 0 6 0" />
                </svg>
                <span>Subscriptions</span>
              </span>
            </nav>
          </aside>

          <main className="feed">
            <div className="feed__inner">
              <button type="button" className="feed__composer" onClick={() => setShowComposer(true)}>
                <span className="feed__avatar">{(user?.name ?? '?').charAt(0).toUpperCase()}</span>
                <span className="feed__composer-text">
                  Share your Two Cents, {user?.name ? capitalize(user.name.split(' ')[0]) : 'there'}
                </span>
              </button>

              {feedLoading && <p className="feed__state">Gathering the latest blogs…</p>}

              {!feedLoading && feedError && (
                <p className="feed__state feed__state--error">{feedError}</p>
              )}

              {!feedLoading && !feedError && feed.length === 0 && (
                <p className="feed__state">No blogs published yet. Be the first.</p>
              )}

              {!feedLoading && !feedError && feed.length > 0 && (
                <ol className="feed__list">
                  {feed.map(b => (
                    <li key={b.id} className="feed__item">
                      <h3 className="feed__title">{b.title}</h3>

                      <div className="feed__header">
                        <span className="feed__avatar">{b.authorName.charAt(0).toUpperCase()}</span>
                        <div className="feed__header-text">
                          <Link to={`/user/${b.authorId}`} className="feed__author">{capitalizeName(b.authorName)}</Link>
                          <span className="feed__date">
                            {new Date(b.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      <div className="feed__body">
                        <p className="feed__excerpt">{b.body}</p>
                      </div>

                      {b.tags.length > 0 && (
                        <div className="feed__tags">
                          {b.tags.map(t => (
                            <span key={t.id} className="feed__tag">{t.name}</span>
                          ))}
                        </div>
                      )}

                      <div className="feed__footer">
                        <button
                          onClick={() => toggleUpvote(b.id)}
                          className={`feed__upvotes${b.isUpvotedByCurrentUser ? ' feed__upvotes--active' : ''}`}
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor" className="feed__upvote-icon">
                            <path d="M12 2L3 13h5v9h8v-9h5L12 2z" />
                          </svg>
                          {b.upvoteCount}
                        </button>
                        <button
                          onClick={() => navigate(`/blog/${b.id}`)}
                          className="feed__comments"
                          aria-label="View comments"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="feed__comment-icon">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                          </svg>
                          {b.commentCount}
                        </button>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </main>
        </div>
      ) : (
        <>
          {/* ── Value props ── */}
          <div className="props">
            <div className="prop">
              <span className="prop__label">Read</span>
              <h3 className="prop__title">Blogs worth your time</h3>
              <p className="prop__body">
                Discover long-form opinions across philosophy, culture, politics, science, and more.
              </p>
            </div>
            <div className="prop">
              <span className="prop__label">Write</span>
              <h3 className="prop__title">Share your two cents</h3>
              <p className="prop__body">
                Publish your considered opinion to an audience that actually wants to read it.
              </p>
            </div>
            <div className="prop">
              <span className="prop__label">Connect</span>
              <h3 className="prop__title">Join the conversation</h3>
              <p className="prop__body">
                A growing community of thoughtful readers and writers who believe words still matter.
              </p>
            </div>
          </div>

          {/* ── Manifesto ── */}
          <div className="manifesto">
            <div className="manifesto__ornament">
              <span className="manifesto__ornament-line" />
              <span className="manifesto__ornament-diamond">◆</span>
              <span className="manifesto__ornament-line" />
            </div>
            <p className="manifesto__quote">
              "The world does not lack opinions. It lacks considered ones."
            </p>
            <span className="manifesto__cite">— Two Cents</span>
            <Link to="/signup" className="manifesto__link">Join the conversation</Link>
          </div>
        </>
      )}

      {!showFeed && (
        /* ── Footer ── */
        <footer className="footer">
          <div className="footer__bottom">
            <span>© 2026 Two Cents. All rights reserved.</span>
          </div>
        </footer>
      )}

      {showComposer && (
        <ComposerModal
          userName={user?.name}
          onClose={() => setShowComposer(false)}
          onPublished={() => {
            setShowComposer(false)
            loadFeed()
          }}
        />
      )}

    </div>
  )
}
