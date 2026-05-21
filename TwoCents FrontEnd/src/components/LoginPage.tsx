import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './LoginPage.css';

const PANEL_TEASERS = [
  { id: 1, category: 'Philosophy', title: 'The Slow Erosion of Solitude in a Connected Age' },
  { id: 2, category: 'Culture', title: 'What We Lose When Expertise Becomes Unfashionable' },
  { id: 3, category: 'Politics', title: 'On the Virtue of Changing One\'s Mind' },
]

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }


    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:7104/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: formData.email, Password: formData.password }),
      });

      if (res.ok) {
        navigate("/dashboard");
      } else {
        const data = await res.json();
        setError(data.message ?? "Something went wrong");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page">

      {/* ── Split Body ── */}
      <div className="lp-body">

        {/* Left: Dark Panel */}
        <div className="lp-panel">
          <Link to="/" className="lp-panel__home">← Home</Link>
          <div className="lp-panel__top">
            <div className="lp-panel__ornament">
              <span className="lp-panel__ornament-line" />
              <span className="lp-panel__ornament-diamond">◆</span>
              <span className="lp-panel__ornament-line" />
            </div>
            <Link to="/" className="lp-panel__logo">Two Cents</Link>
            <p className="lp-panel__tagline">Good writing finds its people here.</p>
            <div className="lp-panel__ornament">
              <span className="lp-panel__ornament-line" />
              <span className="lp-panel__ornament-diamond">◆</span>
              <span className="lp-panel__ornament-line" />
            </div>
          </div>

          <blockquote className="lp-panel__quote">
            <p>"The mind is not a vessel to be filled, but a fire to be kindled."</p>
            <cite>— Plutarch</cite>
          </blockquote>

          <div className="lp-panel__teasers">
            <div className="lp-panel__teasers-heading">Currently Reading</div>
            {PANEL_TEASERS.map((t, idx) => (
              <div key={t.id} className="lp-panel__teaser">
                <span className="lp-panel__teaser-num">{String(idx + 1).padStart(2, '0')}</span>
                <div>
                  <span className="lp-panel__teaser-cat">{t.category}</span>
                  <span className="lp-panel__teaser-title">{t.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Form */}
        <div className="lp-form-side">
          <Link to="/signup" className="lp-form-side__nav">Sign Up →</Link>
          <div className="lp-card">
            <div className="lp-card__header">
              <h2 className="lp-card__title">Welcome Back</h2>
              <p className="lp-card__subtitle">Sign in to continue reading</p>
            </div>

            {error && <p className="lp-error">{error}</p>}

            <form onSubmit={handleSubmit} className="lp-form">
              <div className="lp-field">
                <label className="lp-label">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="lp-input"
                />
              </div>

              <div className="lp-field">
                <label className="lp-label">Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="lp-input"
                />
              </div>

              <button type="submit" className="lp-submit" disabled={isLoading}>
                {isLoading ? "Logging in…" : "Login"}
              </button>
            </form>

            <p className="lp-footer-note">
              Don't have an account?{" "}
              <Link to="/signup" className="lp-link">Sign Up</Link>
            </p>
          </div>
        </div>

      </div>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <div className="lp-footer__bottom">
          <span>© 2026 Two Cents. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}
