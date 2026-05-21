import './HomePage.css'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


export default function HomePage() {
  const { isLoggedIn, loading, logout } = useAuth()

  return (
    <div className="page">

      {/* ── Hero ── */}
      <section className="hero">

        {/* Slim auth strip */}
        <div className="hero__strip">
          {!loading && (
            isLoggedIn
              ? <>
                  <Link to="/dashboard" className="strip-link">Dashboard</Link>
                  <button onClick={logout} className="strip-btn">Logout</button>
                </>
              : <>
                  <Link to="/login" className="strip-link">Login</Link>
                  <Link to="/signup" className="strip-btn">Sign Up</Link>
                </>
          )}
        </div>

        {/* Masthead */}
        <div className="hero__masthead">
          <div className="hero__masthead-rules">
            <span className="hero__masthead-rule--thick" />
            <span className="hero__masthead-rule--thin" />
          </div>
          <a href="#" className="hero__logo">Two Cents</a>
          <div className="hero__masthead-rules">
            <span className="hero__masthead-rule--thin" />
            <span className="hero__masthead-rule--thick" />
          </div>
        </div>

        <div className="hero__masthead-fade" />

        <div className="hero__content">
          <div className="hero__ornament">
            <span className="hero__ornament-line" />
            <span className="hero__ornament-diamond">◆</span>
            <span className="hero__ornament-line" />
          </div>

          <p className="hero__kicker">Read more. Think more. Say more.</p>

          <h1 className="hero__headline">
            Good writing finds its people here.
          </h1>

          <p className="hero__subtext">
            A place for the kind of thinking that doesn't fit in a caption.
          </p>

          <a href="#" className="cta-secondary">Browse Essays →</a>
        </div>

      </section>

      {/* ── Value props ── */}
      <div className="props">
        <div className="prop">
          <span className="prop__label">Read</span>
          <h3 className="prop__title">Essays worth your time</h3>
          <p className="prop__body">
            Discover long-form opinions across philosophy, culture, politics, science, and more.
          </p>
        </div>
        <div className="prop">
          <span className="prop__label">Write</span>
          <h3 className="prop__title">Share your two cents</h3>
          <p className="prop__body">
            Publish your considered opinion to an audience that actually wants to read it.
          </p>
        </div>
        <div className="prop">
          <span className="prop__label">Connect</span>
          <h3 className="prop__title">Join the conversation</h3>
          <p className="prop__body">
            A growing community of thoughtful readers and writers who believe words still matter.
          </p>
        </div>
      </div>

      {/* ── Manifesto ── */}
      <div className="manifesto">
        <div className="manifesto__ornament">
          <span className="manifesto__ornament-line" />
          <span className="manifesto__ornament-diamond">◆</span>
          <span className="manifesto__ornament-line" />
        </div>
        <p className="manifesto__quote">
          "The world does not lack opinions. It lacks considered ones."
        </p>
        <span className="manifesto__cite">— Two Cents</span>
        <Link to="/signup" className="manifesto__link">Join the conversation</Link>
      </div>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer__bottom">
          <span>© 2026 Two Cents. All rights reserved.</span>
        </div>
      </footer>

    </div>
  )
}
