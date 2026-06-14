import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchWithAuth } from '../utils/fetchWithAuth'
import { BASE_URL } from '../config'
import './SearchResultsPage.css'

interface UserResult {
  id: string
  name: string
}

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const [results, setResults] = useState<UserResult[]>([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!query.trim()) return

    setLoading(true)
    setLoaded(false)
    setResults([])

    fetchWithAuth(`${BASE_URL}/api/user?name=${encodeURIComponent(query)}`)
      .then(res => (res.ok ? res.json() : []))
      .then((data: UserResult[]) => setResults(data))
      .finally(() => {
        setLoading(false)
        setLoaded(true)
      })
  }, [query])

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
        <div className="sr-section-label">&#9670; Find Writers</div>
        <h1 className="sr-heading">
          {query ? <>Results for &ldquo;{query}&rdquo;</> : 'No query provided'}
        </h1>

        {loading && <p className="sr-status">Searching...</p>}

        {!loading && loaded && results.length === 0 && (
          <p className="sr-status">No writers found for &ldquo;{query}&rdquo;.</p>
        )}

        {results.length > 0 && (
          <ul className="sr-results">
            {results.map(u => (
              <li key={u.id} className="sr-result">
                <Link to={`/user/${u.id}`} className="sr-result__link">
                  <span className="sr-result__name">{u.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>

    </div>
  )
}
