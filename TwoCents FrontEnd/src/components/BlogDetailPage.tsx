import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchWithAuth } from '../utils/fetchWithAuth'
import { BASE_URL } from '../config'
import './BlogDetailPage.css'

interface Blog {
  id: string
  title: string
  body: string
}

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    let cancelled = false

    ;(async () => {
      try {
        const res = await fetchWithAuth(`${BASE_URL}/api/blog/getblog/${id}`)
        if (!res.ok) {
          if (!cancelled) setError('Essay not found.')
          return
        }
        const data: Blog = await res.json()
        if (!cancelled) setBlog(data)
      } catch {
        if (!cancelled) setError('Could not reach the server.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => { cancelled = true }
  }, [id])

  return (
    <div className="bd-page">

      {/* Nav */}
      <header className="bd-nav">
        <button onClick={() => navigate(-1)} className="bd-nav__back">← Back</button>
        <Link to="/" className="bd-nav__logo">Two Cents</Link>
        <button onClick={logout} className="bd-nav__logout">Logout</button>
      </header>

      {/* Main */}
      <main className="bd-main">
        {loading && <p className="bd-state">Loading the essay…</p>}

        {!loading && error && (
          <p className="bd-state bd-state--error">{error}</p>
        )}

        {!loading && !error && blog && (
          <article className="bd-article">
            <div className="bd-kicker">◆ Essay</div>
            <h1 className="bd-title">{blog.title}</h1>
            <div className="bd-divider" />
            <div className="bd-body">
              {blog.body.split('\n').map((para, i) =>
                para.trim() ? <p key={i}>{para}</p> : null
              )}
            </div>
          </article>
        )}
      </main>

    </div>
  )
}
