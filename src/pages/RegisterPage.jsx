import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8080/auth/register", { //можно проще, не полный путь
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        console.log("Registration successful");
        navigate("/dashboard"); // сразу на главную страницу после регистрации
      } else {
        const data = await response.json();
        setError(data.message || "Username already exists. Please try again.");
      }
    } catch (err) {
      console.error("Register error:", err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center vh-100"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div className="card p-4 shadow" style={{ maxWidth: 400, width: "100%", borderRadius: 8 }}>
        <h2 className="text-center mb-4">Register</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength="6"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>

        {error && <p className="error-message text-center mt-3 text-danger">{error}</p>}

        <div className="mt-3 text-center">
          <Link to="/login">Already have an account? Login here.</Link>
        </div>
      </div>
    </div>
  );
}
