import './HomePage.css'
import { Link } from 'react-router-dom'

const FEATURED_POST = {
  category: 'Philosophy',
  title: 'The Slow Erosion of Solitude in a Connected Age',
  excerpt:
    'We have engineered away every pocket of silence, and in doing so, may have silenced the very faculty that makes us thoughtful. The consequences run deeper than anyone cares to admit.',
  author: 'Nathaniel Howe',
  date: 'April 26, 2026',
  readTime: '7 min',
}

const SIDEBAR_POSTS = [
  {
    id: 1,
    category: 'Culture',
    title: 'What We Lose When Expertise Becomes Unfashionable',
    author: 'Vera Sinclair',
    date: 'April 24, 2026',
    readTime: '5 min',
  },
  {
    id: 2,
    category: 'Politics',
    title: 'On the Virtue of Changing One\'s Mind',
    author: 'Kwame Osei',
    date: 'April 22, 2026',
    readTime: '6 min',
  },
  {
    id: 3,
    category: 'Technology',
    title: 'The Algorithm Has No Opinion — Or Does It?',
    author: 'Lena Marsh',
    date: 'April 20, 2026',
    readTime: '4 min',
  },
]

const GRID_POSTS = [
  {
    id: 1,
    category: 'Economics',
    title: 'Scarcity Was Always a Story We Told Ourselves',
    author: 'Tobias Wren',
    date: 'April 25, 2026',
    readTime: '8 min',
    excerpt: 'The narratives that justify inequality are older than capitalism — and just as constructed.',
  },
  {
    id: 2,
    category: 'Society',
    title: 'Why We Stopped Arguing and Started Performing',
    author: 'Ines Calloway',
    date: 'April 23, 2026',
    readTime: '5 min',
    excerpt: 'Public discourse has become a stage. The audience matters more than the argument.',
  },
  {
    id: 3,
    category: 'Science',
    title: 'Certainty Is the Enemy of Inquiry',
    author: 'Dr. Arun Mehta',
    date: 'April 21, 2026',
    readTime: '6 min',
    excerpt: 'The most dangerous words in any laboratory are "we already know the answer."',
  },
  {
    id: 4,
    category: 'Culture',
    title: 'The Book You Never Finished Says More Than the One You Did',
    author: 'Sofia Renard',
    date: 'April 19, 2026',
    readTime: '4 min',
    excerpt: 'Abandonment is also a form of reading. What we put down reveals what we truly believe.',
  },
]

export default function HomePage() {
  return (
    <div className="page">

      {/* ── Top Strip ── */}
      <div className="topstrip">
            <Link to="/login" className="btn btn--outline">Login</Link>
            <Link to="/signup" className="btn btn--outline">Sign Up</Link>
      </div>

      {/* ── Masthead ── */}
      <header className="masthead">
        <div className="masthead__identity">
          <div className="ornament-rule">
            <span className="ornament-rule__line" />
            <span className="ornament-rule__diamond">◆</span>
            <span className="ornament-rule__line" />
          </div>
          <a href="#" className="site-logo">Two Cents</a>
          <p className="site-tagline">Where every considered opinion finds its place</p>
          <div className="ornament-rule">
            <span className="ornament-rule__line" />
            <span className="ornament-rule__diamond">◆</span>
            <span className="ornament-rule__line" />
          </div>
        </div>

      </header>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__lead">
          <span className="cat-badge">{FEATURED_POST.category}</span>
          <span className="featured-label">Editor's Pick</span>
          <h1 className="hero__title">{FEATURED_POST.title}</h1>
          <p className="hero__excerpt">{FEATURED_POST.excerpt}</p>
          <div className="hero__byline">
            <span className="byline__author">{FEATURED_POST.author}</span>
            <span className="byline__sep" aria-hidden />
            <span className="byline__meta">{FEATURED_POST.date} · {FEATURED_POST.readTime} read</span>
          </div>
          <a href="#" className="btn btn--read">Read Essay →</a>
        </div>

        <aside className="hero__sidebar">
          <h3 className="sidebar__heading">Also Trending</h3>
          <div className="sidebar__posts">
            {SIDEBAR_POSTS.map((post, idx) => (
              <a key={post.id} href="#" className="sidebar-post">
                <span className="sidebar-post__num">{String(idx + 1).padStart(2, '0')}</span>
                <div className="sidebar-post__body">
                  <span className="cat-badge cat-badge--sm">{post.category}</span>
                  <h4 className="sidebar-post__title">{post.title}</h4>
                  <span className="sidebar-post__meta">{post.author} · {post.readTime} read</span>
                </div>
              </a>
            ))}
          </div>
        </aside>
      </section>

      {/* ── Epigraph strip ── */}
      <div className="epigraph">
        <div className="epigraph__track">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="epigraph__item">
              "The mind is not a vessel to be filled, but a fire to be kindled." — Plutarch &emsp;◆&emsp;
            </span>
          ))}
        </div>
      </div>



      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer__bottom">
          <span>© 2026 Two Cents. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}
