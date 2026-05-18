import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

async function getApiResponse(name, email, gender, password) {
  try {
    const res = await fetch("http://localhost:7104/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Name: name,
        Email: email,
        Gender: gender,
        Password: password,
      }),
    });

    const data = await res.json();
    return data;

  } catch (err) {
    console.error("Error:", err);
  }
}

function  SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

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

  try {
    const data = await getApiResponse(
      formData.name,
      formData.email,
      formData.gender,
      formData.password
    );

    console.log("API response:", data);

    // navigate ONLY after success
    navigate("/login");

  } catch (err) {
    console.error(err);
    setError("Something went wrong");
  }
};

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
            minLength={3}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />

        <input
            name="gender"
            type="text"
            placeholder="gender"
            value={formData.gender}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Sign Up
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8",
  },
  card: {
    width: "350px",
    padding: "30px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    margin: "8px 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
  },
  button: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
  footer: {
    marginTop: "15px",
    fontSize: "14px",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
  },
};

export default SignupPage;