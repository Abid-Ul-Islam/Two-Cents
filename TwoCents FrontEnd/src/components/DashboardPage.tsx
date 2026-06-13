import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchWithAuth } from '../utils/fetchWithAuth'
import { BASE_URL } from '../config'
import './DashboardPage.css'

interface Tag {
  id: number
  name: string
  slug: string
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [showTagSelector, setShowTagSelector] = useState(false)
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [tagsLoading, setTagsLoading] = useState(true)

  useEffect(() => {
    fetchWithAuth(`${BASE_URL}/api/tags`)
      .then(res => (res.ok ? res.json() : []))
      .then((data: Tag[]) => setAvailableTags(data))
      .finally(() => setTagsLoading(false))
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  function toggleTag(tagId: number) {
    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId)
      } else if (prev.length < 6) {
        return [...prev, tagId]
      }
      return prev
    })
  }

  function handleTagSearch(e: React.FormEvent) {
    e.preventDefault()
    if (selectedTags.length === 0) return
    const tagParams = selectedTags.join(',')
    navigate(`/search/tags?tags=${tagParams}`)
  }

  const selectedTagNames = availableTags
    .filter(tag => selectedTags.includes(tag.id))
    .map(tag => tag.name)

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
          </div>

          <Link to="/profile" className="db-panel__profile">My Profile</Link>
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

          <section className="db-search">
            <div className="db-search__heading">
              <span className="db-search__label">Find Blogs by Topic</span>
            </div>
            <button
              className="db-tag-selector-btn"
              onClick={() => setShowTagSelector(!showTagSelector)}
              type="button"
            >
              {selectedTags.length === 0
                ? 'Select Topics (up to 6)'
                : `${selectedTags.length} topic${selectedTags.length !== 1 ? 's' : ''} selected`}
            </button>

            {showTagSelector && (
              <div className="db-tag-selector">
                {tagsLoading ? (
                  <p className="db-tag-selector__loading">Loading topics...</p>
                ) : (
                  <div className="db-tag-selector__grid">
                    {availableTags.map(tag => (
                      <button
                        key={tag.id}
                        className={`db-tag ${selectedTags.includes(tag.id) ? 'db-tag--selected' : ''}`}
                        onClick={() => toggleTag(tag.id)}
                        type="button"
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedTags.length > 0 && (
              <div className="db-selected-tags">
                {selectedTagNames.map(tagName => (
                  <span key={tagName} className="db-selected-tag">
                    {tagName}
                    <button
                      className="db-selected-tag__remove"
                      onClick={() => {
                        const tagId = availableTags.find(t => t.name === tagName)?.id
                        if (tagId) toggleTag(tagId)
                      }}
                      type="button"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {selectedTags.length > 0 && (
              <form className="db-search__form" onSubmit={handleTagSearch}>
                <button className="db-search__btn" type="submit">Search by Topics</button>
              </form>
            )}
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
          </section>

        </main>
      </div>
    </div>
  )
}
