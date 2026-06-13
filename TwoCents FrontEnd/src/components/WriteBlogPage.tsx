import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BASE_URL } from '../config'
import { useAuth } from '../context/AuthContext'
import { fetchWithAuth } from '../utils/fetchWithAuth'
import './WriteBlogPage.css'

interface Tag {
  id: number
  name: string
  slug: string
}

export default function WriteBlogPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState({ title: '', body: '' })
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [tagsLoading, setTagsLoading] = useState(true)
  const [tagLimitError, setTagLimitError] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(isEditing)

  useEffect(() => {
    let cancelled = false

    if (!id) {
      fetchWithAuth(`${BASE_URL}/api/tags`)
        .then(res => (res.ok ? res.json() : []))
        .then((data: Tag[]) => { if (!cancelled) setAvailableTags(data) })
        .finally(() => { if (!cancelled) setTagsLoading(false) })
      return () => { cancelled = true }
    }

    ;(async () => {
      try {
        const [tagsRes, blogRes] = await Promise.all([
          fetchWithAuth(`${BASE_URL}/api/tags`),
          fetchWithAuth(`${BASE_URL}/api/blog/${id}`),
        ])

        if (cancelled) return

        if (!blogRes.ok) {
          setError('Essay not found.')
          return
        }

        const [tagsData, blogData] = await Promise.all([
          tagsRes.ok ? tagsRes.json() : Promise.resolve([]),
          blogRes.json(),
        ])

        if (!cancelled) {
          setAvailableTags(tagsData)
          setTagsLoading(false)
          setFormData({ title: blogData.title, body: blogData.body })
          setSelectedTagIds((blogData.tags ?? []).map((t: Tag) => t.id))
        }
      } catch {
        if (!cancelled) setError('Could not reach the server.')
      } finally {
        if (!cancelled) setIsFetching(false)
      }
    })()

    return () => { cancelled = true }
  }, [id])

  function toggleTag(tagId: number) {
    setSelectedTagIds(prev => {
      if (prev.includes(tagId)) {
        setTagLimitError(false)
        return prev.filter(t => t !== tagId)
      }
      if (prev.length >= 6) {
        setTagLimitError(true)
        return prev
      }
      setTagLimitError(false)
      return [...prev, tagId]
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.title.trim() || !formData.body.trim()) {
      setError('Both a title and body are required')
      return
    }

    setIsLoading(true)
    try {
      const res = isEditing
        ? await fetchWithAuth(`${BASE_URL}/api/blog`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ BlogId: id, Title: formData.title, Body: formData.body, TagIds: selectedTagIds }),
          })
        : await fetchWithAuth(`${BASE_URL}/api/blog`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Title: formData.title, Body: formData.body, TagIds: selectedTagIds }),
          })

      if (res.ok) {
        if (isEditing) {
          navigate(`/blog/${id}`)
        } else {
          navigate('/write/success', { state: { title: formData.title, fromPublish: true } })
        }
      } else {
        const data = await res.json()
        setError(data.message ?? 'Something went wrong')
      }
    } catch {
      setError('Could not reach the server. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="wb-page">
        <header className="wb-nav">
          <Link to="/profile" className="wb-nav__back">← Profile</Link>
          <Link to="/" className="wb-nav__logo">Two Cents</Link>
          <div className="wb-nav__right">
            <Link to="/profile" className="wb-nav__profile">Profile</Link>
            <button onClick={logout} className="wb-nav__logout">Logout</button>
          </div>
        </header>
        <main className="wb-main">
          <p className="wb-section-label">Loading essay…</p>
        </main>
      </div>
    )
  }

  return (
    <div className="wb-page">

      {/* Nav */}
      <header className="wb-nav">
        <Link to={isEditing ? `/blog/${id}` : '/dashboard'} className="wb-nav__back">
          {isEditing ? '← Essay' : '← Dashboard'}
        </Link>
        <Link to="/" className="wb-nav__logo">Two Cents</Link>
        <div className="wb-nav__right">
          <Link to="/profile" className="wb-nav__profile">Profile</Link>
          <button onClick={logout} className="wb-nav__logout">Logout</button>
        </div>
      </header>

      {/* Editor */}
      <main className="wb-main">
        <div className="wb-section-label">{isEditing ? '◆ Edit Essay' : '◆ New Essay'}</div>

        {error && <p className="wb-error">{error}</p>}

        <form onSubmit={handleSubmit} className="wb-form">
          <input
            name="title"
            type="text"
            placeholder="Your title here…"
            value={formData.title}
            onChange={handleChange}
            className="wb-title-input"
            maxLength={200}
          />

          <div className="wb-divider" />

          <textarea
            name="body"
            placeholder="Write your essay…"
            value={formData.body}
            onChange={handleChange}
            className="wb-body-input"
          />

          {/* Tag selector */}
          <div className="wb-tags">
            <span className="wb-tags__label">◆ Topics</span>
            {tagLimitError && (
              <p className="wb-tags__limit-error">You can only select up to 6 topics.</p>
            )}
            {tagsLoading ? (
              <p className="wb-tags__loading">Loading topics…</p>
            ) : (
              <div className="wb-tags__grid">
                {availableTags.map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    className={`wb-tag${selectedTagIds.includes(tag.id) ? ' wb-tag--selected' : ''}`}
                    onClick={() => toggleTag(tag.id)}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="wb-actions">
            <button type="submit" className="wb-submit" disabled={isLoading}>
              {isLoading
                ? isEditing ? 'Saving…' : 'Publishing…'
                : isEditing ? 'Save Changes' : 'Publish Essay'}
            </button>
            <Link to={isEditing ? `/blog/${id}` : '/dashboard'} className="wb-cancel">Discard</Link>
          </div>
        </form>
      </main>

    </div>
  )
}
