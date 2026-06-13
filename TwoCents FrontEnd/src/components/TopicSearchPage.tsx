import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchWithAuth } from '../utils/fetchWithAuth'
import { BASE_URL } from '../config'
import './SearchResultsPage.css'

interface BlogResult {
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

interface Tag {
  id: number
  name: string
  slug: string
}

export default function TagSearchPage() {
  const [searchParams] = useSearchParams()
  const tagsParam = searchParams.get('tags') ?? ''
  const tagIds = tagsParam ? tagsParam.split(',').map(t => parseInt(t, 10)).filter(id => !isNaN(id)) : []
  const [results, setResults] = useState<BlogResult[]>([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [tagNames, setTagNames] = useState<{ [key: number]: string }>({})

  useEffect(() => {
    if (tagIds.length === 0) return

    setLoading(true)
    setLoaded(false)
    setResults([])

    const tagQuery = tagIds.map(id => `tags=${id}`).join('&')
    fetchWithAuth(`${BASE_URL}/api/blog?${tagQuery}`)
      .then(res => (res.ok ? res.json() : []))
      .then((data: BlogResult[]) => setResults(data))
      .finally(() => {
        setLoading(false)
        setLoaded(true)
      })
  }, [tagsParam])

  useEffect(() => {
    if (tagIds.length === 0) return

    fetchWithAuth(`${BASE_URL}/api/tags`)
      .then(res => (res.ok ? res.json() : []))
      .then((data: Tag[]) => {
        const nameMap: { [key: number]: string } = {}
        data.forEach(tag => {
          nameMap[tag.id] = tag.name
        })
        setTagNames(nameMap)
      })
  }, [tagsParam])

  const displayTagNames = tagIds
    .map(id => tagNames[id])
    .filter(Boolean)

  return (
    <div className="sr-page">

      {/* Nav */}
      <header className="sr-nav">
        <Link to="/dashboard" className="sr-nav__back">&larr; Dashboard</Link>
        <Link to="/" className="sr-nav__logo">Two Cents</Link>
        <Link to="/profile" className="sr-nav__profile">Profile</Link>
      </header>

      {/* Body */}
      <main className="sr-main">
        <div className="sr-section-label">&#9670; Find Blogs by Topic</div>
        <h1 className="sr-heading">
          {displayTagNames.length > 0 ? (
            <>Results for {displayTagNames.map((name, i) => (
              <span key={name}>
                {i > 0 && ', '}
                &ldquo;{name}&rdquo;
              </span>
            ))}</>
          ) : (
            'No topics selected'
          )}
        </h1>

        {loading && <p className="sr-status">Searching...</p>}

        {!loading && loaded && results.length === 0 && (
          <p className="sr-status">No blogs found for the selected topics.</p>
        )}

        {results.length > 0 && (
          <ul className="sr-results">
            {results.map(blog => (
              <li key={blog.id} className="sr-result">
                <Link to={`/blog/${blog.id}`} className="sr-result__link">
                  <span className="sr-result__name">{blog.title}</span>
                  <span className="sr-result__email">
                    By {blog.authorName} · {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>

    </div>
  )
}

