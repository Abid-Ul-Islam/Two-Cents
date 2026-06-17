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
    if (!loading && isLoggedIn) navigate('/', { replace: true });
  }, [isLoggedIn, loading, navigate]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const NAME_MIN = 3;
  const NAME_MAX = 50;
  const PASSWORD_MIN = 8;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const passwordChecks = [
    { label: `At least ${PASSWORD_MIN} characters`, ok: formData.password.length >= PASSWORD_MIN },
    { label: "A lowercase letter", ok: /[a-z]/.test(formData.password) },
    { label: "An uppercase letter", ok: /[A-Z]/.test(formData.password) },
    { label: "A number", ok: /[0-9]/.test(formData.password) },
    { label: "A special character", ok: /[^A-Za-z0-9]/.test(formData.password) },
  ];

  const validate = () => {
    const errors: Record<string, string> = {};

    const name = formData.name.trim();
    if (!name) {
      errors.name = "Full name is required";
    } else if (name.length < NAME_MIN) {
      errors.name = `Name must be at least ${NAME_MIN} characters`;
    } else if (name.length > NAME_MAX) {
      errors.name = `Name must be at most ${NAME_MAX} characters`;
    }

    const email = formData.email.trim();
    if (!email) {
      errors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(email)) {
      errors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (passwordChecks.some((c) => !c.ok)) {
      errors.password = "Password does not meet the requirements below";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setFormData({
      ...formData,
      [name]: e.target.value,
    });
    // clear a field's error as the user edits it
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Name: formData.name.trim(),
          Email: formData.email.trim(),
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
                  className={`sp-input${fieldErrors.name ? " sp-input--error" : ""}`}
                  aria-invalid={!!fieldErrors.name}
                />
                {fieldErrors.name && <span className="sp-field-error">{fieldErrors.name}</span>}
              </div>

              <div className="sp-field">
                <label className="sp-label">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`sp-input${fieldErrors.email ? " sp-input--error" : ""}`}
                  aria-invalid={!!fieldErrors.email}
                />
                {fieldErrors.email && <span className="sp-field-error">{fieldErrors.email}</span>}
              </div>

              <div className="sp-field">
                <label className="sp-label">Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Choose a password (min 8 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  className={`sp-input${fieldErrors.password ? " sp-input--error" : ""}`}
                  aria-invalid={!!fieldErrors.password}
                />
                {fieldErrors.password && <span className="sp-field-error">{fieldErrors.password}</span>}
                {formData.password && (
                  <ul className="sp-pwd-reqs">
                    {passwordChecks.map((c) => (
                      <li
                        key={c.label}
                        className={c.ok ? "sp-pwd-req sp-pwd-req--ok" : "sp-pwd-req"}
                      >
                        <span className="sp-pwd-req__mark">{c.ok ? "✓" : "○"}</span>
                        {c.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="sp-field">
                <label className="sp-label">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`sp-input${fieldErrors.confirmPassword ? " sp-input--error" : ""}`}
                  aria-invalid={!!fieldErrors.confirmPassword}
                />
                {fieldErrors.confirmPassword && <span className="sp-field-error">{fieldErrors.confirmPassword}</span>}
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
