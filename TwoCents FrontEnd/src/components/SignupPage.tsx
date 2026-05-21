import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import './SignupPage.css';

const PANEL_TEASERS = [
  { id: 1, category: 'Economics', title: 'Scarcity Was Always a Story We Told Ourselves' },
  { id: 2, category: 'Society', title: 'Why We Stopped Arguing and Started Performing' },
  { id: 3, category: 'Science', title: 'Certainty Is the Enemy of Inquiry' },
]


function SignupPage() {
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useAuth();

  useEffect(() => {
    if (!loading && isLoggedIn) navigate('/dashboard', { replace: true });
  }, [isLoggedIn, loading, navigate]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    password: "",
    confirmPassword: "",
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

    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Name: formData.name,
          Email: formData.email,
          Gender: formData.gender,
          Password: formData.password,
        }),
      });

      if (res.ok) {
        navigate("/login");
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
      <div className="sp-body">

        {/* Left: Dark Panel */}
        <div className="sp-panel">
          <Link to="/" className="sp-panel__home">← Home</Link>
          <div className="sp-panel__top">
            <div className="sp-panel__ornament">
              <span className="sp-panel__ornament-line" />
              <span className="sp-panel__ornament-diamond">◆</span>
              <span className="sp-panel__ornament-line" />
            </div>
            <Link to="/" className="sp-panel__logo">Two Cents</Link>
            <p className="sp-panel__tagline">Good writing finds its people here.</p>
            <div className="sp-panel__ornament">
              <span className="sp-panel__ornament-line" />
              <span className="sp-panel__ornament-diamond">◆</span>
              <span className="sp-panel__ornament-line" />
            </div>
          </div>

          <blockquote className="sp-panel__quote">
            <p>"To write is to think, and to think is to be free."</p>
            <cite>— Two Cents</cite>
          </blockquote>

          <div className="sp-panel__teasers">
            <div className="sp-panel__teasers-heading">What Awaits You</div>
            {PANEL_TEASERS.map((t, idx) => (
              <div key={t.id} className="sp-panel__teaser">
                <span className="sp-panel__teaser-num">{String(idx + 1).padStart(2, '0')}</span>
                <div>
                  <span className="sp-panel__teaser-cat">{t.category}</span>
                  <span className="sp-panel__teaser-title">{t.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Form */}
        <div className="sp-form-side">
          <Link to="/login" className="sp-form-side__nav">Login →</Link>
          <div className="sp-card">
            <div className="sp-card__header">
              <h2 className="sp-card__title">Create Account</h2>
              <p className="sp-card__subtitle">Join the conversation</p>
            </div>

            {error && <p className="sp-error">{error}</p>}

            <form onSubmit={handleSubmit} className="sp-form">
              <div className="sp-field">
                <label className="sp-label">Full Name</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="sp-input"
                  minLength={3}
                />
              </div>

              <div className="sp-field">
                <label className="sp-label">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="sp-input"
                />
              </div>

              <div className="sp-field">
                <label className="sp-label">Gender</label>
                <input
                  name="gender"
                  type="text"
                  placeholder="e.g. Male / Female"
                  value={formData.gender}
                  onChange={handleChange}
                  className="sp-input"
                />
              </div>

              <div className="sp-field">
                <label className="sp-label">Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Choose a password"
                  value={formData.password}
                  onChange={handleChange}
                  className="sp-input"
                />
              </div>

              <div className="sp-field">
                <label className="sp-label">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="sp-input"
                />
              </div>

              <button type="submit" className="sp-submit" disabled={isLoading}>
                {isLoading ? "Creating account…" : "Sign Up"}
              </button>
            </form>

            <p className="sp-footer-note">
              Already have an account?{" "}
              <Link to="/login" className="sp-link">Login</Link>
            </p>
          </div>
        </div>

      </div>

      {/* ── Footer ── */}
      <footer className="sp-footer">
        <div className="sp-footer__bottom">
          <span>© 2026 Two Cents. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}

export default SignupPage;
