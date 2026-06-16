import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchWithAuth } from '../utils/fetchWithAuth'
import { capitalizeName } from '../utils/text'
import { BASE_URL } from '../config'
import ComposerModal from './ComposerModal'
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
  const [showComposer, setShowComposer] = useState(false)

  function loadBlogs() {
    if (!user) return
    setBlogsLoading(true)
    setBlogsError('')
    return fetchWithAuth(`${BASE_URL}/api/blog?authorId=${user.id}`)
      .then(res => {
        if (!res.ok) {
          setBlogsError('Could not load your blogs.')
          return []
        }
        return res.json()
      })
      .then((data: Blog[]) => setBlogs(data))
      .catch(() => setBlogsError('Could not reach the server.'))
      .finally(() => setBlogsLoading(false))
  }

  useEffect(() => {
    loadBlogs()
  }, [user])

  if (!user) return null

  return (
    <div className="pf-page">

      {/* Nav */}
      <nav className="pf-nav">
        <Link to="/" className="pf-nav__back">← Home</Link>
        <Link to="/" className="pf-nav__logo">Two Cents</Link>
        <button onClick={logout} className="pf-nav__action">Logout</button>
      </nav>

      {/* Profile header */}
      <header className="pf-header">
        <div className="pf-header__inner">
          <h1 className="pf-header__name">{capitalizeName(user.name)}</h1>

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
                <span className="pf-stat__label">Blogs</span>
              </div>
              <div className="pf-stat">
                <span className="pf-stat__value">0</span>
                <span className="pf-stat__label">Subscribers</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Blogs */}
      <main className="pf-blogs">
        <div className="pf-blogs__inner">

          <div className="pf-blogs__heading">
            <span className="pf-blogs__heading-label">Your Blogs</span>
            {!blogsLoading && !blogsError && (
              <span className="pf-blogs__heading-count">
                {String(blogs.length).padStart(2, '0')}
              </span>
            )}
            <button type="button" className="pf-blogs__new" onClick={() => setShowComposer(true)}>
              + New Blog
            </button>
          </div>

          {blogsLoading && (
            <p className="pf-blogs__state">Gathering your words…</p>
          )}

          {!blogsLoading && blogsError && (
            <p className="pf-blogs__state pf-blogs__state--error">{blogsError}</p>
          )}

          {!blogsLoading && !blogsError && blogs.length === 0 && (
            <p className="pf-blogs__state">No blogs yet. The page is waiting.</p>
          )}

          {!blogsLoading && !blogsError && blogs.length > 0 && (
            <ol className="pf-blog-list">
              {blogs.map(b => (
                <li key={b.id} className="pf-blog">
                  <Link to={`/blog/${b.id}`} className="pf-blog__link">
                    <div className="pf-blog__top">
                      <h3 className="pf-blog__title">{b.title}</h3>
                      <span className="pf-blog__upvotes">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="pf-blog__upvote-icon">
                          <path d="M12 2L3 13h5v9h8v-9h5L12 2z" />
                        </svg>
                        {b.upvoteCount}
                      </span>
                    </div>
                    <div className="pf-blog__byline">
                      {b.tags.length > 0 && (
                        <span className="pf-blog__tags">
                          {b.tags.map(t => t.name).join(' · ')}
                        </span>
                      )}
                      <span className="pf-blog__date">
                        {new Date(b.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="pf-blog__excerpt">{b.body}</p>
                    <span className="pf-blog__cta">Read blog →</span>
                  </Link>
                </li>
              ))}
            </ol>
          )}

        </div>
      </main>

      {showComposer && (
        <ComposerModal
          userName={user.name}
          onClose={() => setShowComposer(false)}
          onPublished={() => {
            setShowComposer(false)
            loadBlogs()
          }}
        />
      )}

    </div>
  )
}
