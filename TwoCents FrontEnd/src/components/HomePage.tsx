import './HomePage.css'

const CATEGORIES = ['Philosophy', 'Culture', 'Politics', 'Society', 'Technology', 'Economics', 'Science']

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
        <span className="topstrip__date">Sunday, April 26, 2026</span>
        <span className="topstrip__edition">Vol. I &nbsp;·&nbsp; Est. 2026</span>
        <span className="topstrip__readers">98,000+ Readers</span>
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

        <div className="masthead__bar">
          <nav className="cat-nav" aria-label="Topics">
            {CATEGORIES.map((cat) => (
              <a key={cat} href="#" className="cat-nav__item">{cat}</a>
            ))}
          </nav>
          <div className="masthead__auth">
            <a href="#" className="btn btn--text-link">Login</a>
            <a href="#" className="btn btn--outline">Sign Up</a>
            <a href="#" className="btn btn--primary">Share Your Two Cents</a>
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

      {/* ── Articles Grid ── */}
      <section className="articles-section">
        <div className="articles-section__header">
          <div>
            <p className="section-kicker">Latest from our authors</p>
            <h2 className="section-title">Recent Opinions</h2>
          </div>
          <a href="#" className="btn btn--outline">View all essays</a>
        </div>

        <div className="articles-grid">
          {GRID_POSTS.map((post) => (
            <article key={post.id} className="article-card">
              <span className="cat-badge">{post.category}</span>
              <h3 className="article-card__title">{post.title}</h3>
              <p className="article-card__excerpt">{post.excerpt}</p>
              <div className="article-card__footer">
                <span className="article-card__author">{post.author}</span>
                <span className="article-card__meta">{post.date} · {post.readTime} read</span>
              </div>
              <a href="#" className="article-card__link">Continue reading →</a>
            </article>
          ))}
        </div>
      </section>

      {/* ── Pull Quote CTA ── */}
      <section className="pullquote-section">
        <div className="pullquote-section__inner">
          <div className="ornament-rule ornament-rule--center">
            <span className="ornament-rule__line" />
            <span className="ornament-rule__diamond">◆</span>
            <span className="ornament-rule__line" />
          </div>
          <blockquote className="pullquote">
            "The measure of intelligence is the ability to change."
            <cite className="pullquote__cite">— Albert Einstein</cite>
          </blockquote>
          <p className="pullquote-section__sub">
            Have something worth saying? This is where your perspective belongs.
          </p>
          <div className="pullquote-section__actions">
            <a href="#" className="btn btn--primary btn--lg">Share Your Two Cents</a>
            <a href="#" className="btn btn--outline">Create an Account</a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer__top">
          <div className="footer__brand">
            <span className="footer__logo">Two Cents</span>
            <p className="footer__tagline">Measured thought. Earnest debate.</p>
          </div>
          <div className="footer__cols">
            <div className="footer__col">
              <h4 className="footer__col-title">Publish</h4>
              <a href="#">Write an Essay</a>
              <a href="#">Submission Guide</a>
              <a href="#">Editorial Standards</a>
            </div>
            <div className="footer__col">
              <h4 className="footer__col-title">Explore</h4>
              <a href="#">All Topics</a>
              <a href="#">Featured Authors</a>
              <a href="#">Archives</a>
            </div>
            <div className="footer__col">
              <h4 className="footer__col-title">Company</h4>
              <a href="#">About</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Use</a>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© 2026 Two Cents. All rights reserved.</span>
          <span className="footer__signal">
            <span className="signal-dot" aria-hidden /> Publishing daily
          </span>
        </div>
      </footer>

    </div>
  )
}
