import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchWithAuth } from '../utils/fetchWithAuth'
import { BASE_URL } from '../config'
import './BlogDetailPage.css'

interface Tag {
  id: number
  name: string
  slug: string
}

interface Blog {
  id: string
  title: string
  body: string
  authorId: string
  authorName: string
  createdAt: string
  tags: Tag[]
}

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user, logout } = useAuth()

  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    let cancelled = false

    ;(async () => {
      try {
        const res = await fetchWithAuth(`${BASE_URL}/api/blog/${id}`)
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
        <Link to="/dashboard" className="bd-nav__back">← Dashboard</Link>
        <Link to="/" className="bd-nav__logo">Two Cents</Link>
        <div className="bd-nav__right">
          <Link to="/profile" className="bd-nav__profile">Profile</Link>
          <button onClick={logout} className="bd-nav__logout">Logout</button>
        </div>
      </header>

      {/* Main */}
      <main className="bd-main">
        {loading && <p className="bd-state">Loading the essay…</p>}

        {!loading && error && (
          <p className="bd-state bd-state--error">{error}</p>
        )}

        {!loading && !error && blog && (
          <article className="bd-article">
            <div className="bd-kicker">
              <span>◆ Essay</span>
              {user?.id === blog.authorId && (
                <Link to={`/write/${blog.id}`} className="bd-edit-link">Edit →</Link>
              )}
            </div>
            <h1 className="bd-title">{blog.title}</h1>
            <div className="bd-meta">
              <span className="bd-meta__author">{blog.authorName}</span>
              <span className="bd-meta__sep">·</span>
              <span className="bd-meta__date">{new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
            {blog.tags.length > 0 && (
              <div className="bd-tags">
                {blog.tags.map(tag => (
                  <span key={tag.id} className="bd-tag">{tag.name}</span>
                ))}
              </div>
            )}
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
