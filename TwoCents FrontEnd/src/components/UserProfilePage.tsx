import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { fetchWithAuth } from '../utils/fetchWithAuth'
import { BASE_URL } from '../config'
import './ProfilePage.css'

interface UserProfile {
  id: string
  name: string
  email: string
  gender?: string
}

interface Blog {
  id: string
  title: string
  body: string
  authorId: string
  authorName: string
  createdAt: string
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
      <div style={{ padding: 64, fontFamily: 'var(--font-ui)', color: 'var(--ink)' }}>
        {error || 'Writer not found.'}
      </div>
    )
  }

  return (
    <div className="pf-page">
      <div className="pf-body">

        {/* Left: Identity Panel */}
        <aside className="pf-panel">
          <button className="pf-panel__home" onClick={() => navigate(-1)}>&larr; Back</button>

          <div className="pf-panel__top">
            <div className="pf-panel__ornament">
              <span className="pf-panel__ornament-line" />
              <span className="pf-panel__ornament-diamond">&#9670;</span>
              <span className="pf-panel__ornament-line" />
            </div>
            <Link to="/" className="pf-panel__logo">Two Cents</Link>
            <p className="pf-panel__tagline">Good writing finds its people here.</p>
          </div>

          <div className="pf-panel__identity">
            <p className="pf-panel__kicker">Writer Profile</p>
            <h1 className="pf-panel__name">{profile.name}</h1>

            <dl className="pf-panel__fields">
              <div className="pf-panel__field">
                <dt>Email</dt>
                <dd>{profile.email}</dd>
              </div>
              {profile.gender && (
                <div className="pf-panel__field">
                  <dt>Gender</dt>
                  <dd>{profile.gender}</dd>
                </div>
              )}
            </dl>
          </div>

          <p className="pf-panel__byline">A writer at Two Cents.</p>
        </aside>

        {/* Right: Essays */}
        <section className="pf-essays-side">
          <div className="pf-essays-side__inner">
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
                {blogs.map((b, idx) => (
                  <li key={b.id} className="pf-essay">
                    <Link to={`/blog/${b.id}`} className="pf-essay__link">
                      <span className="pf-essay__num">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div className="pf-essay__content">
                        <h3 className="pf-essay__title">{b.title}</h3>
                        <p className="pf-essay__excerpt">{b.body}</p>
                        <span className="pf-essay__cta">Read essay &rarr;</span>
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
