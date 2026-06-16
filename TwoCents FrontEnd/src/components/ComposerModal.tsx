import { useState, useEffect } from 'react'
import { fetchWithAuth } from '../utils/fetchWithAuth'
import { capitalize, capitalizeName } from '../utils/text'
import { BASE_URL } from '../config'
import './ComposerModal.css'

interface Tag {
  id: number
  name: string
  slug: string
}

interface ComposerModalProps {
  userName?: string
  onClose: () => void
  onPublished: () => void
}

export default function ComposerModal({ userName, onClose, onPublished }: ComposerModalProps) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
  const [tagsLoading, setTagsLoading] = useState(true)
  const [tagLimitError, setTagLimitError] = useState(false)
  const [error, setError] = useState('')
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    fetchWithAuth(`${BASE_URL}/api/tags`)
      .then(res => (res.ok ? res.json() : []))
      .then((data: Tag[]) => setAvailableTags(data))
      .finally(() => setTagsLoading(false))
  }, [])

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

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!title.trim() || !body.trim()) {
      setError('Both a title and body are required')
      return
    }

    setPosting(true)
    try {
      const res = await fetchWithAuth(`${BASE_URL}/api/blog`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Title: title, Body: body, TagIds: selectedTagIds }),
      })

      if (res.ok) {
        onPublished()
      } else {
        const data = await res.json()
        setError(data.message ?? 'Something went wrong')
      }
    } catch {
      setError('Could not reach the server. Please try again.')
    } finally {
      setPosting(false)
    }
  }

  const firstName = userName ? capitalize(userName.split(' ')[0]) : ''

  return (
    <div className="composer-overlay" onClick={onClose}>
      <div className="composer-modal" onClick={e => e.stopPropagation()}>
        <div className="composer-modal__header">
          <span className="composer-modal__title">Create Blog</span>
          <button className="composer-modal__close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="composer-modal__author">
          <span className="composer-modal__avatar">{(userName ?? '?').charAt(0).toUpperCase()}</span>
          <span className="composer-modal__author-name">{userName ? capitalizeName(userName) : ''}</span>
        </div>

        {error && <p className="composer-modal__error">{error}</p>}

        <form onSubmit={handlePublish} className="composer-modal__form">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="composer-modal__title-input"
            maxLength={200}
          />

          <textarea
            placeholder={`What's your two cents, ${firstName}?`}
            value={body}
            onChange={e => setBody(e.target.value)}
            className="composer-modal__body-input"
          />

          <div className="composer-modal__tags">
            {tagLimitError && (
              <p className="composer-modal__tags-error">You can only select up to 6 topics.</p>
            )}
            {tagsLoading ? (
              <p className="composer-modal__tags-loading">Loading topics…</p>
            ) : (
              <div className="composer-modal__tags-grid">
                {availableTags.map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    className={`composer-modal__tag${selectedTagIds.includes(tag.id) ? ' composer-modal__tag--selected' : ''}`}
                    onClick={() => toggleTag(tag.id)}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="composer-modal__submit" disabled={posting}>
            {posting ? 'Posting…' : 'Post'}
          </button>
        </form>
      </div>
    </div>
  )
}
