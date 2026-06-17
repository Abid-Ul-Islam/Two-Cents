import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchWithAuth } from '../utils/fetchWithAuth'
import { capitalizeName } from '../utils/text'
import { BASE_URL } from '../config'
import ConfirmDialog from './ConfirmDialog'
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
  upvoteCount: number
  commentCount: number
  isUpvotedByCurrentUser: boolean
  tags: Tag[]
}

interface Comment {
  id: string
  content: string
  authorName: string
  createdAt: string
  isDeleted: boolean
}

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [upvoted, setUpvoted] = useState(false)
  const [upvoteCount, setUpvoteCount] = useState(0)
  const [commentCount, setCommentCount] = useState(0)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentsLoaded, setCommentsLoaded] = useState(false)
  const [commentsError, setCommentsError] = useState('')
  const [newComment, setNewComment] = useState('')
  const [posting, setPosting] = useState(false)
  const [postError, setPostError] = useState('')
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  async function confirmDelete() {
    setDeleting(true)
    setDeleteError('')
    try {
      const res = await fetchWithAuth(`${BASE_URL}/api/blog/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      navigate('/profile')
    } catch {
      setDeleteError('Could not delete the blog. Please try again.')
      setDeleting(false)
    }
  }

  async function toggleUpvote() {
    const wasUpvoted = upvoted
    setUpvoted(!wasUpvoted)
    setUpvoteCount(prev => wasUpvoted ? prev - 1 : prev + 1)

    try {
      const res = await fetchWithAuth(`${BASE_URL}/api/blog/${id}/vote`, {
        method: wasUpvoted ? 'DELETE' : 'POST',
      })
      if (!res.ok) throw new Error()
    } catch {
      setUpvoted(wasUpvoted)
      setUpvoteCount(prev => wasUpvoted ? prev + 1 : prev - 1)
    }
  }

  async function toggleComments() {
    const willOpen = !commentsOpen
    setCommentsOpen(willOpen)

    if (willOpen && !commentsLoaded) {
      setCommentsLoading(true)
      setCommentsError('')
      try {
        const res = await fetchWithAuth(`${BASE_URL}/api/comment/${id}`)
        if (!res.ok) throw new Error()
        const data: Comment[] = await res.json()
        setComments(data.filter(c => !c.isDeleted))
        setCommentsLoaded(true)
      } catch {
        setCommentsError('Could not load comments.')
      } finally {
        setCommentsLoading(false)
      }
    }
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault()
    const content = newComment.trim()
    if (!content || posting) return

    setPosting(true)
    setPostError('')
    try {
      const res = await fetchWithAuth(`${BASE_URL}/api/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, blogId: id }),
      })
      if (!res.ok) throw new Error()
      const created: Comment = await res.json()
      setComments(prev => [...prev, created])
      setCommentCount(prev => prev + 1)
      setNewComment('')
    } catch {
      setPostError('Could not post your comment. Please try again.')
    } finally {
      setPosting(false)
    }
  }

  useEffect(() => {
    if (!id) return
    let cancelled = false

    ;(async () => {
      try {
        const res = await fetchWithAuth(`${BASE_URL}/api/blog/${id}`)
        if (!res.ok) {
          if (!cancelled) setError('Blog not found.')
          return
        }
        const data: Blog = await res.json()
        if (!cancelled) {
          setBlog(data)
          setUpvoted(data.isUpvotedByCurrentUser)
          setUpvoteCount(data.upvoteCount)
          setCommentCount(data.commentCount)
        }
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
        <Link to="/" className="bd-nav__back">← Home</Link>
        <Link to="/" className="bd-nav__logo">Two Cents</Link>
        <div className="bd-nav__right">
          <Link to="/profile" className="bd-nav__profile">Profile</Link>
          <button onClick={logout} className="bd-nav__logout">Logout</button>
        </div>
      </header>

      {/* Main */}
      <main className="bd-main">
        {loading && <p className="bd-state">Loading the blog…</p>}

        {!loading && error && (
          <p className="bd-state bd-state--error">{error}</p>
        )}

        {!loading && !error && blog && (
          <article className="bd-article">
            <div className="bd-kicker">
              <span>◆ Blog</span>
              {user?.id === blog.authorId && (
                <span className="bd-author-actions">
                  <Link to={`/write/${blog.id}`} className="bd-edit-link">Edit →</Link>
                  <button
                    type="button"
                    className="bd-delete-link"
                    onClick={() => setConfirmingDelete(true)}
                  >
                    Delete
                  </button>
                </span>
              )}
            </div>
            <h1 className="bd-title">{blog.title}</h1>
            <div className="bd-meta">
              <Link to={`/user/${blog.authorId}`} className="bd-meta__author">{capitalizeName(blog.authorName)}</Link>
              <span className="bd-meta__sep">·</span>
              <span className="bd-meta__date">{new Date(blog.createdAt).toLocaleDateString()}</span>
              <span className="bd-meta__sep">·</span>
              <button
                onClick={toggleUpvote}
                className={`bd-upvote${upvoted ? ' bd-upvote--active' : ''}`}
              >
                <svg className="bd-upvote__icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L3 13h5v9h8v-9h5L12 2z" />
                </svg>
                {upvoteCount}
              </button>
              <span className="bd-meta__sep">·</span>
              <button
                onClick={toggleComments}
                className={`bd-comment-toggle${commentsOpen ? ' bd-comment-toggle--active' : ''}`}
                aria-expanded={commentsOpen}
              >
                <svg className="bd-comment-toggle__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                {commentCount}
              </button>
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

            {commentsOpen && (
              <section className="bd-comments">
                <div className="bd-divider" />
                <h2 className="bd-comments__heading">
                  Comments {commentsLoaded && `(${comments.length})`}
                </h2>

                {user ? (
                  <form className="bd-comment-form" onSubmit={submitComment}>
                    <textarea
                      className="bd-comment-form__input"
                      placeholder="Share your thoughts…"
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      rows={3}
                      disabled={posting}
                    />
                    {postError && <p className="bd-comments__state bd-comments__state--error">{postError}</p>}
                    <div className="bd-comment-form__actions">
                      <button
                        type="submit"
                        className="bd-comment-form__submit"
                        disabled={posting || !newComment.trim()}
                      >
                        {posting ? 'Posting…' : 'Post comment'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="bd-comments__state">
                    <Link to="/login" className="bd-comment-login">Log in</Link> to join the conversation.
                  </p>
                )}

                {commentsLoading && (
                  <p className="bd-comments__state">Loading comments…</p>
                )}

                {!commentsLoading && commentsError && (
                  <p className="bd-comments__state bd-comments__state--error">{commentsError}</p>
                )}

                {!commentsLoading && !commentsError && commentsLoaded && comments.length === 0 && (
                  <p className="bd-comments__state">No comments yet.</p>
                )}

                {!commentsLoading && !commentsError && comments.length > 0 && (
                  <ul className="bd-comment-list">
                    {comments.map(c => (
                      <li key={c.id} className="bd-comment">
                        <div className="bd-comment__head">
                          <span className="bd-comment__author">{capitalizeName(c.authorName)}</span>
                          <span className="bd-comment__date">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="bd-comment__content">{c.content}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}
          </article>
        )}
      </main>

      {confirmingDelete && blog && (
        <ConfirmDialog
          title="Delete this blog?"
          message={
            deleteError ||
            `“${blog.title}” will be permanently deleted. This cannot be undone.`
          }
          busy={deleting}
          onConfirm={confirmDelete}
          onCancel={() => {
            setConfirmingDelete(false)
            setDeleteError('')
          }}
        />
      )}

    </div>
  )
}
