import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { fetchWithAuth } from '../utils/fetchWithAuth'
import { BASE_URL } from '../config'
import './ProfilePage.css'

interface UserProfile {
  id: string
  name: string
}

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

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    let cancelled = false

    ;(async () => {
      try {
        const [userRes, blogsRes] = await Promise.all([
          fetchWithAuth(`${BASE_URL}/api/user/${id}`),
          fetchWithAuth(`${BASE_URL}/api/blog?authorId=${id}`),
        ])

        if (!userRes.ok) {
          if (!cancelled) setError('Writer not found.')
          return
        }

        const userData: UserProfile = await userRes.json()
        const allBlogs: Blog[] = blogsRes.ok ? await blogsRes.json() : []

        if (!cancelled) {
          setProfile(userData)
          setBlogs(allBlogs)
        }
      } catch {
        if (!cancelled) setError('Could not reach the server.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => { cancelled = true }
  }, [id])

  if (loading) return null

  if (error || !profile) {
    return (
      <div className="pf-page">
        <nav className="pf-nav">
          <button className="pf-nav__back" onClick={() => navigate(-1)}>← Back</button>
          <Link to="/" className="pf-nav__logo">Two Cents</Link>
          <span />
        </nav>
        <main className="pf-essays">
          <div className="pf-essays__inner">
            <p className="pf-essays__state pf-essays__state--error">{error || 'Writer not found.'}</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="pf-page">

      {/* Nav */}
      <nav className="pf-nav">
        <button className="pf-nav__back" onClick={() => navigate(-1)}>← Back</button>
        <Link to="/" className="pf-nav__logo">Two Cents</Link>
        <span />
      </nav>

      {/* Profile header */}
      <header className="pf-header">
        <div className="pf-header__inner">
          <h1 className="pf-header__name">{profile.name}</h1>

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
        </div>
      </header>

      {/* Essays */}
      <main className="pf-essays">
        <div className="pf-essays__inner">

          <div className="pf-essays__heading">
            <span className="pf-essays__heading-label">Essays</span>
            <span className="pf-essays__heading-count">
              {String(blogs.length).padStart(2, '0')}
            </span>
          </div>

          {blogs.length === 0 && (
            <p className="pf-essays__state">No essays published yet.</p>
          )}

          {blogs.length > 0 && (
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
